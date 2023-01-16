# API Node.js com Typescript

## Configurações Iniciais

### Configurando eslint com Node.js e Typescript

lint: análise de código estático

```console
$ yarn add -D @typescript-eslint/eslint-plugin eslint @typescript-eslint/parser
```

Em package.json, acrescentar no item scripts:

```json
{
    "lint": "eslint ./src ./test --ext .ts",
    "lint:fix": "eslint ./src ./test --ext .ts --fix"
}
```

Com a configuração acima, é necessário que haja ao menos um arquivo .ts nas pastas src e test.

### Configurando Typescript em dev com ts-node e ts-node-dev

ts-node possibilita rodar o node direto do arquivo typescript.

```console
$ yarn add -D ts-node-dev
```
Em package.json, acrescentar no item scripts:

```json
{
    "start:dev": "ts-node-dev 'src/index.ts'"
}
```

### Configurando Jest em Node.js com Typescript

```console
$ yarn add -D jest ts-jest @types/jest
```

Em jest.config.js:

```javascript
const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  }
};
```

Na pasta test, cria-se outra configuração para os testes funcionais (end-to-end):

```javascript
const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/test/**/*.test.ts"]
}}
```

Criando o arquivo jest-setup.ts

Adicionando o supertest:
```console
$ yarn add -S supertest @types/supertest
```
Criando um diretório para os testes funcionais em test, adicionando ao arquivo forecast.test.ts:

```typescript
import supertest from "supertest";

describe('Beach forecast functional tests', () => {
    it('should return a forecast with just a few times', async () => {
      const { body, status } = await supertest(app).get('/forecast');
      expect(status).toBe(200);
      expect(body).toEqual([ // toEqual: verifica se os campos sao iguais
        {
          time: '2020-04-26T00:00:00+00:00',
          forecast: [
            {
              lat: -33.792726,
              lng: 151.289824,
              name: 'Manly',
              position: 'E',
              rating: 2,
              swellDirection: 64.26,
              swellHeight: 0.15,
              swellPeriod: 3.89,
              time: '2020-04-26T00:00:00+00:00',
              waveDirection: 231.38,
              waveHeight: 0.47,
              windDirection: 299.45,
            },
          ],
        },
        {
          time: '2020-04-26T01:00:00+00:00',
          forecast: [
            {
              lat: -33.792726,
              lng: 151.289824,
              name: 'Manly',
              position: 'E',
              rating: 2,
              swellDirection: 123.41,
              swellHeight: 0.21,
              swellPeriod: 3.67,
              time: '2020-04-26T01:00:00+00:00',
              waveDirection: 232.12,
              waveHeight: 0.46,
              windDirection: 310.48,
            },
          ],
        },
      ]);
    });
  });
```

Em package.json, acrescentar no item scripts:

```json
{
     "test:functional": "jest --projects ./test --forceExit --runInBand",
}
```
Os testes podem ser executados rodando no console:
```console
$ yarn test:functional
```

### Iniciando a API Node.js com OvernightJS e express

Instalando o express (framework web) e o overnightjs(facilita o uso do express utilizando annotations)

```console
$ yarn add express body-parser @overnightjs/core
$ yarn add -D @types/express
```

Criando o arquivo principal server.ts:

```typescript
import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';

export class SetupServer extends Server {

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
```

Inicializando todos os testes no arquivo jest-setup.ts:
```typescript
import { SetupServer } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
})
```

Criando um tipo testRequest de forma global em globals.d.ts (decoration):

```typescript
declare global {
  // import inline: importante para uso global da variavel
  //eslint-disable-next-line no-var
  var testRequest: import("supertest").SuperTest<import("supertest").Test>;
}

export {};
```

Alterando o await do forecast.test.ts para usar o testRequest

```typescript
const { body, status } = await global.testRequest.get('/forecast');
```
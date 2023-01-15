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
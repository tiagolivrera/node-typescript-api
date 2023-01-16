import { SetupServer } from '@src/server';
import supertest from 'supertest';

// inicializa o server no modo teste
beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
})

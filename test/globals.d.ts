declare global {
  // import inline: importante para uso global da variavel
  //eslint-disable-next-line no-var
  var testRequest: import("supertest").SuperTest<import("supertest").Test>;
}

export {};

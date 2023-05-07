import request from 'supertest';
import { app } from '../../src/app.js';

describe('POST /users', () => {
  it('Debería crear un usuario satisfactoriamente', async () => {
    await request(app).post('/users').send({
      name: "Eduardo Segredo",
      username: "esegredo"
    }).expect(201);
  });

  it('No debería crear un usuario satisfactoriamente', async () => {
    await request(app).post('/users').send({
      name: "Eduardo Segredo"
    }).expect(500);
  });
});

// describe('DELETE /users', () => {
//   it('Debería eliminar un usuario satisfactoriamente', async () => {
//     await request(app).delete('/users').send({
//       name: "Eduardo Segredo",
//       username: "esegredo"
//     }).expect(201);
//   });

//   it('No debería eliminar un usuario satisfactoriamente, si no existe', async () => {
//     await request(app).delete('/users').send({
//       name: "Eduardo Segredo"
//     }).expect(500);
//   });
// });
import request from 'supertest';
import { app } from '../../src/app.js';
import { expect } from 'chai';
import { User } from '../../src/models/userModel.js';


beforeEach(async () => {
  await User.deleteMany();
});

after(async () => {
  await User.deleteMany();
});

it('Should successfully create a new user', async () => {
  const response = await request(app).post('/users').send({
    name: "Alejandro Marrero",
    username: "amarrerd"
  }).expect(201);

  expect(response.body).to.include({
    name: "Alejandro Marrero",
    username: "amarrerd",
    activity: "Correr"
  });
  
  const secondUser = await User.findById(response.body._id);
  expect(secondUser).not.to.be.null;
  expect(secondUser!.username).to.equal('amarrerd');
});
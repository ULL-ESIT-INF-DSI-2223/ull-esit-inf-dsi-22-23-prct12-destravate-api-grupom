import request from 'supertest';
import { app } from '../../src/app.js';
import { expect } from 'chai';
import { User } from '../../src/models/userModel.js';
import { Group } from '../../src/models/groupModel.js';
import { Challenge } from '../../src/models/challengeModel.js';
import { Track } from '../../src/models/trackModel.js';


before(async () => {
  await User.deleteMany();
  await Group.deleteMany();
  await Track.deleteMany();
  await Challenge.deleteMany();
});


after(async () => {
  await User.deleteMany();
  await Group.deleteMany();
  await Track.deleteMany();
  await Challenge.deleteMany();
});


describe('POST /challenge', () => {
  it('Un reto se crea con los parámetros mínimos correctamente', async () => {
    const response = await request(app).post('/challenges').send({
      id: 1,
      name: "RetoTesteoFondoBikini",
      tracks: [],
      activity: "Correr",
    }).expect(201);

    expect(response.body.tracks).to.eql([]);
  });
});


describe('PATCH /challenge', () => {
  it('Los retos se deberían poder actualizar correctamente pasando los parámetros como query', async () => {

    const response = await request(app).patch('/challenges?id=1').send({
      name: "ElMejorReto"
    }).expect(200);
    
    expect(response.body.name).to.eql('ElMejorReto');
  });

  it('Se debería gestionar los distintos casos en los que se da error (query)', async () => {
    await request(app).patch('/challenges?id=').expect(400);
    await request(app).patch('/challenges?id=1').send({
      id: 1,
    }).expect(400);
    await request(app).patch('/challenges?id=10000').expect(404);
  });
});


describe('PATCH /challenge', () => {
  it('Los retos se deberían poder actualizar correctamente pasando los parámetros como ruta', async () => {

    const response = await request(app).patch('/challenges/1').send({
      name: "ElMejorReto"
    }).expect(200);
    
    expect(response.body.name).to.eql('ElMejorReto');
  });

  
  it('Se debería gestionar los distintos casos en los que se da error (ruta)', async () => {
    await request(app).patch('/challenges/').expect(400);
    await request(app).patch('/challenges/1').send({
      id: 1,
    }).expect(400);
    await request(app).patch('/challenges/10000').expect(404);
  });

});


describe('GET /challenge', () => {
  it('Los retos se deberían poder actualizar correctamente pasando los parámetros como query', async () => {

    const response = await request(app).get('/challenges?id=1').expect(200);
    expect(response.body[0].name).to.be.equal('ElMejorReto');
  });

  it('Los retos se deberían poder actualizar correctamente pasando los parámetros como ruta', async () => {

    const response = await request(app).get('/challenges/1').expect(200);
    expect(response.body[0].name).to.be.equal('ElMejorReto');
  });

  it ('No se obtiene un grupo correctamente', async () => {
    await request(app).get('/challenges?id=1000').expect(404);
  });

  it ('No se obtiene un grupo correctamente', async () => {
    await request(app).get('/challenges/1000').expect(404);
  });
});

describe('DELETE /challenge', () => {
  it('Los retos se deberían poder eliminar correctamente pasando los parámetros como query', async () => {
    const Reto = await request(app).post('/challenges').send({
      id: 4,
      name: "RetoEliminar4",
      tracks: [],
      activity: "Correr",
    });

    const response = await request(app).delete('/challenges?id=4').expect(200);
    expect(response.body.name).to.be.equal('RetoEliminar4');
    expect(response.body.id).to.be.equal(4);
    expect(response.body.tracks).to.be.eql([]);
    expect(response.body.activity).to.be.equal('Correr');
  });

  it('Los retos se deberían poder eliminar correctamente pasando los parámetros como ruta', async () => {
    const Reto = await request(app).post('/challenges').send({
      id: 5,
      name: "RetoEliminar5",
      tracks: [],
      activity: "Correr",
    });

    const response = await request(app).delete('/challenges/5').expect(200);
    expect(response.body.name).to.be.equal('RetoEliminar5');
    expect(response.body.id).to.be.equal(5);
    expect(response.body.tracks).to.be.eql([]);
    expect(response.body.activity).to.be.equal('Correr');
  });

  
  it('No se elimina un reto correctamente', async () => {
    await request(app).delete('/challenges?id=1000').expect(404);
    await request(app).delete('/challenges?id=').expect(400);
  });

  it('No se elimina un reto correctamente', async () => {
    await request(app).delete('/challenges/1000').expect(404);
    await request(app).delete('/challenges/').expect(400);
  });

});

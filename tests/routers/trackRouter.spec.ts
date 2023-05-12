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

describe('POST /track', () => {
  it('Una ruta se crea con los parámetros mínimos correctamente', async () => {
    const ruta = await request(app).post('/tracks').send({
      id: 11,
      name: "RutaFondoBiKini",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 3,
      unevenness: 4,
      activity: "Correr",
      users: []
    }).expect(201);
    
    
    expect(ruta.body).to.include({
      name: "RutaFondoBiKini",
      distance: 3,
      unevenness: 4,
      activity: "Correr",
    });

    expect(ruta.body.startGeolocation).to.be.eql([0,0]);
    expect(ruta.body.endGeolocation).to.be.eql([1,1]);
    expect(ruta.body.users).to.be.eql([]);

    
    const checkFirstTrack = await Track.findById(ruta.body._id);
    expect(checkFirstTrack).not.to.be.null;
    expect(checkFirstTrack!.id).to.equal(11);   
    expect(ruta.body.name).to.be.equal("RutaFondoBiKini");
  });

  it('Una ruta deberia falalr si se intenta crear con parámetros insifucientes', async () => {
    const ruta = await request(app).post('/tracks').send({}).expect(500);
  });
});


describe('PATCH /track', () => {
  it('Las rutas se deberían poder actualizar correctamente pasando los parámetros como query', async () => {

    const response = await request(app).patch('/tracks?id=11').send({
      name: "LaMejorRuta"
    }).expect(200);
    
    expect(response.body.name).to.eql('LaMejorRuta');
  });

  it('Se debería gestionar los distintos casos en los que se da error (query)', async () => {
    await request(app).patch('/tracks?id=').expect(400);
    await request(app).patch('/tracks?id=11').send({
      id: 1,
    }).expect(400);
    await request(app).patch('/tracks?id=10000').expect(404);
  });
});


describe('PATCH /track', () => {
  it('Las rutas se deberían poder actualizar correctamente pasando los parámetros como ruta', async () => {

    const response = await request(app).patch('/tracks/11').send({
      name: "LaMejorRuta"
    }).expect(200);
    
    expect(response.body.name).to.eql('LaMejorRuta');
  });

  
  it('Se debería gestionar los distintos casos en los que se da error (ruta)', async () => {
    await request(app).patch('/tracks/').expect(400);
    await request(app).patch('/tracks/11').send({
      id: 1,
    }).expect(400);
    await request(app).patch('/tracks/10000').expect(404);
  });

});


describe('GET /track', () => {
  it('Deberia devolver todas las rutas', async () => {
    const rutas = await request(app).get('/tracks').expect(200);
    expect(rutas.body.length).to.equal(3);
  });

  it('Deberia devolver todas las rutas', async () => {
    const ruta = await request(app).get('/tracks?id=11').expect(200);
    expect(ruta.body.length).to.equal(1);
  });

  it('Deberia devolver todas las rutas', async () => {
    const ruta = await request(app).get('/tracks/11').expect(200);
    expect(ruta.body.length).to.equal(1);
  });

});



describe('DELETE /track', () => {
  it('Las rutas se deberían poder eliminar correctamente pasando los parámetros como query', async () => {
    const Ruta = await request(app).post('/tracks').send({
      id: 40,
      name: "RutaEliminar40",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 3,
      unevenness: 4,
      activity: "Correr",
      users: []
    })

    const response = await request(app).delete('/tracks?id=40').expect(200);
    expect(response.body.name).to.be.equal('RutaEliminar40');
    expect(response.body.id).to.be.equal(40);
    expect(response.body.startGeolocation).to.be.eql([0,0]);
    expect(response.body.endGeolocation).to.be.eql([1,1]);
    expect(response.body.distance).to.be.equal(3);
    expect(response.body.unevenness).to.be.equal(4);
    expect(response.body.users).to.be.eql([]);
  });

  it('Las rutas se deberían poder eliminar correctamente pasando los parámetros como ruta', async () => {
    const Ruta = await request(app).post('/tracks').send({
      id: 40,
      name: "RutaEliminar40",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 3,
      unevenness: 4,
      activity: "Correr",
      users: []
    })

    const response = await request(app).delete('/tracks/40').expect(200);
    expect(response.body.name).to.be.equal('RutaEliminar40');
    expect(response.body.id).to.be.equal(40);
    expect(response.body.startGeolocation).to.be.eql([0,0]);
    expect(response.body.endGeolocation).to.be.eql([1,1]);
    expect(response.body.distance).to.be.equal(3);
    expect(response.body.unevenness).to.be.equal(4);
    expect(response.body.users).to.be.eql([]);
  });

  
  it('No se elimina un ruta correctamente', async () => {
    await request(app).delete('/tracks?id=1000').expect(404);
    await request(app).delete('/tracks?id=').expect(400);
  });

  it('No se elimina un ruta correctamente', async () => {
    await request(app).delete('/tracks/1000').expect(404);
    await request(app).delete('/tracks/').expect(400);
  });

});

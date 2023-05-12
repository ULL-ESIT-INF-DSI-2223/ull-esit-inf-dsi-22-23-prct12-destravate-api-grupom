import request from 'supertest';
import { app } from '../../src/app.js';
import { expect } from 'chai';
import { User } from '../../src/models/userModel.js';
import { Group } from '../../src/models/groupModel.js';
import { Challenge } from '../../src/models/challengeModel.js';
import { Track } from '../../src/models/trackModel.js';
import { send } from 'process';

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


describe('POST /group', () => {
  it('Un grupo se crea con los parámetros mínimos correctamente', async () => {
    const ruta = await request(app).post('/tracks').send({
      id: 3,
      name: "RutaFondoBiKini3",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 5,
      unevenness: 5,
      activity: "Correr",
      users: []
    });

    const response = await request(app).post('/groups').send({
      id: 1,
      name: "GrupoTesteoFondoBikini",
      groupHistoricalTracks: {"01-01-2023": [ruta.body._id]}
    }).expect(201);
    
    expect(response.body.groupTrainingStats).to.eql([[5,5], [5,5], [5,5]]);
  });

  it('Los nombres de los grupos deben comenzar con mayuscula', async () => {
    const grupomal = await request(app).post('/groups').send({
      id: 2,
      name: "grupoTesteoFondoBikini"
    }).expect(500);
  });

  it('Los nombres de los grupos no pueden tener caracteres especiales', async () => {
    const grupomal2 = await request(app).post('/groups').send({
      id: 3,
      name: "grupo-Testeo-Fondo-Bikini"
    }).expect(500);
  });
});


describe('PATCH /group', () => {
  it('Los grupos se deberían poder actualizar correctamente pasando los parámetros como query', async () => {
    const Calamardo = await request(app).post('/users').send({
      name: "Calamardo",
      username: "calamardo",
      activity: "Bicicleta",
    }).expect(201);

    const idCalamardo = Calamardo.body._id;

    const response = await request(app).patch('/groups?id=1').send({
      name: "GrupoTesteoFondoBikiniNuevo",
      groupHistoricalTracks: {"01-01-2023": []},
      participants: [idCalamardo]
    }).expect(200);
  });

  it('Se debería gestionar los distintos casos en los que se da error (query)', async () => {
    await request(app).patch('/groups?id=').expect(400);
    await request(app).patch('/groups?id=1').send({
      id: 1,
    }).expect(400);
    await request(app).patch('/groups?id=10000').expect(404);
  });

  it('Los grupos se deberían poder actualizar correctamente pasando los parametros como ruta', async () => {
    const Arenita = await request(app).post('/users').send({
      name: "Arenita",
      username: "arenita",
      activity: "Bicicleta",
    }).expect(201);

    const idArenita = Arenita.body._id;

    const response = await request(app).patch('/groups/1').send({
      name: "GrupoTesteoFondoBikiniNuevo2",
      participants: [idArenita]
    }).expect(200);
  });
  
  it('Se debería gestionar los distintos casos en los que se da error (ruta)', async () => {
    await request(app).patch('/groups/').expect(400);
    await request(app).patch('/groups/2').send({
      id: 1,
    }).expect(400);
    await request(app).patch('/groups/10000').expect(404);
  });
});



describe('GET /groups', () => {
  it ('Se obtienen todos los grupos correctamente', async () => {
    const response = await request(app).get('/groups').expect(200);
    expect(response.body.length).to.equal(1);
  });

  it ('Se obtiene un grupo correctamente', async () => {
    const response = await request(app).get('/groups?id=1').expect(200);
    expect(response.body[0].name).to.be.equal('GrupoTesteoFondoBikiniNuevo2');
  });

  it ('Se obtiene un grupo correctamente', async () => {
    const response = await request(app).get('/groups/1').expect(200);
    expect(response.body[0].name).to.be.equal('GrupoTesteoFondoBikiniNuevo2');
  });
  
  it ('No se obtiene un grupo correctamente', async () => {
    const aaaa = await request(app).get('/groups?id=1000').expect(404);
  });

  it ('No se obtiene un grupo correctamente', async () => {
    const response = await request(app).get('/groups/1000').expect(404);
  });

});



describe('DELETE /group', () => {

  it('Se elimina un grupo correctamente dado un id por query', async () => {
    const Arenita = await User.findOne({username: 'arenita'});
    let idArenita = "";
    if(Arenita !== null) {
      idArenita = Arenita._id.toString();
    }
    const response = await request(app).delete('/groups?id=1').expect(200);
    expect(response.body.id).to.be.equal(1);
    expect(response.body.name).to.be.equal('GrupoTesteoFondoBikiniNuevo2');
    expect(response.body.participants).to.be.eql([idArenita]);
    expect(response.body.groupTrainingStats).to.be.eql([[0,0], [0,0], [0,0]]);
    expect(response.body.groupRanking).to.be.eql([]);
  });


  it('Se elimina un grupo correctamente dado un id por ruta', async () => {
    const Calamardo = await User.findOne({username: 'calamardo'});
    let idCalamardo = "";
    if(Calamardo !== null) {
      idCalamardo = Calamardo._id.toString();
    }

    const ruta = await request(app).post('/tracks').send({
      id: 4,
      name: "RutaFondoBiKini4",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 15,
      unevenness: 15,
      activity: "Bicicleta",
      users: []
    });

    await request(app).post('/groups').send({
      id: 5,
      name: "GrupoTesteoFondoBikiniDelete",
      participants: [idCalamardo],
      groupHistoricalTracks: {"01-01-2023": [ruta.body._id]}
    }).expect(201);
    
    const response = await request(app).delete('/groups/5').expect(200);
    expect(response.body.id).to.be.equal(5);
    expect(response.body.name).to.be.equal('GrupoTesteoFondoBikiniDelete');
    expect(response.body.participants).to.be.eql([idCalamardo]);
    expect(response.body.groupTrainingStats).to.be.eql([[15,15], [15,15], [15,15]]);
    expect(response.body.groupRanking).to.be.eql([]);
  });

  it('No se elimina un grupo correctamente', async () => {
    await request(app).delete('/groups?id=1000').expect(404);
  });

  it('No se elimina un grupo correctamente', async () => {
    await request(app).delete('/groups/1000').expect(404);
  });

});
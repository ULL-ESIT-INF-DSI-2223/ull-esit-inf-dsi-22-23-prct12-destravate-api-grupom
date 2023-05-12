import request from 'supertest';
import { app } from '../../src/app.js';
import { expect } from 'chai';
import { UsersExist, GroupsExist, TracksExist, ChallengesExist } from '../../src/tools/tools.js';
import { User } from '../../src/models/userModel.js';
import { Group } from '../../src/models/groupModel.js';
import { Track } from '../../src/models/trackModel.js';
import { Challenge } from '../../src/models/challengeModel.js';
import { Schema } from 'mongoose';


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


describe('UsersExist', () => {
  it('Función que comprueba si un id de un usuario se encuentra en la base de datos', async () => {
    const Plankton = await request(app).post('/users').send({
      name: "Plankton",
      username: "Plankton",
      activity: "Bicicleta"
    });

    const Test = await request(app).post('/groups').send({
      id: 20,
      name: "Test",
    });

    expect(await UsersExist(Plankton.body._id)).to.be.true;

    try {
      await UsersExist(Test.body._id);
    } catch (error) {
      expect(error.message).to.equal('No existe ningún usuario con ese id');
    }
  });
});

describe('GroupsExist', () => {
  it('Función que comprueba si un id de un grupo se encuentra en la base de datos', async () => {
    const Test = await request(app).post('/users').send({
      name: "Test",
      username: "Test",
      activity: "Bicicleta"
    })

    const Grupo = await request(app).post('/groups').send({
      id: 21,
      name: "Grupo",
    });

    expect(await GroupsExist(Grupo.body._id)).to.be.true;

    try {
      await GroupsExist(Test.body._id);
    } catch (error) {
      expect(error.message).to.equal('No existe ningún grupo con ese id');
    }
  });
});


describe('TracksExist', () => {
  it('Función que comprueba si un id de una ruta se encuentra en la base de datos', async () => {
    const Test = await request(app).post('/users').send({
      name: "Test2",
      username: "Test2",
      activity: "Bicicleta"
    })

    const Ruta = await request(app).post('/tracks').send({
      id: 22,
      name: "Ruta",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 3,
      unevenness: 4,
      activity: "Correr",
      users: []
    });
    
    expect(await TracksExist(Ruta.body._id)).to.be.true;

    try {
      await TracksExist(Test.body._id);
    } catch (error) {
      expect(error.message).to.equal('No existe ninguna ruta con ese id');
    }
  });
});


describe('ChallengesExist', () => {
  it('Función que comprueba si un id de un reto se encuentra en la base de datos', async () => {
    const Test = await request(app).post('/users').send({
      name: "Test3",
      username: "Test3",
      activity: "Bicicleta"
    })

    const Reto = await request(app).post('/challenges').send({
      id: 22,
      name: "Reto",
      tracks: [],
      activity: "Correr",
    });
    
    expect(await ChallengesExist(Reto.body._id)).to.be.true;

    try {
      await ChallengesExist(Test.body._id);
    } catch (error) {
      expect(error.message).to.equal('No existe ningún reto con ese id');
    }
  });
});
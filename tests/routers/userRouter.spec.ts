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


describe('POST /users', () => {
  it('Un usuario se crea con los parámetros mínimos correctamente', async () => {
    const ruta = await request(app).post('/tracks').send({
      id: 1,
      name: "RutaFondoBiKini",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 3,
      unevenness: 4,
      activity: "Correr",
      users: []
    });
    
    const response = await request(app).post('/users').send({
      name: "Bob Esponja",
      username: "bobesponja",
      history: {"01-01-2023": [ruta.body._id]}
    }).expect(201);

    expect(response.body).to.include({
      name: 'Bob Esponja',
      username: 'bobesponja'
    });
    
    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).not.to.be.null;
    expect(checkFirstUser!.username).to.equal('bobesponja');   
    expect(response.body.history).to.deep.equal({"01-01-2023": [ruta.body._id]});
    expect(response.body.trainingStats).to.eql([[4,3], [4,3], [4,3]]);
  });

  it('Si se intenta crear un nuevo usuario con el mismo username falla', async () => {
    const response = await request(app).post('/users').send({
      name: "Bob Esponja",
      username: "bobesponja"
    }).expect(500);

    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).to.be.null;
  });

  it('Un usuario se crea con los parámetros mínimos correctamente comprobando el array de amigos', async () => {
    const BobEsponja = await User.findOne({username: 'bobesponja'});
    let idBobEsponja = "";
    if(BobEsponja !== null) {
      idBobEsponja = BobEsponja._id.toString();
    }

    const response = await request(app).post('/users').send({
      name: "Patricio Estrella",
      username: "patricio",
      activity: "Bicicleta",
      friends: [idBobEsponja],
    }).expect(201);

    expect(response.body).to.include({
      name: 'Patricio Estrella',
      username: 'patricio',
      activity: 'Bicicleta'
    });
    expect(response.body.friends).to.eql([idBobEsponja]);
    expect(response.body.friendsGroups).to.eql([]);
    expect(response.body.trainingStats).to.eql([[0,0], [0,0], [0,0]]);
    expect(response.body.favoriteTracks).to.eql([]);
    expect(response.body.favoriteChallenges).to.eql([]);
    expect(Array.from(response.body.history)).to.deep.equal([]);

  
    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).not.to.be.null;
    expect(checkFirstUser!.username).to.equal('patricio');
  });
});


describe('PATCH /users', () => {
  it('Un usuario se actualiza correctamente con la utilización de parámetros por query', async () => {
    const BobEsponja = await User.findOne({username: 'bobesponja'});
    let idBobEsponja = "";
    if(BobEsponja !== null) {
      idBobEsponja = BobEsponja._id.toString();
    }
    
    const Patricio = await User.findOne({username: 'patricio'});
    let idPatricio = "";
    if(Patricio !== null) {
      idPatricio = Patricio._id.toString();
    }

    // Se espera que en ambos se añada el id de su amigo
    expect([String(BobEsponja?.friends)]).to.eql([idPatricio]);
    expect([String(Patricio?.friends)]).to.eql([idBobEsponja]);

    const grupo = await request(app).post('/groups').send({
      id: 10,
      name: "GrupoFondoBikini",
      participants: [idBobEsponja, idPatricio],
    });
    
    const response = await request(app).patch('/users?username=patricio').send({
      activity: "Correr",
      friends: [],
      friendsGroups: [grupo.body._id]
    });

    expect(response.body).to.include({
      activity: 'Correr'
    });
    expect(response.body.friends).to.eql([]);
    expect(response.body.friendsGroups).to.eql([grupo.body._id]);
    expect(response.body.trainingStats).to.eql([[0,0], [0,0], [0,0]]);
    expect(response.body.favoriteTracks).to.eql([]);
    expect(response.body.favoriteChallenges).to.eql([]);
    expect(Array.from(response.body.history)).to.deep.equal([]);

    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).not.to.be.null;
    expect(checkFirstUser!.username).to.equal('patricio');   
  });

  it('Un usuario se actualiza correctamente con la utilización de parámetros como rutas', async () => {
    const ruta = await request(app).post('/tracks').send({
      id: 2,
      name: "RutaFondoBiKini2",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 5,
      unevenness: 5,
      activity: "Correr",
      users: []
    });

    const response = await request(app).patch('/users/patricio').send({
      history: {"01-01-2023": [ruta.body._id]}
    });

    expect(response.body.history).to.deep.equal({"01-01-2023": [ruta.body._id]});
    expect(response.body.trainingStats).to.eql([[5,5], [5,5], [5,5]]);

    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).not.to.be.null;
    expect(checkFirstUser!.username).to.equal('patricio');   
  });

  it('Actualización incorrecta debido a que no se pasa el username como parámetro', async () => {
    await request(app).patch('/users/').send().expect(400);
    await request(app).patch('/users?').send().expect(400);
  });

  it('Actualización incorrecta debido a que los parámetros seleccionados no son modificables', async () => {
    await request(app).patch('/users/patricio').send({
      favouriteChallenges: []
    }).expect(400);
  });
  it('Actualización incorrecta debido a que los parámetros seleccionados no son modificables', async () => {
    await request(app).patch('/users?username=patricio').send({
      favouriteChallenges: []
    }).expect(400);
  });
});


describe('GET /users', () => {
  it ('Se obtienen todos los usuarios correctamente', async () => {
    const response = await request(app).get('/users').expect(200);
    expect(response.body.length).to.equal(4);
  });

  it ('Se obtiene un usuario correctamente', async () => {
    const response = await request(app).get('/users?username=patricio').expect(200);
    expect(response.body[0].username).to.be.equal('patricio');
  });

  it ('Se obtiene un usuario correctamente', async () => {
    const response = await request(app).get('/users/bobesponja').expect(200);
    expect(response.body[0].username).to.be.equal('bobesponja');
  });
  
  it ('No se obtiene un usuario correctamente', async () => {
    await request(app).get('/users?username=pepito').expect(404);
  });

  it ('No se obtiene un usuario correctamente', async () => {
    await request(app).get('/users/pepito').expect(404);
  });


});
  

describe('DELETE /users', () => {

  it('Se elimina un usuario correctamente dado un username por query', async () => {
    const Grupo = await Group.findOne({id: 10});
    let idGrupo = "";
    if(Grupo !== null) {
      idGrupo = Grupo._id.toString();
    }
    const response = await request(app).delete('/users?username=patricio').expect(200);
    expect(response.body.username).to.be.equal('patricio');
    expect(response.body.activity).to.be.equal('Correr');
    expect(response.body.friends).to.be.eql([]);
    expect(response.body.friendsGroups).to.be.eql([idGrupo]);
    expect(response.body.trainingStats).to.be.eql([[5,5], [5,5], [5,5]]);
    expect(response.body.favoriteChallenges).to.be.eql([]);
    expect(Array.from(response.body.history)).to.deep.equal([]);
  });

  it('Se elimina un usuario correctamente dado un username como parametro', async () => {
    const Grupo = await Group.findOne({id: 10});
    let idGrupo = "";
    if(Grupo !== null) {
      idGrupo = Grupo._id.toString();
    }
    const response = await request(app).delete('/users/bobesponja').expect(200);
    expect(response.body.username).to.be.equal('bobesponja');
    expect(response.body.activity).to.be.equal('Correr');
    expect(response.body.friends).to.be.eql([]);
    expect(response.body.friendsGroups).to.be.eql([idGrupo]);
    expect(response.body.trainingStats).to.be.eql([[4,3], [4,3], [4,3]]);
    expect(response.body.favoriteChallenges).to.be.eql([]);
    expect(Array.from(response.body.history)).to.deep.equal([]);
  });

  it('No se elimina un usuario correctamente', async () => {
    await request(app).delete('/users?username=pepito').expect(404);
  });

  it('No se elimina un usuario correctamente', async () => {
    await request(app).delete('/users/pepito').expect(404);
  });

});
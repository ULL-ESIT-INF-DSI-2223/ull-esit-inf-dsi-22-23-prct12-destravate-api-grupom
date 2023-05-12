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

// describe('POST /track', () => {
//   it('Una ruta se crea con los parámetros mínimos correctamente', async () => {
//     const ruta = await request(app).post('/tracks').send({
//       id: 1,
//       name: "RutaFondoBiKini",
//       startGeolocation: [0,0],
//       endGeolocation: [1,1],
//       distance: 3,
//       unevenness: 4,
//       activity: "Correr",
//       users: []
//     }).expect(201);
    
    
//     expect(ruta.body).to.include({
//       name: "RutaFondoBiKini",
//       distance: 3,
//       unevenness: 4,
//       activity: "Correr",
//     });

//     expect(ruta.body.startGeolocation).to.be.eql([0,0]);
//     expect(ruta.body.endGeolocation).to.be.eql([1,1]);
//     expect(ruta.body.users).to.be.eql([]);

    
//     const checkFirstUser = await User.findById(ruta.body._id);
//     expect(checkFirstUser).not.to.be.null;
//     expect(checkFirstUser!.id).to.equal(1);   
//     expect(ruta.body.name).to.be.equal("RutaFondoBiKini");
//   });    

// });
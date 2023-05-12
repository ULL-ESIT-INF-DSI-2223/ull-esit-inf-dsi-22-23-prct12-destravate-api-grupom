import request from 'supertest';
import { app } from '../../src/app.js';
import { User } from '../../src/models/userModel.js';

const firstUser = {
  name: "Eduardo Segredo",
  username: "esegredo"
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(firstUser).save();
});

// after(async () => {
//   await User.deleteMany();
// });

describe('GET /users', () => {
  it('Should get a user by username', async () => {
    await request(app).get('/users?username=esegredo').expect(200);
  });

  it('Should not find a user by username', async () => {
    await request(app).get('/users?username=edusegre').expect(404);
  });
});
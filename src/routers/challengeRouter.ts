import express from 'express';
import { Challenge } from '../models/challengeModel.js';

export const challengeRouter = express.Router();

/////////////////////////////////// POST  ///////////////////////////////////////

challengeRouter.post('/challenges', async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }

});


/////////////////////////////////// GET  ///////////////////////////////////////

challengeRouter.get('/challenges', async (req, res) => {
  const filter = req.query.id ? {id: req.query.id.toString()} : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

challengeRouter.get('/challenges/:id', async (req, res) => {
  const filter = req.params.id ? {id: req.params.id.toString()} : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// PATCH  ///////////////////////////////////////

challengeRouter.patch("/challenges/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "tracks", "activity", "totalDistance", "users"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const challenge = await Challenge.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });

    // TODO : revisar el populate
    if (challenge) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});




/////////////////////////////////// DELETE  ///////////////////////////////////////



// challengeRouter.delete('/challenges', async (req, res) => {
//   if (!req.query.id) {
//     return res.status(400).send({ error: 'A id must be provided' });
//   }

//   try {
//     const challenge = await Challenge.findOne({id: req.query.id.toString()});

//     if (!challenge) {
//       return res.status(404).send();
//     }

//     // TODO : darse cuenta del borrado en cascada
//     await Challenge.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

//     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
//     await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

//     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
//     await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

//     await Challenge.findByIdAndDelete(challenge._id);
//     return res.send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });


// userRouter.delete('/users/:username', async (req, res) => {
//   if (!req.params.username) {
//     return res.status(400).send({ error: 'A username must be provided' });
//   }

//   try {
//     const user = await User.findOne({username: req.params.username.toString()});

//     if (!user) {
//       return res.status(404).send();
//     }

//     // TODO : darse cuenta del borrado en cascada
//     await User.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

//     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
//     await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

//     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
//     await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

//     await User.findByIdAndDelete(user._id);
//     return res.send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

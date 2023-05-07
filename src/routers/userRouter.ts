import express from 'express';
import { User } from '../models/userModel.js';

export const userRouter = express.Router();


/////////////////////////////////// POST  ///////////////////////////////////////

userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el usuario", error: error});
  }

});


// TODO : preguntar si tenemos que añadir de los dos modos o solo de uno
// userRouter.post('/users/:name', async (req, res) => {
//   const usuario = {
//     name: req.params.name,
//     username: req.body.username,
//     email: req.body.email,
//     age: req.body.age
//   }
//   const user = new User(usuario);

//   try{
//     await user.save();
//     return res.status(201).send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });



/////////////////////////////////// GET  ///////////////////////////////////////

userRouter.get('/users', async (req, res) => {
  const filter = req.query.username ? {username: req.query.username.toString()} : {};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


userRouter.get('/users/:username', async (req, res) => {
  const filter = req.params.username ? {username: req.params.username.toString()} : {};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// PATCH  ///////////////////////////////////////

userRouter.patch("/users/:username", async (req, res) => {
  try {
    const allowedUpdates = ["name", "activity", "friends", "friendsGroups", "trainingStats", "favoriteTracks", "favoriteChallenges", "history"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: "Los parámetros seleccionados no se puede modificar",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        username: req.params.username,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    // TODO : revisar el populate
    if (user) {
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


/////////////////////////////////// DELETE  ///////////////////////////////////////

// userRouter.delete('/users', async (req, res) => {
//   if (!req.query.username) {
//     return res.status(400).send({
//       error: 'A username must be provided',
//     });
//   }

//   try {
//     const user = await User.findOne({
//       username: req.query.username.toString()
//     });

//     if (!user) {
//       return res.status(404).send();
//     }

//     // TODO : darse cuenta del borrado en cascada
//     // const result = await Note.deleteMany({owner: user._id});

//     // if (!result.acknowledged) {
//     //   return res.status(500).send();
//     // }

//     await User.findByIdAndDelete(user._id);
//     return res.send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });


// userRouter.delete('/users/:username', async (req, res) => {
//   if (!req.params.username) {
//     return res.status(400).send({
//       error: 'A username must be provided',
//     });
//   }

//   try {
//     const user = await User.findOne({
//       username: req.params.username.toString()
//     });

//     if (!user) {
//       return res.status(404).send();
//     }

//     // TODO : darse cuenta del borrado en cascada
//     // const result = await Note.deleteMany({owner: user._id});

//     // if (!result.acknowledged) {
//     //   return res.status(500).send();
//     // }

//     await User.findByIdAndDelete(user._id);
//     return res.send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

import express from 'express';
import { User } from '../models/userModel.js';
import { Track } from '../models/trackModel.js';
import { Group } from '../models/groupModel.js';
import { Challenge } from '../models/challengeModel.js';

export const userRouter = express.Router();


/////////////////////////////////// POST  ///////////////////////////////////////

userRouter.post('/users', async (req, res) => {
  try {

    const user = new User(req.body);
  
    // ACTUALIZA: Se encarga de mantener sincronizados los usuarios de rutas, con las rutas de usuarios
    if (user.history !== undefined) {
      const values = [...new Set([...(user.history.values())].flat())];
      for (let i = 0; i < values.length; i++) {
        await Track.findOneAndUpdate({ _id: values[i] }, { $addToSet: { users: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    if(user.friendsGroups !== undefined) {
      for(let i = 0; i < user.friendsGroups.length; i++) {
        await Group.findOneAndUpdate({ _id: user.friendsGroups[i] }, { $addToSet: { participants: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los amigos de un usuario
    if(user.friends !== undefined) {
      for(let i = 0; i < user.friends.length; i++) {
        await User.findOneAndUpdate({ _id: user.friends[i] }, { $addToSet: { friends: user._id }});
      }
    }


    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el usuario", error: error});
  }
});


/////////////////////////////////// GET  ///////////////////////////////////////

userRouter.get('/users', async (req, res) => {
  try {
    const filter = req.query.username ? {username: req.query.username.toString()} : {};

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
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar"});
    }

    // Usuario antes de ser modificado
    const userActual = await User.findOne({ username: req.params.username });
    const arrayGruposAntes = userActual?.friendsGroups;
    const arrayAmigosAntes = userActual?.friends;

    // Usuario después de ser modificado
    const user = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true, runValidators: true, });
    const arrayGruposDespues = user?.friendsGroups;
    const arrayAmigosDespues = user?.friends;

    // ACTUALIZA: Se encarga de mantener sincronizados el atributo friendsGroups de los usuarios
    if (arrayGruposAntes !== undefined && arrayGruposDespues !== undefined && user) {
      const diferenciaGrupos = arrayGruposAntes.filter((group) => !arrayGruposDespues.includes(group));
      if (diferenciaGrupos.length !== 0) {
        for(let i = 0; i < diferenciaGrupos.length; ++i) {
          await Group.findOneAndUpdate({ _id: diferenciaGrupos[i] }, { $pull: { participants: user._id }});
        }
      }
    }

    // ACTUALIZA: Se encarga de mantener sincronizados el atributo friends de los usuarios
    if (arrayAmigosAntes !== undefined && arrayAmigosDespues !== undefined && user) {
      const diferenciaAmigos = arrayAmigosAntes.filter((friend) => !arrayAmigosDespues.includes(friend));
      if (diferenciaAmigos.length !== 0) {
        for(let i = 0; i < diferenciaAmigos.length; ++i) {
          await User.findOneAndUpdate({ _id: diferenciaAmigos[i] }, { $pull: { friends: user._id }});
        }
      }
    }

    // TODO : encerrar esto en una función
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios de rutas, con las rutas de usuarios
    if (user && user.history !== undefined) {
      const values = [...new Set([...(user.history.values())].flat())];
      for (let i = 0; i < values.length; i++) {
        await Track.findOneAndUpdate({ _id: values[i] }, { $addToSet: { users: user._id }});
      }
    }
    
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    if(user && user.friendsGroups !== undefined) {
      for(let i = 0; i < user.friendsGroups.length; i++) {
        await Group.findOneAndUpdate({ _id: user.friendsGroups[i] }, { $addToSet: { participants: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los amigos de un usuario
    if(user && user.friends !== undefined) {
      for(let i = 0; i < user.friends.length; i++) {
        await User.findOneAndUpdate({ _id: user.friends[i] }, { $addToSet: { friends: user._id }});
      }
    }



    // TODO : revisar el populate
    if (user) {
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});



userRouter.patch("/users", async (req, res) => {
  if (!req.query.username) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const allowedUpdates = ["name", "activity", "friends", "friendsGroups", "trainingStats", "favoriteTracks", "favoriteChallenges", "history"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar"});
    }

    // Usuario antes de ser modificado
    const userActual = await User.findOne({ username: req.query.username });
    const arrayGruposAntes = userActual?.friendsGroups;
    const arrayAmigosAntes = userActual?.friends;

    // Usuario después de ser modificado
    const user = await User.findOneAndUpdate({ username: req.query.username }, req.body, { new: true, runValidators: true, });
    const arrayGruposDespues = user?.friendsGroups;
    const arrayAmigosDespues = user?.friends;

    // ACTUALIZA: Se encarga de mantener sincronizados el atributo friendsGroups de los usuarios
    if (arrayGruposAntes !== undefined && arrayGruposDespues !== undefined && user) {
      const diferenciaGrupos = arrayGruposAntes.filter((group) => !arrayGruposDespues.includes(group));
      if (diferenciaGrupos.length !== 0) {
        for(let i = 0; i < diferenciaGrupos.length; ++i) {
          await Group.findOneAndUpdate({ _id: diferenciaGrupos[i] }, { $pull: { participants: user._id }});
        }
      }
    }

    // ACTUALIZA: Se encarga de mantener sincronizados el atributo friends de los usuarios
    if (arrayAmigosAntes !== undefined && arrayAmigosDespues !== undefined && user) {
      const diferenciaAmigos = arrayAmigosAntes.filter((friend) => !arrayAmigosDespues.includes(friend));
      if (diferenciaAmigos.length !== 0) {
        for(let i = 0; i < diferenciaAmigos.length; ++i) {
          await User.findOneAndUpdate({ _id: diferenciaAmigos[i] }, { $pull: { friends: user._id }});
        }
      }
    }

    // TODO : encerrar esto en una función
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios de rutas, con las rutas de usuarios
    if (user && user.history !== undefined) {
      const values = [...new Set([...(user.history.values())].flat())];
      for (let i = 0; i < values.length; i++) {
        await Track.findOneAndUpdate({ _id: values[i] }, { $addToSet: { users: user._id }});
      }
    }
    
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    if(user && user.friendsGroups !== undefined) {
      for(let i = 0; i < user.friendsGroups.length; i++) {
        await Group.findOneAndUpdate({ _id: user.friendsGroups[i] }, { $addToSet: { participants: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los amigos de un usuario
    if(user && user.friends !== undefined) {
      for(let i = 0; i < user.friends.length; i++) {
        await User.findOneAndUpdate({ _id: user.friends[i] }, { $addToSet: { friends: user._id }});
      }
    }



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

userRouter.delete('/users', async (req, res) => {
  if (!req.query.username) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const user = await User.findOne({username: req.query.username.toString()});

    if (!user) {
      return res.status(404).send();
    }

    // TODO : darse cuenta del borrado en cascada
    await User.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

    await User.findByIdAndDelete(user._id);
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});


userRouter.delete('/users/:username', async (req, res) => {
  if (!req.params.username) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const user = await User.findOne({username: req.params.username.toString()});

    if (!user) {
      return res.status(404).send();
    }

    // TODO : darse cuenta del borrado en cascada
    await User.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

    await User.findByIdAndDelete(user._id);
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

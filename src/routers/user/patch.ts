import { Group } from "../../models/groupModel.js";
import { Track } from "../../models/trackModel.js";
import { User } from "../../models/userModel.js";
import { Stats } from "../../../src/types/type.js"

/**
 * Manejador de la petición PATCH /users
 * Se debe dar el username por query
 * Se debe proporcionar un body con los datos del nuevo reto
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const patchUserQuery =  async (req: any, res: any) => {
  if (!req.query.username) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de usuario' });
  }

  try {
    const allowedUpdates = ["name", "activity", "friends", "friendsGroups", "history"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ msg: "Los parámetros seleccionados no se puede modificar"});
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


    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (user && user.history !== undefined) {
      const rutas = Array.from(user.history.values()).flat();
      for(let i = 0; i < rutas.length; i++) {
        const ruta = await Track.findById(rutas[i]);
        if(ruta !== null) {
          estadisticas[0][0] += ruta.unevenness;
          estadisticas[0][1] += ruta.distance;
          estadisticas[1][0] += ruta.unevenness;
          estadisticas[1][1] += ruta.distance;
          estadisticas[2][0] += ruta.unevenness;
          estadisticas[2][1] += ruta.distance;
        }
      }
      await User.findByIdAndUpdate(user._id , { trainingStats: estadisticas });
    }
    

    
    const userActualizado = await User.findOne({username: req.query.username});

    if (userActualizado) {
      return res.send(userActualizado);
    }
    return res.status(404).send({msg: "El usuario no se actualizó correctamente"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al actualizar", error});
  }
};

/**
 * Manejador de la petición PATCH /users
 * Se debe dar el id por params
 * Se debe proporcionar un body con los datos del nuevo reto
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const patchUser = async (req: any, res: any) => {
  if (!req.params.username) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de usuario' });
  }
  try {
    const allowedUpdates = ["name", "activity", "friends", "friendsGroups", "history"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ msg: "Los parámetros seleccionados no se puede modificar"});
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



    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (user && user.history !== undefined) {
      const rutas = Array.from(user.history.values()).flat();
      for(let i = 0; i < rutas.length; i++) {
        const ruta = await Track.findById(rutas[i]);
        if(ruta !== null) {
          estadisticas[0][0] += ruta.unevenness;
          estadisticas[0][1] += ruta.distance;
          estadisticas[1][0] += ruta.unevenness;
          estadisticas[1][1] += ruta.distance;
          estadisticas[2][0] += ruta.unevenness;
          estadisticas[2][1] += ruta.distance;
        }
      }
      await User.findByIdAndUpdate(user._id , { trainingStats: estadisticas });
    }
      
    const userActualizado = await User.findOne({username: req.params.username});

    if (userActualizado) {
      return res.send(userActualizado);
    }
    return res.status(404).send({msg: "El usuario no se actualizó correctamente"});

  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al actualizar", error});
  }
};

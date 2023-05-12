import { Group } from "../../models/groupModel.js";
import { Track } from "../../models/trackModel.js";
import { User } from "../../models/userModel.js";
import { Stats } from "../../../src/types/type.js"

export const postUser = async (req: any, res: any) => {
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

    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (user.history !== undefined) {
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
    }
    
    await User.findByIdAndUpdate(user._id , { trainingStats: estadisticas });
    const userActualizado = await User.findById(user._id);

    return res.status(201).send(userActualizado);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el usuario", error: error});
  }
};

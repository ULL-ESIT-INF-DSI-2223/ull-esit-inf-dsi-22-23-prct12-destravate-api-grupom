import { Group } from "../../models/groupModel.js";
import { Track } from "../../models/trackModel.js";
import { User } from "../../models/userModel.js";

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
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el usuario", error: error});
  }
};

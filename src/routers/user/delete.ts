import { Challenge } from "../../models/challengeModel.js";
import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";

/**
 * Manejador de la petición DELETE /users
 * Se debe pasar el username por query
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteUserQuery =  async (req: any, res: any) => {
  if (!req.query.username) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de usuario' });
  }
   try {
    const user = await User.findOne({username: req.query.username.toString()});
     if (!user) {
      return res.status(404).send({ msg: 'Usuario no encontrado' });
    }

    await User.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

    await User.findByIdAndDelete(user._id);
    return res.send(user);
  } catch (error) {
    return res.status(500).send({ msg: 'Fallo en el servidor al eliminar el usuario', error});
  }
};
  
/**
 * Manejador de la petición DELETE /users
 * Se debe pasar el username por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteUser =  async (req: any, res: any) => {
  if (!req.params.username) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de usuario' });
  }

  try {
    const user = await User.findOne({username: req.params.username.toString()});

    if (!user) {
      return res.status(404).send({ msg: 'Usuario no encontrado' });
    }

    await User.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

    await User.findByIdAndDelete(user._id);
    return res.send(user);
  } catch (error) {
    return res.status(500).send({ msg: 'Fallo en el servidor al eliminar el usuario', error});
  }
};
  
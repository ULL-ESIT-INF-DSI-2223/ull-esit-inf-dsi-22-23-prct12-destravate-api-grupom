import { Challenge } from "../../models/challengeModel.js";
import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";


export const deleteUserQuery =  async (req: any, res: any) => {
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
};
  
  
export const deleteUser =  async (req: any, res: any) => {
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
};
  
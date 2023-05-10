import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";

export const postGroup = async (req: any, res: any) => {
  const group = new Group(req.body);

  // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
  if(group.participants !== undefined) {
    for(let i = 0; i < group.participants.length; i++) {
      await User.findOneAndUpdate({ _id: group.participants[i] }, { $addToSet: { friendsGroups: group._id }});
    }
  }

  try {
    await group.save();
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }

};

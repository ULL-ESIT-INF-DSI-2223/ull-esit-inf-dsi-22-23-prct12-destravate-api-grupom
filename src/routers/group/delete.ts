import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";


/**
 * Manejador de la petición DELETE /groups
 * Se debe pasar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteGroupQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de grupo' });
  }

  try {
    const group = await Group.findOne({ id: req.query.id.toString() });

    if (!group) {
      return res.status(404).send({ msg: 'grupo no encontrado' });
    }

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await User.updateMany({ friendsGroups: group._id }, { $pull: { friendsGroups: group._id }});

    await Group.findByIdAndDelete(group._id);
    return res.send(group);
  } catch (error) {
    return res.status(500).send({ msg: 'Fallo en el servidor al eliminar el grupo', error});
  }
};

/**
 * Manejador de la petición DELETE /groups
 * Se debe pasar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteGroup = async (req: any, res: any) => {
  if (!req.params.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de grupo' });
  }

  try {
    const group = await Group.findOne({id: req.params.id.toString()});

    if (!group) {
      return res.status(404).send({ msg: 'grupo no encontrado' });
    }

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await User.updateMany({ friendsGroups: group._id }, { $pull: { friendsGroups: group._id }});

    await Group.findByIdAndDelete(group._id);
    return res.send(group);
  } catch (error) {
    return res.status(500).send({ msg: 'Fallo en el servidor al eliminar el grupo', error});
  }
};

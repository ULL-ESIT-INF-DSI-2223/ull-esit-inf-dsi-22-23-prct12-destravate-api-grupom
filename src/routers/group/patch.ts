import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";


export const patchGroupQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ error: 'A groupname must be provided' });
  }
  try {
    const allowedUpdates = ["name", "groupHistoricalTracks", "participants"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    // Grupo antes de ser modificado
    const groupActual = await Group.findOne({ id: req.query.id });
    const arrayGruposAntes = groupActual?.participants;


    // Grupo después de ser modificado
    const group = await Group.findOneAndUpdate({ id: req.query.id }, req.body, { new: true, runValidators: true,});
    const arrayGruposDespues = group?.participants;
    
    // ACTUALIZA: Se encarga de mantener sincronizados el atributo participants de los grupos en caso de eliminar
    if (arrayGruposAntes !== undefined && arrayGruposDespues !== undefined && group) {
      const diferenciaGrupos = arrayGruposAntes.filter((group) => !arrayGruposDespues.includes(group));
      if (diferenciaGrupos.length !== 0) {
        for(let i = 0; i < diferenciaGrupos.length; ++i) {
          await User.findOneAndUpdate({ _id: diferenciaGrupos[i] }, { $pull: { friendsGroups: group._id }});
        }
      }
    }
    
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios en caso de agregar
    if(group && group.participants !== undefined) {
      for(let i = 0; i < group.participants.length; i++) {
        await User.findOneAndUpdate({ _id: group.participants[i] }, { $addToSet: { friendsGroups: group._id }});
      }
    }
  


    // TODO : revisar el populate
    if (group) {
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};



export const patchGroup = async (req: any, res: any) => {
  try {
    const allowedUpdates = ["name", "groupHistoricalTracks", "participants"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    // Grupo antes de ser modificado
    const groupActual = await Group.findOne({ id: req.params.id });
    const arrayGruposAntes = groupActual?.participants;


    // Grupo después de ser modificado
    const group = await Group.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true,});
    const arrayGruposDespues = group?.participants;
    
    // ACTUALIZA: Se encarga de mantener sincronizados el atributo participants de los grupos en caso de eliminar
    if (arrayGruposAntes !== undefined && arrayGruposDespues !== undefined && group) {
      const diferenciaGrupos = arrayGruposAntes.filter((group) => !arrayGruposDespues.includes(group));
      if (diferenciaGrupos.length !== 0) {
        for(let i = 0; i < diferenciaGrupos.length; ++i) {
          await User.findOneAndUpdate({ _id: diferenciaGrupos[i] }, { $pull: { friendsGroups: group._id }});
        }
      }
    }
    
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios en caso de agregar
    if(group && group.participants !== undefined) {
      for(let i = 0; i < group.participants.length; i++) {
        await User.findOneAndUpdate({ _id: group.participants[i] }, { $addToSet: { friendsGroups: group._id }});
      }
    }
  


    // TODO : revisar el populate
    if (group) {
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};

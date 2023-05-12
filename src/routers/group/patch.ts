import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";
import { Stats } from "../../../src/types/type.js"
import { Track } from "../../models/trackModel.js";

/**
 * Manejador de la petición PATCH /groups
 * Se debe dar el id por query
 * Se debe proporcionar un body con los datos del nuevo reto
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const patchGroupQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un id' });
  }
  try {
    const allowedUpdates = ["name", "groupHistoricalTracks", "participants"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ msg: "Los parámetros seleccionados no se puede modificar"});
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
  
 
    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (group && group.groupHistoricalTracks !== undefined) {
      const rutas = Array.from(group.groupHistoricalTracks.values()).flat();

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
      await Group.findByIdAndUpdate(group._id , { groupTrainingStats: estadisticas });
    }

    const groupActualizado = await Group.findOne({id: req.query.id});

    if (groupActualizado) {
      return res.send(groupActualizado);
    }
    return res.status(404).send({msg: "El grupo no se actualizó correctamente"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al actualizar", error});
  }
};

/**
 * Manejador de la petición PATCH /groups
 * Se debe dar el id por params
 * Se debe proporcionar un body con los datos del nuevo reto
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const patchGroup = async (req: any, res: any) => {
  if (!req.params.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un id' });
  }
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

    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (group && group.groupHistoricalTracks !== undefined) {
      const rutas = Array.from(group.groupHistoricalTracks.values()).flat();

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
      await Group.findByIdAndUpdate(group._id , { groupTrainingStats: estadisticas });
    }

    const groupActualizado = await Group.findOne({id: req.params.id});

    if (groupActualizado) {
      return res.send(groupActualizado);
    }
    return res.status(404).send({msg: "El grupo no se actualizó correctamente"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al actualizar", error});
  }
};

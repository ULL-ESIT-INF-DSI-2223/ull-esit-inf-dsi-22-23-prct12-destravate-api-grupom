import { Group } from "../../models/groupModel.js";
import { User } from "../../models/userModel.js";
import { Stats } from "../../../src/types/type.js"
import { Track } from "../../models/trackModel.js";

/**
 * Manejador de la petición POST /groups
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const postGroup = async (req: any, res: any) => {
  const group = new Group(req.body);
  
  try {
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    if(group.participants !== undefined) {
      for(let i = 0; i < group.participants.length; i++) {
        await User.findOneAndUpdate({ _id: group.participants[i] }, { $addToSet: { friendsGroups: group._id }});
      }
    }
  
    await group.save();
  
   
    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (group.groupHistoricalTracks !== undefined) {
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
    }

    await Group.findByIdAndUpdate(group._id , { groupTrainingStats: estadisticas });
    const groupActualizado = await Group.findOne({id: req.body.id});


    return res.status(201).send(groupActualizado);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el grupo", error: error});
  }
};

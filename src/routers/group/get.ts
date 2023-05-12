import { Group } from "../../models/groupModel.js";

/**
 * Manejador de la petición GET /groups
 * Se debe dar el id por query
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getGroupQuery = async (req: any, res: any) => {
  const filter = req.query.id ? {id: req.query.id.toString()} : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.status(200).send(groups);
    }
    return res.status(404).send({msg: "grupo no encontrado"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al buscar un grupo", error});
  }
};

/**
 * Manejador de la petición GET /groups
 * Se debe dar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getGroup = async (req: any, res: any) => {
  const filter = req.params.id ? {id: req.params.id.toString()} : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.status(200).send(groups);
    }
    return res.status(404).send({msg: "grupo no encontrado"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al buscar un grupo", error});
  }
};
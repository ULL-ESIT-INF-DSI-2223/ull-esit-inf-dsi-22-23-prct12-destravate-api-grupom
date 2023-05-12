import { Track } from "../../models/trackModel.js";

/**
 * Manejador de la petición PATCH /tracks
 * Se debe dar el id por query
 * Se debe proporcionar un body con los datos del nuevo reto
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const patchTrackQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un id' });
  }

  try {
    const allowedUpdates = ["name", "startGeolocation", "endGeolocation", "distance", "unevenness", "activity", "averageRating"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ msg: "Los parámetros seleccionados no se puede modificar"});
}

    const track = await Track.findOneAndUpdate({ id: req.query.id }, req.body, { new: true, runValidators: true });

    if (track) {
      return res.send(track);

    }
    return res.status(404).send({msg: "El usuario no se actualizó correctamente"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al actualizar", error});
  }
};

/**
 * Manejador de la petición PATCH /tracks
 * Se debe dar el id por params
 * Se debe proporcionar un body con los datos del nuevo reto
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const patchTrack = async (req: any, res: any) => {
  if (!req.params.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un id' });
  }
  try {
    const allowedUpdates = ["name", "startGeolocation", "endGeolocation", "distance", "unevenness", "activity", "averageRating"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const track = await Track.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });

    if (track) {
      return res.send(track);
    }
    return res.status(404).send({msg: "La ruta no se actualizó correctamente"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al actualizar", error});
  }
};
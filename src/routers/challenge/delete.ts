import { Challenge } from '../../models/challengeModel.js';


/**
 * Manejador de la petición DELETE /challenges
 * Se debe pasar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteChallenge =  async (req: any, res: any) => {
  if (!req.params.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de reto' });
  }
  try {
    const challenge = await Challenge.findOne({id: req.params.id.toString()});

    if (!challenge) {
      return res.status(404).send({ msg: 'reto no encontrado' });
    }

    await Challenge.findByIdAndDelete(challenge._id);
    return res.send(challenge);
  } catch (error) {
    return res.status(500).send({ msg: 'Fallo en el servidor al eliminar el reto', error});
  }
};

/**
 * Manejador de la petición DELETE /challenges
 * Se debe pasar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteChallengeQuery =  async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ msg: 'Se debe proporcionar un nombre de reto' });
  }
  try {
    const challenge = await Challenge.findOne({id: req.query.id.toString()});

    if (!challenge) {
      return res.status(404).send({ msg: 'reto no encontrado' });
    }

    await Challenge.findByIdAndDelete(challenge._id);
    return res.send(challenge);
  } catch (error) {
    return res.status(500).send({ msg: 'Fallo en el servidor al eliminar el reto', error});
  }
};
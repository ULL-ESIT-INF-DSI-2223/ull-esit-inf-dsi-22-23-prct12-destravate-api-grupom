import { Challenge } from '../../models/challengeModel.js';

/**
 * Manejador de la petición GET /challenges
 * Se debe dar el id por query
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getChallenge = async (req: any, res: any) => {
  const filter = req.params.id ? {id: req.params.id.toString()} : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};

/**
 * Manejador de la petición GET /challenges
 * Se debe dar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getChallengeQuery =  async (req: any, res: any) => {
  const filter = req.query.id ? {id: req.query.id.toString()} : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};

import { Challenge } from '../../models/challengeModel.js';


export const getChallenge = async (req: any, res: any) => {
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

export const getChallengeQuery =  async (req: any, res: any) => {
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

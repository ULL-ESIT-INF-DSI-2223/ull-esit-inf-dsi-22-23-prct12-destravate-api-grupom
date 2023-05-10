import { Challenge } from '../../models/challengeModel.js';

export const postChallenge = async (req: any, res: any) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }
};

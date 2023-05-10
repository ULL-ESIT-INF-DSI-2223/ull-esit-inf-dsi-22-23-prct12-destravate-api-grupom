import { Challenge } from '../../models/challengeModel.js';


export const patchChallengeQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ error: 'A id must be provided' });
  }

  try {
    const allowedUpdates = ["name", "tracks", "activity", "totalDistance", "users"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const challenge = await Challenge.findOneAndUpdate({ id: req.query.id }, req.body, { new: true, runValidators: true });

    // TODO : revisar el populate
    if (challenge) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};




export const patchChallenge = async (req: any, res: any) => {
  try {
    const allowedUpdates = ["name", "tracks", "activity", "totalDistance", "users"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const challenge = await Challenge.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });

    // TODO : revisar el populate
    if (challenge) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};

import { Challenge } from '../../models/challengeModel.js';
import { User } from '../../models/userModel.js';

/**
 * Manejador de la petición POST /challenges
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const postChallenge = async (req: any, res: any) => {
  try {
    const challenge = new Challenge(req.body);

    // Actualiza el vector de favoriteChallenges en el usuario cada vez que se agrega un usuario a un reto
    if (challenge.users !== undefined) {
      for(let i = 0; i < challenge.users.length; i++) {
        await User.findOneAndUpdate({ _id: challenge.users[i] }, { $addToSet: { favoriteChallenges: challenge._id } })
      }
    }

    await challenge.save();
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el reto", error: error});
  }
};

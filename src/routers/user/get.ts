import { User } from "../../models/userModel.js";

/**
 * Manejador de la petición GET /users
 * Se debe dar el username por query
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getUserQuery =  async (req: any, res: any) => {
  try {
    const filter = req.query.username ? {username: req.query.username.toString()} : {};

    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.status(200).send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};

/**
 * Manejador de la petición GET /users
 * Se debe dar el username por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getUser =  async (req: any, res: any) => {

  try {
    const filter = req.params.username ? {username: req.params.username.toString()} : {};

    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.status(200).send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};
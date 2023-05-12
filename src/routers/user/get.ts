import { User } from "../../models/userModel.js";

export const getUserQuery =  async (req: any, res: any) => {
  try {
    const filter = req.query.username ? {username: req.query.username.toString()} : {};


    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};
  
  
export const getUser =  async (req: any, res: any) => {
  const filter = req.params.username ? {username: req.params.username.toString()} : {};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};
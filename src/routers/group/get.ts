import { Group } from "../../models/groupModel.js";


export const getGroupQuery = async (req: any, res: any) => {
  const filter = req.params.id ? {id: req.params.id.toString()} : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.send(groups);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};


export const getGroup = async (req: any, res: any) => {
  const filter = req.query.id ? {id: req.query.id.toString()} : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.send(groups);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};


// groupRouter.get('/groups/ranking', async (req, res) => {
//   try {

//   } catch (error) {

//   }
// });
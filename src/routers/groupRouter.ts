import express from 'express';
import { Group } from '../models/groupModel.js';

export const groupRouter = express.Router();



groupRouter.post('/groups', async (req, res) => {
  const group = new Group(req.body);

  try {
    await group.save();
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }

});
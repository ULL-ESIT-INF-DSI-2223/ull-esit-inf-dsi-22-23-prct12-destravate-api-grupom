import express from "express";

import { postGroup } from "../routers/group/post.js";
import { getGroupQuery, getGroup } from "../routers/group/get.js";
import { patchGroupQuery, patchGroup } from "./group/patch.js";
import { deleteGroupQuery, deleteGroup } from "./group/delete.js";

export const groupRouter = express.Router();

groupRouter.post("/groups", postGroup)
groupRouter.get("/groups", getGroupQuery)
groupRouter.get("/groups/:id", getGroup)
groupRouter.patch("/groups", patchGroupQuery)
groupRouter.patch("/groups/:id", patchGroup)
groupRouter.delete("/groups", deleteGroupQuery)
groupRouter.delete("/groups/:id", deleteGroup)

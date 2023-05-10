import express from "express";

import { postUser } from "../routers/user/post.js";
import { getUserQuery, getUser } from "../routers/user/get.js";
import { patchUserQuery, patchUser } from "./user/patch.js";
import { deleteUserQuery, deleteUser } from "./user/delete.js";

export const userRouter = express.Router();

userRouter.post("/users", postUser)
userRouter.get("/users", getUserQuery)
userRouter.get("/users/:id", getUser)
userRouter.patch("/users", patchUserQuery)
userRouter.patch("/users/:username", patchUser)
userRouter.delete("/users", deleteUserQuery)
userRouter.delete("/users/:id", deleteUser)

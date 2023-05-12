import { Schema } from "mongoose";
import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { Challenge } from "../models/challengeModel.js";
import { Track } from "../models/trackModel.js";

/**
 * Función que comprueba si existe un usuario con el id pasado por parámetro
 * @param id Id del usuario
 * @returns true si existe, trow error si no existe
 */
export const UsersExist = async (id: Schema.Types.ObjectId) => {
  const users = await User.findOne({ _id: id });
  if (users === null) {
    throw new Error('No existe ningún usuario con ese id');
  }
  return true;
}

/**
 * Función que comprueba si existe un grupo con el id pasado por parámetro
 * @param id Id del grupo
 * @returns true si existe, trow error si no existe
 */
export const GroupsExist = async (id: Schema.Types.ObjectId) => {
  const groups = await Group.findOne({ _id: id });
  if (groups === null) {
    throw new Error('No existe ningún grupo con ese id');
  }
  return true;
}

/**
 * Función que comprueba si existe un challenge con el id pasado por parámetro
 * @param id Id del challenge
 * @returns true si existe, trow error si no existe
 */
export const ChallengesExist = async (id: Schema.Types.ObjectId) => {
  const challenge = await Challenge.findOne({ _id: id });
  if (challenge === null) {
    throw new Error('No existe ningún reto con ese id');
  }
  return true;
}

/**
 * Función que comprueba si existe un trakc con el id pasado por parámetro
 * @param id Id del trakc
 * @returns true si existe, trow error si no existe
 */
export const TracksExist = async (id: Schema.Types.ObjectId) => {
  const tracks = await Track.findOne({ _id: id });
  if (tracks === null) {
    throw new Error('No existe ninguna ruta con ese id');
  }
  return true;
}
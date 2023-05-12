import { Document, Schema, model } from "mongoose";
import validator from "validator";
import { UsersExist, TracksExist } from '../tools/tools.js';

/**
 * Interfaz que define las propiedades que debe tener un objeto de tipo Challenge
 * @property id identificador del reto
 * @property name nombre del reto
 * @property tracks lista de identificadores de las pistas que componen el reto
 * @property activity tipo de actividad del reto
 * @property totalDistance distancia total del reto
 * @property users lista de identificadores de los usuarios que han completado el reto
 */
export interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  tracks: Schema.Types.ObjectId[];
  activity: "Bicicleta" | "Correr";
  totalDistance?: number;
  users?: Schema.Types.ObjectId[];
}

/**
 * Esquema de Mongoose para el modelo Challenge (Reto)
 * @property id identificador del reto
 * @property name nombre del reto
 * @property tracks lista de identificadores de las pistas que componen el reto
 * @property activity tipo de actividad del reto
 * @property totalDistance distancia total del reto
 * @property users lista de identificadores de los usuarios que han completado el reto
 * @throws Error cuando el nombre del reto no comienza con mayúscula
 * @throws Error cuando el nombre del reto contiene caracteres no alfanuméricos
 * @throws Error cuando el identificador de una pista no existe
 * @throws Error cuando el identificador de un usuario no existe
 */
const ChallengeSchema = new Schema<ChallengeDocumentInterface>({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error("El nombre de un reto debe comenzar con mayúscula");
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error("Solo se aceptan caracteres alfanuméricos");
      }
    },
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Track",
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await TracksExist(id);
      }
    }
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Bicicleta"],
  },
  totalDistance: {
    type: Number,
    default: 0,
  },
  users: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await UsersExist(id);
      }
    }
  },
});

export const Challenge = model<ChallengeDocumentInterface>("Challenge", ChallengeSchema);

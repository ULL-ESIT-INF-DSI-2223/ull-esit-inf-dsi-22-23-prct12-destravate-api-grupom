import { Document, Schema, model } from "mongoose";
import validator from "validator";

export interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  tracks: Schema.Types.ObjectId[];
  activity: "Bicicleta" | "Correr";
  totalDistance?: number;
  users?: Schema.Types.ObjectId[];
}

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
    default: [],
    ref: "User",
  },
});

export const Challenge = model<ChallengeDocumentInterface>("Challenge", ChallengeSchema);

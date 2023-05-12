import { Document, Schema, model } from "mongoose";
import validator from "validator";
import { UsersExist, TracksExist } from '../tools/tools.js';
import { User } from './userModel.js';

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

// ChallengeSchema.pre('save', function(next) {
//   if (this.users !== undefined) {
//     for(let i = 0; i < this.users.length; ++i) {
//       // const hola1 = User.findById(this.users[i])
//       // console.log(hola1)
//       User.findOneAndUpdate({ _id: this.users[i] }, { $addToSet: { favoriteChallenges: this._id } })
//       const hola = User.findById(this.users[i])
//       const a = new User(hola)
//       console.log(a.username)

//       console.log(a.favoriteChallenges)
//     }
//   }

//   // User.find({users: this._id }).then((challenges) => {
//   //   for (const challenge of challenges) {
//   //     this.favoriteChallenges?.push(challenge._id);
//   //   }
//   // });
//   next()
// });




export const Challenge = model<ChallengeDocumentInterface>("Challenge", ChallengeSchema);

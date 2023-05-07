import { Document, Schema, model } from 'mongoose';
import { UserStats } from '../types/type.js';
import validator from 'validator';


export interface UserDocumentInterface extends Document {
  username: string;
  name: string;
  activity: 'Correr' | 'Bicicleta';
  friends?: Schema.Types.ObjectId[];
  friendsGroups?: Schema.Types.ObjectId[];
  trainingStats?: UserStats;
  favoriteTracks?: Schema.Types.ObjectId[];
  favoriteChallenges?: Schema.Types.ObjectId[];
  history?: Map<string, Schema.Types.ObjectId[]>;
}


const UserSchema = new Schema<UserDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!validator.default.isAlphanumeric(value)) {
        throw new Error('Solo se aceptan caracteres alfanuméricos');
      }
    }
  },
  activity: {
    type: String,
    required: true,
    default: 'Correr',
    enum: ['Correr', 'Bicicleta']
  },
  friends: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  friendsGroups: {
    type: [Schema.Types.ObjectId],
    ref: 'Group',
    default: [],
  },
  trainingStats: {
    type: [[Number]],
    default: [ [0, 0], [0, 0], [0, 0] ],
    // validar que solo se ingresan 3 arrays y que para cada array solo se ingresan dos numeros
    validate: (value: UserStats) => {
      if (value.length !== 3) {
        throw new Error('El array debe tener 3 arrays');
      } else if (value.every((array) => array.length !== 2)) {
        throw new Error('cada array debe tener 2 numeros');
      }
    }
  },
  favoriteTracks: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Tracks',
  },
  favoriteChallenges: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Challenge',
  },
  history: {
    type: Map,
    default: new Map<string, Schema.Types.ObjectId[]>(),
    of: {
      type: [Schema.Types.ObjectId],
      ref: 'Track',
    },
    // TODO : comprobar que el formato de la fecha introducida es correcto
    validate: (value: Map<string, Schema.Types.ObjectId[]>) => {
      for (let key in value.keys()) {
        if(!validator.default.isDate(key)) {
          throw new Error('El formato de la fecha no es correcto');
        }
      }
    }
  }
});


export const User = model<UserDocumentInterface>('User', UserSchema);

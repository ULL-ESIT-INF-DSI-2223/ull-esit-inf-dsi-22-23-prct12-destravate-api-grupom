import { Document, Schema, model } from 'mongoose';
import { UserStatistics } from '../types/type.js';


export interface UserDocumentInterface extends Document {
  username: string;
  name: string;
  activities: 'Correr' | 'Bicicleta';
  friends?: Schema.Types.ObjectId[];
  // friendsGroups: Schema.Types.ObjectId[];
  trainingStatistics: UserStatistics;
  favoriteTracks?: Schema.Types.ObjectId[];
  favoriteChallenges?: Schema.Types.ObjectId[];
  history: Map<string, Schema.Types.ObjectId[]>;
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
    trim: true
  },
  activities: {
    type: String,
    required: true,
    default: 'Correr',
    enum: ['Correr', 'Bicicleta']
  },
  friends: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'User',
  },
  // friendsGroups: {
  //   type: [Schema.Types.ObjectId],
  //   ref: 'Group',
  //   required: true,
  // },
  trainingStatistics: {
    type: [[Number]],
    required: true,
    default: [ [0, 0], [0, 0], [0, 0] ],
    validate: {
      // validar que solo se ingresan 3 arrays y que para cada array solo se ingresan dos numeros
      validator: (value: UserStatistics) => {
        return value.length === 3 && value.every((array) => array.length === 2);
      }
    }
  },
  favoriteTracks: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'Tracks',
  },
  favoriteChallenges: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'Challenge',
  },
  history: {
    type: Map,
    required: true,
    of: {
      type: [Schema.Types.ObjectId],
      ref: 'Track',
    },
  }
});



export const User = model<UserDocumentInterface>('User', UserSchema);
import { Document, Schema, model } from 'mongoose';
import { UserStats } from '../types/type.js';
import validator from 'validator';
import { UsersExist, GroupsExist, TracksExist, ChallengesExist } from '../tools/tools.js';
import { Challenge } from './challengeModel.js';



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
  prueba: string;
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
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await UsersExist(id);
      }
    }
  },
  friendsGroups: {
    type: [Schema.Types.ObjectId],
    ref: 'Group',
    default: [],
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await GroupsExist(id);
      }
    }
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
    ref: 'Tracks',
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await TracksExist(id);
      }
    }
  },
  favoriteChallenges: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Challenge',
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await ChallengesExist(id);
      }
    }
  },
  history: {
    type: Map,
    default: new Map<string, Schema.Types.ObjectId[]>(),
    of: {
      type: [Schema.Types.ObjectId],
      ref: 'Track'  
    },
    // TODO : comprobar que el formato de la fecha introducida es correcto
    validate: [{
      validator: async (value: Map<string, Schema.Types.ObjectId[]>) => {
        for (let key in value.keys()) {
          if(!validator.default.isDate(key)) {
            throw new Error('El formato de la fecha no es correcto');
          }
        }
      }, 
    },
    {
      validator: async (mapa: Map<string, Schema.Types.ObjectId[]>) => {
        for (const value of mapa.values()) {
          for (const id of value) {
            await TracksExist(id);
          }
        }
      },
    }]
  },

});

UserSchema.pre('save', function(next) {
  const contador = new Map<string, number>();
  if (this.history !== undefined) {
    this.history.forEach((value) => {
      for (let i = 0; i < value.length; i++) {
        if (contador.has(value[i].toString()) && contador.get(value[i].toString()) !== undefined) {
          const actual = contador.get(value[i].toString());
          if (actual !== undefined) {
            contador.set(value[i].toString(), actual + 1);
          }
        } else {
          contador.set(value[i].toString(), 1);
        }
      } 
    });
  }
  const ordenado = new Map([...contador.entries()].sort((a, b) => b[1] - a[1]));
  for (const key of ordenado.keys()) {
    this.favoriteTracks?.push((key as unknown) as Schema.Types.ObjectId);
  }
  Challenge.find({users: this._id }).then((challenges) => {
    for (const challenge of challenges) {
      this.favoriteChallenges?.push(challenge._id);
    }
  });
  next();
});


export const User = model<UserDocumentInterface>('User', UserSchema);

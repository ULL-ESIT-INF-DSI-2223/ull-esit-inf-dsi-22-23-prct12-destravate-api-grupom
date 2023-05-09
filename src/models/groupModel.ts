import { Document, Schema, model } from 'mongoose';
import { UserStats } from '../types/type.js';
import validator from 'validator';
import { UsersExist, TracksExist } from '../tools/tools.js';


export interface GroupDocumentInterface extends Document {
  id: number;
  name: string;
  participants?:  Schema.Types.ObjectId[];
  groupTrainingStats?: UserStats;
  groupRanking: Schema.Types.ObjectId[];
  groupFavoriteTracks?: Schema.Types.ObjectId[];
  groupHistoricalTracks?: Map<string, Schema.Types.ObjectId[]>;
}


const GroupSchema = new Schema<GroupDocumentInterface>({
  id: {
    type: Number,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre de un grupo debe comenzar con mayúscula');
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error('Solo se aceptan caracteres alfanuméricos');
      }
    }
  },
  participants: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await UsersExist(id);
      }
    }
  },
  groupTrainingStats: {
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
  groupRanking: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User',
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await UsersExist(id);
      }
    }
  },
  groupFavoriteTracks: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Track',
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await TracksExist(id);
      }
    }
  },
  groupHistoricalTracks: {
    type: Map,
    default: new Map<string, Schema.Types.ObjectId[]>(),
    of: {
      type: [Schema.Types.ObjectId],
      ref: 'Track',
    },
    validate: [{
      validator: async (mapa: Map<string, Schema.Types.ObjectId[]>) => {
        for (const value of mapa.values()) {
          for (const id of value) {
            await TracksExist(id);
          }
        }
      },
    },
    {
      validator: async (value: Map<string, Schema.Types.ObjectId[]>) => {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        for (let key of value.keys()) {
          if (!regex.test(key)) {
            throw new Error('El formato de la fecha no es correcto');
          } else if (Number(key.split('-')[0]) < 1 || Number(key.split('-')[0]) > 31) {
            throw new Error('El dia introducido no es correcto');
          } else if (Number(key.split('-')[1]) < 1 || Number(key.split('-')[1]) > 12) {
            throw new Error('El mes introducido no es correcto');
          }
        }
      }
    }]
    // TODO : comprobar que el formato de la fecha introducida es correcto
    
      // TODO : por alguna razon no funciona, osea acepta todo
      // for (let keys in value.keys()) {
      //   if (!validator.default.isDate(keys, {strictMode: true})) {
      //     throw new Error('La key debe ser una fecha');
      //   }
      // }
  }
});


export const Group = model<GroupDocumentInterface>('Group', GroupSchema);

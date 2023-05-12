import { Document, Schema, model } from 'mongoose';
import { Stats } from '../types/type.js';
import validator from 'validator';
import { UsersExist, TracksExist } from '../tools/tools.js';

/**
 * Interfaz que define las propiedades que debe tener un grupo 
 * @property id: identificador del grupo
 * @property name: nombre del grupo
 * @property participants: array de identificadores de usuarios que pertenecen al grupo
 * @property groupTrainingStats: array de arrays de dos numeros que representan el numero de entrenamientos 
 *  y la duracion total de los mismos
 * @property groupRanking: array de identificadores de usuarios que pertenecen al grupo ordenados por el numero 
 *  de entrenamientos
 * @property groupFavoriteTracks: array de identificadores de las canciones mas escuchadas por el grupo
 * @property groupHistoricalTracks: mapa de arrays de identificadores de canciones escuchadas por el grupo en
 *  una fecha determinada
 * @trows Error: si el nombre del grupo no comienza por mayuscula
 * @trows Error: si el nombre del grupo no es alfanumerico
 * @trows Error: si el array de estadisticas de entrenamiento no tiene 3 arrays
 * @trows Error: si alguno de los arrays de estadisticas de entrenamiento no tiene 2 numeros
 * @trows Error: si alguno de los identificadores de grupos no existe
 */
export interface GroupDocumentInterface extends Document {
  id: number;
  name: string;
  participants?:  Schema.Types.ObjectId[];
  groupTrainingStats?: Stats;
  groupRanking?: Schema.Types.ObjectId[];
  groupFavoriteTracks?: Schema.Types.ObjectId[];
  groupHistoricalTracks?: Map<string, Schema.Types.ObjectId[]>;
}

/**
 * Esquema de un grupo de la base de datos en Mongoose
 * @property id: identificador del grupo
 * @property name: nombre del grupo
 * @property participants: array de identificadores de usuarios que pertenecen al grupo
 * @property groupTrainingStats: array de arrays de dos numeros que representan el numero de entrenamientos
 * y la duracion total de los mismos
 * @property groupRanking: array de identificadores de usuarios que pertenecen al grupo ordenados por el numero
 * de entrenamientos
 * @property groupFavoriteTracks: array de identificadores de las canciones mas escuchadas por el grupo
 * @property groupHistoricalTracks: mapa de arrays de identificadores de canciones escuchadas por el grupo en
 * una fecha determinada
 */
const GroupSchema = new Schema<GroupDocumentInterface>({
  id: {
    type: Number,
    required: true,
    unique: true,
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
    validate: (value: Stats) => {
      if (value.length !== 3) {
        throw new Error('El array debe tener 3 arrays');
      } else if (value.every((array) => array.length !== 2)) {
        throw new Error('cada array debe tener 2 numeros');
      }
    }
  },
  groupRanking: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    get: function () {
      return [...this.participants];
    },
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
  }
});


GroupSchema.pre('save', function(next) {  
  const contador = new Map<string, number>();
  if (this.groupHistoricalTracks !== undefined) {
    this.groupHistoricalTracks.forEach((value) => {
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
    this.groupFavoriteTracks?.push((key as unknown) as Schema.Types.ObjectId);
  }
  next();
});



export const Group = model<GroupDocumentInterface>('Group', GroupSchema);

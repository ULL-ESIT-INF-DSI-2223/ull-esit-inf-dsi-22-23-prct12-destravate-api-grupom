import { Document, Schema, model } from 'mongoose';
import { Stats } from '../types/type.js';
import validator from 'validator';
import { UsersExist, GroupsExist, TracksExist, ChallengesExist } from '../tools/tools.js';


/**
 * Interfaz que define las propiedades que debe tener un usuario
 * @property {string} username - Nombre de usuario
 * @property {string} name - Nombre real del usuario
 * @property {string} activity - Actividad que realiza el usuario
 * @property {Schema.Types.ObjectId[]} friends - Array de ObjectIds de los amigos del usuario
 * @property {Schema.Types.ObjectId[]} friendsGroups - Array de ObjectIds de los grupos de amigos del usuario
 * @property {Stats} trainingStats - Estadisticas de entrenamiento del usuario
 * @property {Schema.Types.ObjectId[]} favoriteTracks - Array de ObjectIds de las pistas favoritas del usuario
 * @property {Schema.Types.ObjectId[]} favoriteChallenges - Array de ObjectIds de los retos favoritos del usuario
 * @property {Map<string, Schema.Types.ObjectId[]>} history - Mapa de fechas y arrays de ObjectIds de las pistas 
 * que ha realizado el usuario
 * @trows {Error} - Si el nombre de usuario no es alfanumérico
 * @trows {Error} - Si el array de amigos contiene un ObjectId que no existe en la base de datos
 * @trows {Error} - Si el array de grupos de amigos contiene un ObjectId que no existe en la base de datos
 */
export interface UserDocumentInterface extends Document {
  username: string;
  name: string;
  activity: 'Correr' | 'Bicicleta';
  friends?: Schema.Types.ObjectId[];
  friendsGroups?: Schema.Types.ObjectId[];
  trainingStats?: Stats;
  favoriteTracks?: Schema.Types.ObjectId[];
  favoriteChallenges?: Schema.Types.ObjectId[];
  history?: Map<string, Schema.Types.ObjectId[]>;
}

/**
 * Esquema de la base de datos para los usuarios de mongoose
 * @property {string} username - Nombre de usuario
 * @property {string} name - Nombre real del usuario
 * @property {string} activity - Actividad que realiza el usuario
 * @property {Schema.Types.ObjectId[]} friends - Array de ObjectIds de los amigos del usuario
 * @property {Schema.Types.ObjectId[]} friendsGroups - Array de ObjectIds de los grupos de amigos del usuario
 * @property {Stats} trainingStats - Estadisticas de entrenamiento del usuario
 * @property {Schema.Types.ObjectId[]} favoriteTracks - Array de ObjectIds de las pistas favoritas del usuario
 * @property {Schema.Types.ObjectId[]} favoriteChallenges - Array de ObjectIds de los retos favoritos del usuario
 * @property {Map<string, Schema.Types.ObjectId[]>} history - Mapa de fechas y arrays de ObjectIds de las pistas
 * que ha realizado el usuario
 */
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
    validate: (value: Stats) => {
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
    ref: 'Challenge',
    default: [],
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
    validate: [{
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
  next();
});




export const User = model<UserDocumentInterface>('User', UserSchema);
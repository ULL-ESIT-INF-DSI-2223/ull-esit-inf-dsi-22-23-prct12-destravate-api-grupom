import { Document, Schema, model } from 'mongoose';
import { Coordinates } from '../types/type.js';
import validator from 'validator';
import { UsersExist } from '../tools/tools.js';

/**
 * Interfaz que define las propiedades que debe tener un documento de la colección Track
 * @interface TrackDocumentInterface
 * @extends Document
 * @property {number} id - Identificador de la ruta
 * @property {string} name - Nombre de la ruta
 * @property {Coordinates} startGeolocation - Coordenadas de inicio de la ruta
 * @property {Coordinates} endGeolocation - Coordenadas de fin de la ruta
 * @property {number} distance - Distancia de la ruta
 * @property {number} unevenness - Desnivel de la ruta
 * @property {Schema.Types.ObjectId[]} users - Array de identificadores de usuarios que han realizado la ruta
 * @property {'Bicicleta' | 'Correr'} activity - Actividad de la ruta
 * @property {number} averageRating - Valoración media de la ruta
 * @trows {Error} - Si el nombre de la ruta no comienza por mayúscula
 * @trows {Error} - Si el nombre de la ruta no es alfanumérico
 * @trows {Error} - Si la geolocalización no tiene dos coordenadas
 * @trows {Error} - Si la distancia es menor que cero
 * @trows {Error} - Si el identificador de usuario no existe
 */
export interface TrackDocumentInterface extends Document {
  id: number,
  name: string,
  startGeolocation: Coordinates,
  endGeolocation: Coordinates,
  distance: number,
  unevenness: number,
  users?: Schema.Types.ObjectId[],
  activity: 'Bicicleta' | 'Correr',
  averageRating?: number
}

/**
 * Esquema de la colección Track en la base de datos de Mongoose
 * @const TrackSchema
 * @type {Schema<TrackDocumentInterface>}
 * @property {number} id - Identificador de la ruta
 * @property {string} name - Nombre de la ruta
 * @property {Coordinates} startGeolocation - Coordenadas de inicio de la ruta
 * @property {Coordinates} endGeolocation - Coordenadas de fin de la ruta
 * @property {number} distance - Distancia de la ruta
 * @property {number} unevenness - Desnivel de la ruta
 * @property {Schema.Types.ObjectId[]} users - Array de identificadores de usuarios que han realizado la ruta
 * @property {'Bicicleta' | 'Correr'} activity - Actividad de la ruta
 * @property {number} averageRating - Valoración media de la ruta
 */
const TrackSchema = new Schema<TrackDocumentInterface>({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre de una ruta debe comenzar con mayúscula');
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error('Solo se aceptan caracteres alfanuméricos');
      }
    }
  },
  startGeolocation: {
    type: [Number],
    required: true,
    validate: (value: number[]) => {
      if (value.length !== 2) {
        throw new Error('La geolocalización debe tener dos coordenadas');
      }
    }
  },
  endGeolocation: {
    type: [Number],
    required: true,
    validate: (value: number[]) => {
      if (value.length !== 2) {
        throw new Error('La geolocalización debe tener dos coordenadas');
      }
    }
  },
  distance: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('La distancia debe ser mayor que cero');
      }
    }
  },
  unevenness: {
    type: Number,
    required: true,
  },
  users: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
    validate:[{
      validator: async (value: Schema.Types.ObjectId[]) => {
        for (const id of value) {
          await UsersExist(id);
        }
      }
    },
    {
      validator: async (value: Schema.Types.ObjectId[]) => {
        const arrayUnique = new Set(value);
        return arrayUnique.size === value.length;
      },
    }]
  },
  activity: {
    type: String,
    required: true,
    enum: ['Correr', 'Bicicleta']
  },
  averageRating: {
    type: Number,
    default: 0,
  }
});


export const Track = model<TrackDocumentInterface>('Track', TrackSchema);

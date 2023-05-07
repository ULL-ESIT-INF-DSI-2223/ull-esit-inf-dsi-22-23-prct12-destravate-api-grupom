import { Document, Schema, model } from 'mongoose';
import { Coordinates } from '../types/type.js';
import validator from 'validator';


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
    ref: 'User'
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

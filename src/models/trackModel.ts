import { Document, Schema, model } from 'mongoose';

// ID único de la ruta.
// Nombre de la ruta.
// Geolocalización del inicio (coordenadas).
// Geolocalización del final de la ruta (coordenadas).
// Longitud de la ruta en kilómetros.
// Desnivel medio de la ruta.
// Usuarios que han realizado la ruta (IDs).
// Tipo de actividad: Indicador si la ruta se puede realizar en bicicleta o corriendo.
// Calificación media de la ruta.

export interface TrackDocumentInterface extends Document {
  id: number,
  name: string
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
    trim: true
  }
});

export const Track = model<TrackDocumentInterface>('Track', TrackSchema);
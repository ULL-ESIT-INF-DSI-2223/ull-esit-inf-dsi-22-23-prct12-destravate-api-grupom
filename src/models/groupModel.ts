import { Document, Schema, model } from 'mongoose';


export interface GroupDocumentInterface extends Document {
  id: number
}


const GroupSchema = new Schema<GroupDocumentInterface>({
});



export const Group = model<GroupDocumentInterface>('Group', GroupSchema);

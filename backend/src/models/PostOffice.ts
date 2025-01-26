import mongoose, { Document, Schema } from 'mongoose';
import { PostOffice } from '../entities/PostOffice';

const postOfficeSchema: Schema = new mongoose.Schema<PostOffice>({
  zipCode: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
  },
});

export const PostOfficeModel = mongoose.model<PostOffice & Document>('PostOffice', postOfficeSchema);
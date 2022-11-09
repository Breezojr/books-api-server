import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.model';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: true })
  isPublic: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
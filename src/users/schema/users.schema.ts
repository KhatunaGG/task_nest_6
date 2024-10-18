import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({timestamps: true})
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({select: false})
  password: string;

  @Prop()
  userImageUrl: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }])
  expenses: mongoose.Schema.Types.ObjectId[];
}

export const UserScheme = SchemaFactory.createForClass(User)
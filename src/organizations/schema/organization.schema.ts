import { Schema } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { Seat, SeatSchema } from './seat.schema';

@Schema()
export class Organization {
  @Prop()
  name: string;

  @Prop()
  accessCode: string;

  @Prop()
  showTime: string;

  @Prop({ type: [SeatSchema] })
  seatPlan: Seat[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Seat{
    @Prop()
    seatNumber: string;

    @Prop()
    isBooked: boolean;

    @Prop()
    isHold: boolean;

    @Prop()
    isCanHold: boolean;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
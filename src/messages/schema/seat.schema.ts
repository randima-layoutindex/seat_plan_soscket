import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Seat{
    @Prop()
    seatId: string;

    @Prop()
    onHold: boolean;

    @Prop()
    canUnhold: boolean;

    @Prop()
    tempId: string;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
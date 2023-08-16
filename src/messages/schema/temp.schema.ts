import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { SeatSchema,Seat } from "./seat.schema";

@Schema()
export class Temp{
    @Prop()
    channelName:string;

    // @Prop({ type: [SeatSchema] })
    // seatPlan: Seat[];

    @Prop()
    seatId: string;

    @Prop()
    onHold: boolean;

    @Prop()
    canUnhold: boolean;

    @Prop()
    tempId: string;
}

export const TempSchema = SchemaFactory.createForClass(Temp);
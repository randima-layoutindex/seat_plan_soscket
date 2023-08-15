import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Temp{
    @Prop()
    channelName:string;
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
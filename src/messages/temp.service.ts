import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Temp } from "./schema/temp.schema";
import mongoose from "mongoose";


@Injectable()
export class TempService{
    constructor(
        @InjectModel(Temp.name)
        private tempModel:mongoose.Model<Temp>
    ){}

    async create(temp:any):Promise<Temp>{
      const res = await this.tempModel.findOne(temp)
      if(!res){

        const res = await this.tempModel.create(temp)
        return res
      }
        return res
    }

    async findAll():Promise<Temp[]>{
        const res = await this.tempModel.find()
return res  
  }

  async finAllByChannel(channelName:string):Promise<Temp[]>{
    const res = await this.tempModel.find({channelName})
    return res
  }


  async findOne(channelName:string):Promise<Temp>{
    const res = await this.tempModel.findOne({channelName})
    return res
  }

  async updateOne(channelName:string,updateBody:any):Promise<Temp>{
    let res = await this.tempModel.findOneAndUpdate({channelName:channelName,seatId:updateBody.seatId},updateBody,{
        new:true,
        runValidators:true
    })

    if(!res){
      let data = {channelName:channelName,...updateBody}
        res = await this.tempModel.create(data)
    }



    return res
  }
  async deleteOne(channelName:string):Promise<Temp>{
    const res = await this.tempModel.findOneAndDelete({channelName})
    return res
  }

  async sessionCancelled(updateBody:any):Promise<Temp>{
    console.log(updateBody.channelName,updateBody.seatId,"ThiS IS FROM SESSION CANCELLED")
    const res = await this.tempModel.findOneAndUpdate({channelName:updateBody.channelName,seatId:updateBody.seatId},updateBody,{
      new:true
    })
console.log(res)
    return res
  }





}
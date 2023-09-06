import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Temp } from "./schema/temp.schema";
import mongoose from "mongoose";
import {db} from '../../db/client'
import generateUniqueId from "generate-unique-id";


// @Injectable()
// export class TempService{
//     constructor(
//         @InjectModel(Temp.name)
//         private tempModel:mongoose.Model<Temp>
//     ){}
// // creating a new channel 
//     async create(temp:any):Promise<Temp>{
//       // check if there is already channel with that channel name and seat id
//       const id = generateUniqueId({
//         length: 32,
//         useLetters: false
//       });
//       const res = await this.tempModel.findOne(temp)

//       // if there are no channel with the channel name and seat id create one
//       if(!res){

//         const res = await this.tempModel.create(temp)
//         return res
//       }
//         return res
//     }

//     // fetch all the data in temp model
//     async findAll():Promise<Temp[]>{
//         const res = await this.tempModel.find()
// return res  
//   }


//   // find seat data by channel name
//   async finAllByChannel(channelName:string):Promise<Temp[]>{
//     const res = await this.tempModel.find({channelName})
//     return res
//   }



//   // find one by channel name
//   async findOne(channelName:string):Promise<Temp>{
//     const res = await this.tempModel.findOne({channelName})
//     return res
//   }

//   // update one record in temp by channel name and seat id
//   async updateOne(channelName:string,updateBody:any):Promise<Temp>{
//     let res = await this.tempModel.findOneAndUpdate({channelName:channelName,seatId:updateBody.seatId},updateBody,{
//         new:true,
//         runValidators:true
//     })

//     // if there is no record with the channel name and seatid creating new recocrd with the data
//     if(!res){
//       let data = {channelName:channelName,...updateBody}
//         res = await this.tempModel.create(data)
//     }
//     return res
//   }

//   // delete one record by channel name
//   async deleteOne(channelName:string):Promise<Temp>{
//     const res = await this.tempModel.findOneAndDelete({channelName})
//     return res
//   }


//   // set seat data to initial state by updating channel name and seat id
//   async sessionCancelled(updateBody:any):Promise<Temp>{
//     const res = await this.tempModel.findOneAndUpdate({channelName:updateBody.channelName,seatId:updateBody.seatId},updateBody,{
//       new:true
//     })
//     return res
//   }





// }






@Injectable()
export class TempService{
    constructor(
        @InjectModel(Temp.name)
        private tempModel:mongoose.Model<Temp>
    ){}
// creating a new channel 
    async create(temp:any):Promise<Temp>{
      // check if there is already channel with that channel name and seat id
      const id = generateUniqueId({
        length: 32,
        useLetters: false
      });
      const res = await this.tempModel.findOne(temp)

      // if there are no channel with the channel name and seat id create one
      if(!res){

        const res = await this.tempModel.create(temp)
        return res
      }
        return res
    }

    // fetch all the data in temp model
    async findAll():Promise<Temp[]>{
        const res = await this.tempModel.find()
     
return res  
  }


  // find seat data by channel name
  async finAllByChannel(channelName:string):Promise<Temp[]>{

    let params = {
      TableName:"users",
      // FilterExpression:"channelName = :channelName",
      FilterExpression:"channelName = :channelName and currentType = :currentType",
      ExpressionAttributeValues:{
        ":channelName":`seatPlan_1234V2_60606060`,
        ":currentType":"selected"
    }
      }
    const res = await db.scan(params).promise()
    // const res = await this.tempModel.find({channelName})
    // console.log(res.Items,"THIS IS FROM FIND ALL BY CHANNEL")
    return res.Items
  }



  // find one by channel name
  async findOne(channelName:string):Promise<Temp>{
    const res = await this.tempModel.findOne({channelName})
    return res
  }

  // update one record in temp by channel name and seat id
  async updateOne(channelName:string,updateBody:any):Promise<Temp>{
    
    console.log(updateBody,"Update one route is working....")
    // let id = generateUniqueId()
    // console.log(id,"This is unique id")
    // updateBody.id = Math.random()

    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    const isoDateStringWithOffset = isoDateString.replace('Z', '+00:00');

    updateBody.updatedAt = isoDateStringWithOffset

    updateBody.channelName = channelName
    console.log(updateBody)
    const params = {
      TableName: 'users',
      Item: updateBody
  }

  let res = await db.put(params).promise()
  console.log(res,"THIS IS FROM THE CREATED OR UPDATED ONE")

  // try{
  //     await db.put(params).promise()
  //     return { success: true }
  // } catch(error){
  //     return { success: false}
  // }


    // let res = await this.tempModel.findOneAndUpdate({channelName:channelName,seatId:updateBody.seatId},updateBody,{
    //     new:true,
    //     runValidators:true
    // })

    // if there is no record with the channel name and seatid creating new recocrd with the data
    if(!res){
      let data = {channelName:channelName,...updateBody}
        res = await this.tempModel.create(data)
    }
    return updateBody
  }

  // delete one record by channel name
  async deleteOne(channelName:string):Promise<Temp>{
    const res = await this.tempModel.findOneAndDelete({channelName})
    return res
  }


  // set seat data to initial state by updating channel name and seat id
  async sessionCancelled(updateBody:any):Promise<Temp>{
    const res = await this.tempModel.findOneAndUpdate({channelName:updateBody.channelName,seatId:updateBody.seatId},updateBody,{
      new:true
    })
    return res
  }





}
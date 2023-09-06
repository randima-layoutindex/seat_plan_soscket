import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit,Controller,Get, Body,Patch } from '@nestjs/common';
import { TempService } from 'src/messages/temp.service';
import { Temp } from './schema/temp.schema';
import {db} from "../../db/client"

// Handle sesseion end request
@Controller("tempseatplan")
export class TempseatController{
    constructor(private tempService:TempService){}

    @Patch("sessionCancelled")
    async sessionUpdate(@Body()updateBody:any):Promise<any>{
      // const res =  await this.tempService.sessionCancelled(updateBody)
      // return res

// console.log("session Cancelled route working..")
      // updateBody.channelName = channelName
      // console.log(updateBody)

      const currentDate = new Date();
const isoDateString = currentDate.toISOString();
const isoDateStringWithOffset = isoDateString.replace('Z', '+00:00');

updateBody.updatedAt = isoDateStringWithOffset
      const params = {
        TableName: 'users',
        Item: updateBody
    }

    let res = await db.put(params).promise()
    // console.log(res,"THIS IS FROM THE CREATED OR UPDATED ONE")
    }
    // return res

  

  }


  // Initializing webs socket

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server
  socketNew: Socket
  constructor(private readonly messagesService: MessagesService
    ,
    private readonly tempService:TempService
    ) { }


// connect to socket on initialization
  onModuleInit() {
    this.server.on("connection", (socket) => {
      this.socketNew = socket
      // console.log(`client connected :${socket.id}`)
    })
  }


  // handling join request from frontend
  @SubscribeMessage("join")
  async onJoinRequest(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    client.join(body)
    // destructing body params
    let { accessCode, showTimeId } = body;

    // assigning client to a perticular seatplan
    client.join(`seatPlan_${accessCode}_${showTimeId}`)
    // let data = {channelName:`seatPlan_${accessCode}_${showTimeId}`}

    // fetch all data in about the seatplan if there are no seat plan creating it
    const res = await this.tempService.finAllByChannel(`seatPlan_${accessCode}_${showTimeId}`)
    console.log(res,`seatPlan_${accessCode}_${showTimeId}`)

    // sending fetched temp data to subsribed channel
    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onJoin", res)

  }


  // handling newMessage request from the frontend
  @SubscribeMessage("newMessage")
  async onNewMessage(@MessageBody() body: any) {
    // destructing body data
    let { accessCode, showTimeId } = body;
    console.log(body,"INCOMING DATA...")

    // updating seatdata in the temp database
    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", body.payload || body)
    const res  = await this.tempService.updateOne(`seatPlan_${accessCode}_${showTimeId}`,body.payload || body)
    // console.log(res,"emiting data....")
    //sending updated data to clients that has subscibed to perticular channel
  }

  
}



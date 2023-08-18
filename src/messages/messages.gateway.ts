import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit,Controller,Get, Body,Patch } from '@nestjs/common';
import { TempService } from 'src/messages/temp.service';
import { Temp } from './schema/temp.schema';

// Handle sesseion end request
@Controller("tempseatplan")
export class TempseatController{
    constructor(private tempService:TempService){}

    @Patch("sessionCancelled")
    async sessionUpdate(@Body()updateBody:any):Promise<Temp>{
      const res =  await this.tempService.sessionCancelled(updateBody)
      return res
    }

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
    let { accessCode, showTimeId } = body;

    client.join(`seatPlan_${accessCode}_${showTimeId}`)
    // let data = {channelName:`seatPlan_${accessCode}_${showTimeId}`}
    const res = await this.tempService.finAllByChannel(`seatPlan_${accessCode}_${showTimeId}`)
    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onJoin", res)

  }

  @SubscribeMessage("newMessage")
  async onNewMessage(@MessageBody() body: any) {
    let { accessCode, showTimeId } = body;

    const res  = await this.tempService.updateOne(`seatPlan_${accessCode}_${showTimeId}`,body.payload)

    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", res)
  }

  
}



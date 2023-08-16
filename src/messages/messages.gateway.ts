import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit,Controller,Get, Body,Patch } from '@nestjs/common';
import { ClientRequest } from 'http';
import { TempService } from 'src/messages/temp.service';
import { Temp } from './schema/temp.schema';


@Controller("tempseatplan")
export class TempseatController{
    constructor(private tempService:TempService){}

    @Get("testing")
    testing(){
      console.log("working...")
    }

    @Patch("sessionCancelled")
    async sessionUpdate(@Body()updateBody:any):Promise<Temp>{
      console.log("session cancel route working.....")
      const res =  await this.tempService.sessionCancelled(updateBody)

      

      return res
    }

  }



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

  onModuleInit() {
    this.server.on("connection", (socket) => {
      this.socketNew = socket
      console.log(`client connected :${socket.id}`)
    })
  }

  @SubscribeMessage("join")
  async onJoinRequest(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    client.join(body)
    let { accessCode, showTimeId } = body;
    // console.log(`seatPlan_${accessCode}_${showTimeId}`, "joining")
    client.join(`seatPlan_${accessCode}_${showTimeId}`)
    let data = {channelName:`seatPlan_${accessCode}_${showTimeId}`}
    // const resCreated = await this.tempService.create(data)
    const res = await this.tempService.finAllByChannel(`seatPlan_${accessCode}_${showTimeId}`)
    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onJoin", res)

  }

  @SubscribeMessage("newMessage")
  async onNewMessage(@MessageBody() body: any) {
    let { accessCode, showTimeId } = body;

    const res  = await this.tempService.updateOne(`seatPlan_${accessCode}_${showTimeId}`,body.payload)

    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", res)
  }














  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  
}



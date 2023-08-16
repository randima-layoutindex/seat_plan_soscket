import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { ClientRequest } from 'http';
import { TempService } from 'src/messages/temp.service';

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
    console.log(`seatPlan_${accessCode}_${showTimeId}`, "joining")
    client.join(`seatPlan_${accessCode}_${showTimeId}`)
    let data = {channelName:`seatPlan_${accessCode}_${showTimeId}`}
    const resCreated = await this.tempService.create(data)
    const res = await this.tempService.finAllByChannel(`seatPlan_${accessCode}_${showTimeId}`)
    console.log("SENDING CURRENT DATA ON HOLD",res)
    console.log(res,"This is the first payload that is being sent to the frontend")
    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onJoin", res)
    // this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", {
    //   msg: "this message is from on message...",
    //   content: res
    //   // content: body.payload
    // })
    // console.log(res,"channel schema created....")
  }

  @SubscribeMessage("newMessage")
  async onNewMessage(@MessageBody() body: any) {
    let { accessCode, showTimeId } = body;
    // console.log(`seatPlan_${accessCode}_${showTimeId}`, "sending message this is the code from sending message")
    // console.log(body,"+++++++++++++++++++++")
    // client.broadcast.emit("allMessages",body)

    const res  = await this.tempService.updateOne(`seatPlan_${accessCode}_${showTimeId}`,body.payload)

    console.log(res,"AFTER UPDATE")
    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", res)
    // this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", {
    //   msg: "this message is from on message...",
    //   content: res
    //   // content: body.payload
    // })
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

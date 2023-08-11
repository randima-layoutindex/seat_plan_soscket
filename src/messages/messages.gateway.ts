import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { ClientRequest } from 'http';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server
  socketNew: Socket
  constructor(private readonly messagesService: MessagesService) { }

  onModuleInit() {
    this.server.on("connection", (socket) => {
      this.socketNew = socket
    })
  }

  @SubscribeMessage("join")
  onJoinRequest(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    // client.join(body.room)
    let {accessCode,showTimeId} = body;
    client.join(`seatPlan_${accessCode}_${showTimeId}`)  
  }

  @SubscribeMessage("newMessage")
  onNewMessage(@MessageBody() body: any) {
    let {accessCode,showTimeId} = body;

    this.server.to(`seatPlan_${accessCode}_${showTimeId}`).emit("onMessage", {
      msg: "new update",
      content: body.payload
    })
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

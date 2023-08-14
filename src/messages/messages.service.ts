import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  message:Message[] = [{seat:1,onHold:true,booked:true},{seat:2,onHold:true,booked:true},{seat:3,onHold:true,booked:true},{seat:4,onHold:true,booked:true},]
  channelsList = {}

  identify(channelName:string){
    this.channelsList[channelName]

  }
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return this.message;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './schema/organization.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: mongoose.Model<Organization>,
  ) {}

  async create(organization: Organization): Promise<Organization> {
    const res = await this.organizationModel.create(organization);
    return res;
  }

  async findAll(): Promise<Organization[]> {
    return await this.organizationModel.find();
  }

  async findOne(id: string): Promise<Organization> {
    console.log(id);
    return await this.organizationModel.findById(id); 
  }

  async testing():Promise<any>{
    return await this.organizationModel.find()
  }

  async findOneByParams(accessCode:string | number, showTimeId :string | number):Promise<Organization[]>{
    console.log(accessCode,showTimeId)
    let data = {name:"Rio Cinema",
  accessCode:accessCode,
showTime:showTimeId}
console.log(data,"This is the correct access code")


// return await this.organizationModel.find()
return await this.organizationModel.find({...data})
  }
}

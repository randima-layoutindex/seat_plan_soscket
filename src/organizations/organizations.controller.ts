import { OrganizationsService } from "./organizations.service";
import {Controller,Get,Param,Query} from "@nestjs/common"
import { Organization } from "./schema/organization.schema";
import {db} from "../../db/client"



@Controller("organizations")
export class OrganizationController{
    constructor(private organizationService:OrganizationsService){}

    @Get()
    async testing():Promise<any>{
return this.organizationService.findAll()
    }

    @Get("/finOneByParams")
    async findOneByParams(@Query()query:any):Promise<Organization[]>{
      const organisation =await this.organizationService.findOneByParams(query.accessCode,query.showTimeId,query.name)
      return organisation
    }

    @Get("/dynamoTest")
    async findAll(){
      console.log("route working....")
   
      let params = {
        TableName:"users",
        // KeyConditionExression:"channelName = :channelName and seatId = :seatId",
        FilterExpression:"channelName = :channelName and seatId = :seatId",
        // KeyConditionExpression:"channelName = :channelName",
        ExpressionAttributeValues:{
          ":channelName":"seatPlan_1234V2_60606060",
          ":seatId":"A10"
      }
        }
    
      const res =  await db.scan(params).promise()
      // const res =  await db.get(params).promise()
      // console.log(res)
      return res
    }

}
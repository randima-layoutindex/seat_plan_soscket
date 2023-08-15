import { OrganizationsService } from "./organizations.service";
import {Controller,Get,Param,Query} from "@nestjs/common"
import { Organization } from "./schema/organization.schema";
import { query } from "express";



@Controller("organizations")
export class OrganizationController{
    constructor(private organizationService:OrganizationsService){}

    @Get()
    async testing():Promise<any>{
return this.organizationService.findAll()
    }

    @Get("/finOneByParams")
    async findOneByParams(@Query()query:any):Promise<Organization[]>{
    // async findOneByParams(@Query("accessCode")accessCode:string,@Query("showTimeId")showTimeId:string):Promise<Organization[]>{
        // console.log(accessCode,showTimeId)
        console.log(query)
      const organisation =await this.organizationService.findOneByParams(query.accessCode,query.showTimeId)
      return organisation
    }

}
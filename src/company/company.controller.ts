import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/create-company')
  async createCompany(@Body() dto: CreateCompanyDto) {
    return await this.companyService.createCompany(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getMyCompany(@Request() req) {
    return await this.companyService.getCompanySummaryByUserEmail(
      req.user.email,
    );
  }
}

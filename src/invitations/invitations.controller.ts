import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CheckEmailDto } from './dto/check-email.dto';

@Controller('invitations')
@ApiTags('Invitations')
@ApiHeader({ name: 'locale' })
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiBearerAuth()
  async create(
    @CurrentUser() user,
    @Req() req,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    const locale = req.headers.locale || 'tr';

    return this.invitationsService.create(user, createInvitationDto, locale);
  }

  @Get()
  @ApiBearerAuth()
  async findAll(@Query('id') id: string) {
    return await this.invitationsService.findAll(+id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.invitationsService.findOne(+id);
  // }

  @Public()
  @Put('accept/:code')
  @ApiQuery({
    name: 'token',
    required: true,
  })
  async updateAcceptedByToken(@Query('token') token) {
    return await this.invitationsService.updateAcceptedByToken(token);
  }

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
  ) {
    return await this.invitationsService.update(+id, updateInvitationDto);
  }

  @Get('check-link')
  @ApiBearerAuth()
  async isRevoked(@Query('token') token: string) {
    return this.invitationsService.checkToken(token);
  }

  @Post('profile-picture')
  @ApiBearerAuth()
  async getUserProfilePicture(@Body() checkEmailDto: CheckEmailDto) {
    return this.invitationsService.getProfilePicture(checkEmailDto);
  }

  // @Delete(':id')
  // @ApiBearerAuth()
  // remove(@Param('id') id: string) {
  //   return this.invitationsService.remove(+id);
  // }
}

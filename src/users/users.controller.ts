import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/role.enums';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConfirmationGuard } from '../auth/guards/confirmation.guard';
import { UpdateUserMeDto } from './dto/update-user-me.dto';
import { ResendMailDto } from 'src/mail/entities/resend-mail.entity';
import { ConfirmationMailDto } from 'src/mail/entities/confirm-mail.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { checkPassword } from 'src/common/helpers/password.helper';
import { StoriesService } from '../story/services/stories.service';
import { profileImageUpload } from '../common/helpers/multer.helper';

@Controller('users')
@ApiTags('Users')
@ApiHeader({ name: 'locale' })
export class UsersController {
  constructor(
    private service: UsersService,
    private storiesService: StoriesService,
  ) {}
  @Public()
  @Post()
  async create(@Req() req, @Body() user: CreateUserDto): Promise<any> {
    try {
      const locale = req.headers.locale || 'tr';
      const savedUser = await this.service.create(user, locale);
      return {
        message: 'user.CHECK_REGISTER_VERIFICATION_MAIL',
        data: savedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('confirm')
  async confirm(@Body() data: ResendMailDto) {
    try {
      const { email, code } = data;
      return await this.service.confirmEmail(email, code);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('resend-confirm')
  @ApiProperty({
    name: 'email',
    required: true,
  })
  async resendConfirmationMail(@Req() req, @Body() body: ConfirmationMailDto) {
    try {
      const locale = req.headers.locale || 'tr';
      const { email } = body;
      return await this.service.resendConfirmationMail(email, locale);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('me')
  @ApiBearerAuth()
  async findOne(@CurrentUser() user: User): Promise<any> {
    return { data: user };
  }

  @Put('me/security')
  @ApiBearerAuth()
  async changePassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    const { password } = await this.service.findOneById(user.id);
    const { currentPassword, newPassword } = updatePasswordDto;
    const isMatch = await checkPassword(currentPassword, password);
    if (!isMatch)
      return { statusCode: 400, message: 'user.PASSWORD_IS_NOT_CORRECT' };
    await this.service.updateUser(user.id, {
      password: newPassword,
    });
    return { message: 'user.PASSWORD_UPDATED_SUCCESSFULLY' };
  }

  @Put('me')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        surname: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', profileImageUpload))
  async updateOne(
    @CurrentUser() user: User,
    @Body() data: UpdateUserMeDto,
    @UploadedFile() file,
  ): Promise<any> {
    const { name, surname } = data;
    const updateObject = {};

    if (name) updateObject['name'] = name;
    if (surname) updateObject['surname'] = surname;
    if (file?.location) updateObject['profilePicture'] = file.location;

    return await this.service.updateUser(user.id, updateObject);
  }

  @Get('me/story')
  @ApiBearerAuth()
  async getStories(
    @CurrentUser() user: User,
    @Query('orderBy') orderBy: string,
  ) {
    try {
      const stories = await this.storiesService.findUsersStories(
        user.id,
        orderBy,
      );

      return { data: stories };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(ConfirmationGuard)
  @ApiBearerAuth()
  getAll() {
    return this.service.findAll();
  }

  @Delete('profile-picture')
  @ApiBearerAuth()
  async removeUserProfilePicture(@CurrentUser() user: User) {
    try {
      return await this.service.removeUserProfilePicture(user.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async update(@Param() params, @Body() updateUserDto: UpdateUserDto) {
    return await this.service.updateUser(parseInt(params.id), updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.service.softDeleteUser(id);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  async get(@Param() params) {
    const user = await this.service.findOneById(params.id);
    if (!user) {
      throw new HttpException('user.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return { data: user };
  }
}

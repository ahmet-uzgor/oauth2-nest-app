import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { v4 as uuidv4 } from 'uuid';
import { StoriesService } from '../story/services/stories.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly coursesService: StoriesService,
    private readonly mailService: MailService,
    private readonly userService: UsersService,
  ) {}

  async create(user, createInvitationDto: CreateInvitationDto, locale: string) {
    const { emails, story } = createInvitationDto;
    if (emails.length == 0) {
      return {
        statusCode: 400,
        message: 'mail.EMAIL_IS_NOT_EMPTY',
      };
    }
    const course = await this.coursesService.findOne(story);

    for (const email of emails) {
      const isExist = await this.invitationRepository.findOne({
        email,
        story,
      });

      if (!isExist || isExist.revoke) {
        const invitation = await this.invitationRepository.save({
          story,
          user,
          email,
          locale,
          token: uuidv4(),
        });
        await this.mailService.sendInvitation(
          user,
          email,
          invitation.token,
          course.title,
          locale,
        );
      }
    }
    return 'This action adds a new invitation';
  }

  async findAll(storyId) {
    const invitations = await this.invitationRepository.find({
      story: storyId,
    });
    if (invitations.length == 0)
      return { message: 'There is not invitation for this story' };
    return { data: invitations };
  }

  findOne(id: number) {
    return `This action returns a #${id} invitation`;
  }

  async update(id: number, updateInvitationDto: UpdateInvitationDto) {
    const invitation = await this.invitationRepository.findOne(id);
    if (!invitation) {
      throw new HttpException(
        `course.CARD_NOT_FOUND{id:${id}}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.invitationRepository.save({ id, ...updateInvitationDto });
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }

  async checkToken(token: string) {
    const invitation = await this.invitationRepository.findOne({ token });
    if (!invitation || invitation.revoke) {
      return { message: 'You do not have permission to view this course' };
    }
    return { data: invitation };
  }

  async getProfilePicture(checkEmailDto) {
    const results = [];
    const { emails, storyId } = checkEmailDto;
    console.log(checkEmailDto);
    for (const email of emails) {
      const user = await this.userService.findOne({ email });
      const invitation = await this.invitationRepository.findOne({
        email,
        story: storyId,
        revoke: false,
      });
      const isAccepted = invitation
        ? invitation.isAccepted
        : 'There is not invitation for this email';

      if (!user) {
        results.push({
          email,
          result: `No registered user with ${email}!`,
          isAccepted,
        });
      } else {
        results.push({ email, result: user.profilePicture, isAccepted });
      }
    }

    return { data: results };
  }

  async updateAcceptedByToken(token: string) {
    const invitation = await this.invitationRepository.findOne({ token });
    if (!invitation)
      throw new HttpException(
        `story.NOT_FOUND{id:${token}}`,
        HttpStatus.BAD_REQUEST,
      );

    invitation.isAccepted = true;

    return await this.invitationRepository.save(invitation);
  }
}

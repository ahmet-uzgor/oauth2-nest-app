import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvitationDto {
  @ApiProperty()
  revoke: boolean;
}

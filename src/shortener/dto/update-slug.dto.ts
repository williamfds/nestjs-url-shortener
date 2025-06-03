import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSlugDto {
  @ApiProperty({ description: 'New slug', example: 'myCustomSlug' })
  @IsString()
  @Length(4, 30)
  newSlug: string;
}
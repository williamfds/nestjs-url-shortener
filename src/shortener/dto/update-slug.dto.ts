import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSlugDto {
  @ApiProperty({
    description:
      'New slug (must be between 4 and 30 characters)\n\n' +
      'Novo slug (deve ter entre 4 e 30 caracteres)',
    example: 'myCustomSlug',
  })
  @IsString()
  @Length(4, 30, {
    message:
      'Slug must be between 4 and 30 characters / Slug deve ter entre 4 e 30 caracteres',
  })
  newSlug: string;
}

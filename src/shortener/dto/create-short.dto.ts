import { IsUrl, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortDto {
  @ApiProperty({
    description: 'The URL to shorten. Must include http:// or https://',
    example: 'https://nestjs.com',
  })
  @IsString()
  @IsUrl(
    { require_protocol: true },
    { message: 'Invalid URL: missing protocol' },
  )
  url: string;
}

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  NotFoundException,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortDto } from './dto/create-short.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateSlugDto } from './dto/update-slug.dto';

@ApiTags('shortener')
@Controller()
export class ShortenerController {
  constructor(private readonly shortService: ShortenerService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiResponse({
    status: 201,
    description: 'Short URL created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL format.',
  })
  async createShort(@Body() createDto: CreateShortDto) {
    const result = await this.shortService.createShort(createDto);
    return result;
  }

  @Get('stats/:slug')
  @ApiOperation({ summary: 'Get statistics for a short URL' })
  @ApiParam({
    name: 'slug',
    description: 'The slug identifier of the short URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics.',
  })
  @ApiResponse({ status: 404, description: 'Short URL not found.' })
  async getStats(@Param('slug') slug: string) {
    return this.shortService.getStats(slug);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect to original URL for a given slug' })
  @ApiParam({
    name: 'slug',
    description: 'The slug to redirect',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to original URL.',
  })
  @ApiResponse({ status: 404, description: 'Short URL not found.' })
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    try {
      const originalUrl = await this.shortService.getOriginalUrl(slug);
      await this.shortService.incrementHits(slug);
      return res.redirect(HttpStatus.FOUND, originalUrl);
    } catch (err) {
      if (err instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Short URL not found' });
      }
      throw err;
    }
  }

  @Patch('slug/:slug')
  @ApiOperation({ summary: 'Update slug of a short URL' })
  async updateSlug(
    @Param('slug') slug: string,
    @Body() dto: UpdateSlugDto,
  ) {
    await this.shortService.updateSlug(slug, dto.newSlug);
    return { message: 'Slug updated successfully.' };
  }

  @Delete('slug/:slug')
  @ApiOperation({ summary: 'Delete a short URL by slug' })
  @ApiParam({ name: 'slug', description: 'Slug to delete' })
  @ApiResponse({ status: 200, description: 'Slug deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Slug not found.' })
  async deleteSlug(@Param('slug') slug: string) {
    await this.shortService.deleteSlug(slug);
    return { message: 'Slug deleted successfully.' };
  }

}

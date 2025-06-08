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
  @ApiOperation({ summary: 'Create a new short URL / Criar nova URL curta' })
  @ApiResponse({
    status: 201,
    description: 'Short URL created successfully.\n\nURL curta criada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL format.\n\nFormato de URL inválido.',
  })
  async createShort(@Body() createDto: CreateShortDto) {
    return this.shortService.createShort(createDto);
  }

  @Get('stats/:slug')
  @ApiOperation({ summary: 'Get statistics for a short URL / Obter estatísticas da URL curta' })
  @ApiParam({
    name: 'slug',
    description: 'Slug that identifies the short URL / Identificador da URL curta',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns statistics.\n\nRetorna estatísticas da URL.',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found.\n\nURL curta não encontrada.',
  })
  async getStats(@Param('slug') slug: string) {
    return this.shortService.getStats(slug);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect to original URL / Redirecionar para a URL original' })
  @ApiParam({
    name: 'slug',
    description: 'The slug to redirect / Slug para redirecionamento',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to original URL.\n\nRedireciona para a URL original.',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found.\n\nURL curta não encontrada.',
  })
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    try {
      const originalUrl = await this.shortService.getOriginalUrl(slug);
      await this.shortService.incrementHits(slug);
      return res.redirect(HttpStatus.FOUND, originalUrl);
    } catch (err) {
      if (err instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Short URL not found / URL curta não encontrada' });
      }
      throw err;
    }
  }

  @Patch('slug/:slug')
  @ApiOperation({ summary: 'Update slug of a short URL / Atualizar o slug da URL curta' })
  @ApiResponse({ status: 200, description: 'Slug updated successfully.\n\nSlug atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Slug not found.\n\nSlug não encontrado.' })
  async updateSlug(@Param('slug') slug: string, @Body() dto: UpdateSlugDto) {
    await this.shortService.updateSlug(slug, dto.newSlug);
    return { message: 'Slug updated successfully / Slug atualizado com sucesso' };
  }

  @Delete('slug/:slug')
  @ApiOperation({ summary: 'Delete a short URL by slug / Deletar uma URL curta pelo slug' })
  @ApiParam({ name: 'slug', description: 'Slug to delete / Slug a ser deletado' })
  @ApiResponse({ status: 200, description: 'Slug deleted successfully.\n\nSlug deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Slug not found.\n\nSlug não encontrado.' })
  async deleteSlug(@Param('slug') slug: string) {
    await this.shortService.deleteSlug(slug);
    return { message: 'Slug deleted successfully / Slug deletado com sucesso' };
  }
}


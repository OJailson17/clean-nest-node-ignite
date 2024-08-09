import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@//auth/current-user.decorator';
import { JwtAuthGuard } from '@//auth/jwt-auth.guard';
import { UserPayload } from '@//auth/jwt.strategy';
import { ZodValidationPipe } from '@//pipes/zod-validation-pipe';
import { PrismaService } from '@//prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { content, title } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId: userId,
      },
    });
  }

  private convertToSlug(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  }
}

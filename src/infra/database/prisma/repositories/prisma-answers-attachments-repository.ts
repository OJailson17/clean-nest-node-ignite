import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answers-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmentMapper } from '../../mappers/prisma-answer-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswersAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return answerAttachments.map((attachment) => {
      return PrismaAnswerAttachmentMapper.toDomain(attachment);
    });
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }
}

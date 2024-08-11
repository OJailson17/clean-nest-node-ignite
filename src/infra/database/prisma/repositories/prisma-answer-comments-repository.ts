import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  create(questionComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(questionComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }
}

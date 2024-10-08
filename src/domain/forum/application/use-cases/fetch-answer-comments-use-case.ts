import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswersCommentsRequest {
  page: number;
  answerId: string;
}

type FetchAnswersCommentsResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetchAnswersCommentsUseCase {
  constructor(private answersCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswersCommentsRequest): Promise<FetchAnswersCommentsResponse> {
    const answerComments =
      await this.answersCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      answerComments,
    });
  }
}

import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsRequest {
  page: number;
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}

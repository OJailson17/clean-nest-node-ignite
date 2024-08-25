import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface FetchQuestionsCommentsRequest {
  page: number;
  questionId: string;
}

type FetchQuestionsCommentsResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionsCommentsUseCase {
  constructor(
    private questionsCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionsCommentsRequest): Promise<FetchQuestionsCommentsResponse> {
    const questionComments =
      await this.questionsCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}

import { Either, left, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { AnswersRepository } from '../repositories/answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface CommentOnAnswerRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerResponse = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComment;
	}
>;

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({
		answerId,
		content,
		authorId,
	}: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityID(authorId),
			answerId: new UniqueEntityID(answerId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({
			answerComment,
		});
	}
}

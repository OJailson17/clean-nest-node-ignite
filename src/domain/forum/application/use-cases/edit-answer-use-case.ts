import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentsRepository } from '../repositories/answers-attachments-repository';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

interface EditAnswerRequest {
	answerId: string;
	authorId: string;
	attachmentsIds: string[];
	content: string;
}

type EditAnswerResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer;
	}
>;

export class EditAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
		attachmentsIds,
	}: EditAnswerRequest): Promise<EditAnswerResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError());
		}

		const currentAnswerAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

		const answerAttachmentList = new AnswerAttachmentList(
			currentAnswerAttachments,
		);

		const answerAttachments = attachmentsIds.map(attachmentId => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				answerId: answer.id,
			});
		});

		answerAttachmentList.update(answerAttachments);

		answer.attachments = answerAttachmentList;
		answer.content = content;

		await this.answersRepository.save(answer);

		return right({
			answer,
		});
	}
}

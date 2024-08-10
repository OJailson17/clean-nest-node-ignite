import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { AnswerAnswerUseCase } from './answer-question-use-case';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerAnswerUseCase;

describe('Answer Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new AnswerAnswerUseCase(inMemoryAnswersRepository);
	});

	it('should be able to create an answer', async () => {
		const result = await sut.execute({
			content: 'New answer',
			instructorId: '1',
			answerId: '1',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({
					attachmentId: new UniqueEntityID('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityID('2'),
				}),
			],
		);
	});
});

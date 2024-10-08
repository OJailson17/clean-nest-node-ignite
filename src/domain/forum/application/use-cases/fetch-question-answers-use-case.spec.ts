import { FetchQuestionAnswersUseCase } from './fetch-question-answers-use-case';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Answers', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it('should be able to fetch questions answers', async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityID('question-1') }),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityID('question-1') }),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityID('question-1') }),
		);

		const result = await sut.execute({
			page: 1,
			questionId: 'question-1',
		});

		expect(result.value?.answers).toHaveLength(3);
	});
	it('should be able to fetch paginated questions answers', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityID('question-2') }),
			);
		}

		const result = await sut.execute({
			page: 2,
			questionId: 'question-2',
		});

		expect(result.value?.answers).toHaveLength(2);
	});
});

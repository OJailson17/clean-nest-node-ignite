import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { FetchAnswersCommentsUseCase } from './fetch-answer-comments-use-case';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswersCommentsUseCase;

describe('Fetch Answer Comments', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new FetchAnswersCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to fetch answers comment', async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
		);

		const result = await sut.execute({
			page: 1,
			answerId: 'answer-1',
		});

		expect(result.value?.answerComments).toHaveLength(3);
	});
	it('should be able to fetch paginated answers comment', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityID('answer-2') }),
			);
		}

		const result = await sut.execute({
			page: 2,
			answerId: 'answer-2',
		});

		expect(result.value?.answerComments).toHaveLength(2);
	});
});

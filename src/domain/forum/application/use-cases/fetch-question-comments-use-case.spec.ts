import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { FetchQuestionsCommentsUseCase } from './fetch-question-comments-use-case';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionsCommentsUseCase;

describe('Fetch Question Comments', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionsCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to fetch questions comment', async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
		);

		const result = await sut.execute({
			page: 1,
			questionId: 'question-1',
		});

		expect(result.value?.questionComments).toHaveLength(3);
	});
	it('should be able to fetch paginated questions comment', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityID('question-2') }),
			);
		}

		const result = await sut.execute({
			page: 2,
			questionId: 'question-2',
		});

		expect(result.value?.questionComments).toHaveLength(2);
	});
});

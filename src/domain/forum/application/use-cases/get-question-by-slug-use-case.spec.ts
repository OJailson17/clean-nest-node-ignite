import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug-use-case';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question by Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('test-title'),
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: 'test-title',
		});

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
			}),
		});
	});
});

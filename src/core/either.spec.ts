import { Either, left, right } from './either';

const doSomething = (shouldSucceed: boolean): Either<string, number> => {
	return shouldSucceed ? right(10) : left('error');
};

describe('Error Handler', () => {
	it('success result', () => {
		const result = doSomething(true);

		expect(result.isRight()).toEqual(true);
		expect(result.isLeft()).toEqual(false);
	});

	it('error result', () => {
		const result = doSomething(false);

		expect(result.isLeft()).toEqual(true);
		expect(result.isRight()).toEqual(false);
	});
});

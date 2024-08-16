import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateStudentUseCase } from './authenticate-student-use-case';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeStudent } from 'test/factories/make-student';

let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: AuthenticateStudentUseCase;

describe('Authenticate student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a student', async () => {
    const newStudent = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryStudentsRepository.create(newStudent);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      access_token: expect.any(String),
    });
  });
});

import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common/decorators';
import { StudentsRepository } from '../repositories/students-repository';
import { Student } from '../../enterprise/entities/student';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const studentWithSameEmail =
      await this.studentRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashPassword,
    });

    await this.studentRepository.create(student);

    return right({
      student,
    });
  }
}

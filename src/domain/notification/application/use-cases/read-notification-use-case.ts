import { Either, left, right } from '@/core/either';
import { Notification } from '../../enterprise/entities/notification';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface ReadNotificationRequest {
	notificationId: string;
	recipientId: string;
}

type ReadNotificationResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		notification: Notification;
	}
>;

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		notificationId,
		recipientId,
	}: ReadNotificationRequest): Promise<ReadNotificationResponse> {
		const notification = await this.notificationsRepository.findById(
			notificationId,
		);

		if (!notification) {
			return left(new ResourceNotFoundError());
		}

		if (recipientId !== notification.recipientId.toString()) {
			return left(new NotAllowedError());
		}

		notification.read();

		await this.notificationsRepository.create(notification);

		return right({
			notification,
		});
	}
}

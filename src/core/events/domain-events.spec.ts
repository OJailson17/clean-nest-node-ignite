import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';
import { vi } from 'vitest';

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.aggregate = aggregate;
		this.ocurredAt = new Date();
	}

	getAggregateId(): UniqueEntityID {
		return this.aggregate.id;
	}
}

class CustomAggregate extends AggregateRoot<null> {
	static create() {
		const aggregate = new CustomAggregate(null);

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

		return aggregate;
	}
}

describe('domain events', () => {
	it('should be able to dispatch and listen to event', () => {
		const callbackSpy = vi.fn();

		// subscriber cadastrado (ouvindo o evento de "resposta criada")
		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		// resposta criada SEM salvar no banco
		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		// salvando resposta no banco de dados e disparando o evento
		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalled();
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});

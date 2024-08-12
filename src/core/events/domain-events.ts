import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  /**
   * Este objeto mapeia os nomes das classes de eventos (eventClassName) para arrays de funções de callback. Essas funções serão chamadas quando o evento correspondente for disparado.
   */
  private static handlersMap: Record<string, DomainEventCallback[]> = {};

  /**
   * Esta lista armazena agregados que foram "marcados" para o despacho de eventos. Um agregado é uma entidade que possui eventos de domínio associados a ela.
   */
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  /**
   * Esta função marca um agregado para que seus eventos de domínio sejam despachados posteriormente. Isso garante que, quando eventos associados a este agregado forem disparados, eles sejam processados.
   */
  public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  /**
   * Esta função despacha todos os eventos de domínio associados a um agregado específico. Ela itera sobre a lista de eventos do agregado e chama o método dispatch para cada evento
   */
  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.dispatch(event),
    );
  }

  /**
   * Esta função remove um agregado da lista de agregados marcados após seus eventos terem sido despachados.
   */
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  // Esta função busca um agregado marcado na lista markedAggregates usando seu ID único.
  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  /**
   * Esta função é responsável por despachar todos os eventos de um agregado específico e, em seguida, limpar os eventos do agregado e removê-lo da lista de agregados marcados.
   */
  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  /**
   * Esta função permite registrar manipuladores de eventos. Ela associa um callback a uma classe de evento específica. Quando um evento desse tipo é despachado, o callback registrado será chamado.
   */
  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  /*  
  Limpa todos os handlers registrados. Útil, por exemplo, em testes para garantir que nenhum handler antigo seja chamado acidentalmente.
   */
  public static clearHandlers() {
    this.handlersMap = {};
  }

  // Limpa a lista de agregados marcados para despacho de eventos.
  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  /*
  Esta função despacha um evento específico. Ela verifica se existem handlers registrados para a classe do evento (eventClassName). Se existirem, todos os handlers são chamados com o evento como argumento.
   */
  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered = eventClassName in this.handlersMap;

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}

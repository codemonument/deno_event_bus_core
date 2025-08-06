import { filter, map, type Observable, Subject } from "rxjs";
import type {
  AnyBusEvent,
  BusEvent,
  EventualPayload,
  NewableBusEvent,
  payloadOf,
} from "./bus-event.base.ts";
import { asyncIteratorFromRx } from "async-iterator-from-rx";

/**
 * @type TAllowedEvents
 *   - The type of events that are allowed to be emitted on this event bus.
 *
 *   - Defaults to AnyBusEvent, which means BusEvent<unknown>.
 *     The Bus can then be subscribed with on$(~Any Class instance assignable to BusEvent<unknown>~)
 *
 *   - If you want to be more specific, you can use a union of BusEvent types, e.g.
 *     MyStringEvent extends BusEvent<string>{}
 *     MyNumberEvent extends BusEvent<number>{}
 *     MyPayloadEvent extends BusEvent<{
 *       name: string;
 *       age: number;
 *     }>{}
 *     new EventBusRxJS<MyStringEvent | MyNumberEvent | MyPayloadEvent>
 */
export class EventBusRxJS<
  TAllowedEvents extends AnyBusEvent = AnyBusEvent,
> {
  private eventStream: Subject<TAllowedEvents> = new Subject<TAllowedEvents>();

  // --- PUBLIC FUNCTIONS ---

  /**
   * I filter the event stream to get only events of one type as observable
   * @param typeFilter The event type to listen to
   *        must extend from BusEvent<R>
   *
   * @returns either the Event E or the Payload of E, typed P
   * Note: These types do not be passed manually, they will be inferenced by TS
   */
  public on$<E extends TAllowedEvents & BusEvent<payloadOf<E>>>(
    typeFilter: NewableBusEvent<E>,
  ): Observable<EventualPayload<payloadOf<E>>> {
    return this.eventStream.pipe(
      // Filters all events on the event stream and returns only these, which map the typeFilter
      filter((event: unknown): event is E => {
        return event instanceof typeFilter;
      }),
      // Maps the events to their payloads for easier consumption
      // Note: The return type must be EventualPayload here
      //       to not get `P | undefined` as return type of this map
      map((event: E) =>
        event.payload !== undefined
          ? event.payload
          : (undefined as EventualPayload<payloadOf<E>>)
      ),
    );
  }

  /**
   * Pushes the given event onto the message bus.
   *
   * @param event
   */
  public emit(event: TAllowedEvents): void {
    this.eventStream.next(event);
  }

  /**
   * CAUTION: PLEASE BE SURE WHAT YOU DO WHEN YOU USE THIS!
   *
   * @returns The whole eventStream as rxjs observable.
   * @deprecated Use eventStreamAsObservable() instead
   */
  public get eventStream$(): Observable<TAllowedEvents> {
    return this.eventStream.asObservable();
  }

  public eventStreamAsObservable(): Observable<TAllowedEvents> {
    return this.eventStream.asObservable();
  }

  /**
   * @returns The whole eventStream as async iterable.
   *          This is useful for using the event stream in for-await-of loops.
   *
   * @example
   * ```ts
   * const asyncIterable = ebus.eventStreamAsAsyncIterable();
   * for await (const event of asyncIterable) {
   *   console.log(event);
   * }
   * ```
   */
  public eventStreamAsAsyncIterable(): AsyncIterable<TAllowedEvents> {
    const iteratorStream = asyncIteratorFromRx(this.eventStream);
    return iteratorStream;
  }
}

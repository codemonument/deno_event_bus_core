/**
 * When P = void, resulting type MUST be void, otherwise typescript forces the user
 * to input a payload param when instantiating a child class of BusEvent.
 *
 * Used in the constructor of BusEvent to signify that a class might take an argument for payload data.
 *
 * Caution: do not use 'never' instead of 'void' to even forbid passing "undefined" explicitly,
 * since this forces users to input something here:
 * class PlainEvent extends BusEvent<void>{}
 * const event = new PlainEvent(~~~); // <- this is not allowed, since undefined is not assignable to never
 */
export type EventualPayload<P> = P extends void ? void : P;

/**
 * I am the base-class for all of the events that this application pushes onto the
 * EventBus. The only guarantee that this class makes is a read-only property called `type`.
 *
 * This class has been called 'Event' in original Article.
 *
 * It also allows for a payload being passed into into it.
 * Can be disabled when not needed by simply using it with `void` as the type argument:
 *
 * class EventWithoutPayload extends BusEvent<void> {}
 */
export abstract class BusEvent<TPayload> {
  // This property will be filled with the name of the class extending this base
  public readonly type: string = this.constructor.name;
  constructor(public readonly payload: EventualPayload<TPayload>) {}
}

/**
 * Allows to extract the first and single type param of BusEvent.
 * More Infos:
 * https://stackoverflow.com/questions/70472192/extract-first-generic-argument-from-type
 */
export type ExtractGenericArgument<T> = T extends BusEvent<infer TPayload>
  ? TPayload
  : unknown;

/**
 * Simplified ExtractGenericArgument<eventType> expression, basically just an alias
 *
 * @example
 * ```ts ignore
 * import { expectType } from "tsd";
 *
 * class StringBusEvent extends BusEvent<string> {}
 * payloadOf<StringBusEvent> // => string
 * ```
 */
export type payloadOf<eventType> = ExtractGenericArgument<eventType>;

/**
 * Allows to ensure, that a certain type
 * - can be instantiated with calling `new`
 *   (this is needed to be able to use the type in question with `instanceof`)
 * - has a parameter `payload` which is of type P, unless
 * - P is `void`, in this case it's not allowed to pass anything to this constructor!
 *   (expressed via the conditional `never` type)
 *
 * Technical Details:
 * Actually, this interface does NOT define the class type,
 * but defines the shape of a FUNCTION (like the @FunctionalInterface in Java).
 * Reason: A typescript class name (like Map) internally refers to the constructor of a class,
 * which happens to have more things attached to it's prototype!
 *
 * Imagination:
 * Think of NewableBusEvent interface as a Factory, which nows how to construct stuff with new.
 * In this case, it knows, how to construct instances of E (the event type)
 * See: https://stackoverflow.com/questions/13407036/how-does-interfaces-with-construct-signatures-work
 */

export interface NewableBusEvent<
  TBusEvent extends BusEvent<payloadOf<TBusEvent>>,
> {
  /**
   * @param payload - The payload of the event. Typed to TPayload, extracted from TBusEvent
   */
  new <TPayload extends payloadOf<TBusEvent>>(
    payload: TPayload,
  ): TBusEvent;
}

/**
 * A type that matches any BusEvent, regardless of the payload type.
 */
export type AnyBusEvent = BusEvent<unknown>;

// -- EXPERIMENTAL: NEW HELPER TYPES FOR CONSTRAINING THE ALLOWED EVENTS ON AN EVENT BUS --

// Helper: Extract the constructor for a single event type
type EventConstructorFor<E extends AnyBusEvent> = new (
  payload: payloadOf<E>,
) => E;

// Helper: For a union of events, get a union of their constructors
type EventConstructors<T extends AnyBusEvent> = T extends AnyBusEvent
  ? EventConstructorFor<T>
  : never;

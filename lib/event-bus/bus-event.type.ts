/**
 * When P = void, resulting type MUST be void, otherwise typescript forces the user
 * to input a payload param when instantiating a child class of BusEvent
 */
export type EventualPayload<P> = P extends void ? void : P;

/**
 * I am the base-class for all of the events that this application pushes onto the
 * EventBus. The only guarantee that this class makes is a read-only property called `type`.
 *
 * This class has been called 'Event' in original Article.
 *
 * It also allows for a payload being passed into into it.
 * Can be disabled when not needed by simply extending like this with `void`:
 *
 * class EventWithoutPayload extends BusEvent<void> {
 *   public type = "EventWithoutPayload";
 * }
 *
 * @type payloadType
 * === generic payload type - small name, bc. it's a variable for a type
 * === "type variable" for the typescript type of the payload incomming into the constructor.
 */
export abstract class BusEvent<payloadType> {
  public abstract readonly type: string;
  constructor(public readonly payload: EventualPayload<payloadType>) {}
}

/**
 * Allows to extract the first and single type param of BusEvent.
 * More Infos:
 * https://stackoverflow.com/questions/70472192/extract-first-generic-argument-from-type
 */
export type ExtractGenericArgument<T> = T extends BusEvent<infer Generic>
  ? Generic
  : unknown;

/**
 * Simplified ExtractGenericArgument<eventType> expression
 */
export type payloadOf<eventType> = ExtractGenericArgument<eventType>;

/**
 * Allows to ensure, that a certain type
 * - can be instantiated with calling `new`
 *   (this is needed to be able to use the type in question with `instanceof`)
 * - has a parameter `payload` which is of type P, unles
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
  eventType extends BusEvent<payloadOf<eventType>>
> {
  // payloadType - Define that the constructor gets a Payload
  // Type of the payload is not so clear here,
  // could be of type EventualPayload<P>
  // or simply type: payloadType
  new <payloadType extends payloadOf<eventType>>(
    payload: payloadType
  ): eventType;
}

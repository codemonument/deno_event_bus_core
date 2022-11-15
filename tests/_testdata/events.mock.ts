import { BusEvent } from "@mod";

/**
 * For testing events without payload
 */
export class PlainEvent extends BusEvent<void> {}

/**
 * For testing events with payload
 */
export type DemoPayload = { name: string };
export class EventWithPayload extends BusEvent<DemoPayload> {}

/**
 * For testing events with auto-generated event type
 */
export class ImplicitTypeEvent extends BusEvent<void> {}

/**
 * For testing events with explicitely overriden event type
 */
export class ExplicitTypeEvent extends BusEvent<void> {
  override type = "my-explicit-event-type";
}

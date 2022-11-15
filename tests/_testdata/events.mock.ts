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
export class AutogenEvent extends BusEvent<void> {}

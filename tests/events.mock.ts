import { BusEvent } from "@/mod.ts";

/**
 * For testing events without payload
 */
export class PlainEvent extends BusEvent<void> {
  public type = "PlainEvent";
}

/**
 * For testing events with payload
 */
export interface DemoPayload {
  name: string;
}

export class EventWithPayload extends BusEvent<DemoPayload> {
  public type = "EventWithPayload";
}

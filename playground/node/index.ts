import {
  BusEvent,
  EventBusRxJS as EventBus,
} from "@codemonument/event-bus-core";

// Create new EventBus instance
const bus = new EventBus();

// Create an empty bus event
export class PlainEvent extends BusEvent<void> {}

// Create a bus event with payload
export interface DemoPayload {
  value: number;
}
export class EventWithPayload extends BusEvent<DemoPayload> {}

// Subscribe to events
const sub1 = bus.on$(PlainEvent).subscribe(() => {
  console.log(`Received PlainEvent!`);
});

const sub2 = bus.on$(EventWithPayload).subscribe((payload: DemoPayload) => {
  console.log(`Received EventWithPayload!`, payload);
});

/**
 * Advanced Usage
 */
const advancedSub = bus.eventStream$.subscribe((event: unknown) => {
  console.log(`Received Event: `, event);
});

// Emit events
bus.emit(new PlainEvent());
bus.emit(new EventWithPayload({ value: 10 }));

// Clean up your rxjs subscriptions!
sub1.unsubscribe();
sub2.unsubscribe();
advancedSub.unsubscribe();

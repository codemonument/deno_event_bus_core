# Event Bus Core

Event Bus Core is a library for creating event buses in Node.js and Deno. 
Based on RXJS, with nicely typed event classes.

Published to:

- https://deno.land/x/event_bus_core (main target)
- npm: @codemonument/event-bus-core (cross-compiled with dnt)
- (jsr: @codemonument/event-bus-core directly uploaded) - WIP

## How to Import in Node

```ts
import {EventBusRxJS as EventBus} from '@codemonument/event-bus-core';
```

## How to Import in Deno

Note: Use import url with specific version in production to avoid sudden breaking changes.

```ts
import {EventBusRxJS as EventBus} from 'https://deno.land/x/event_bus_core/mod.ts';
```

## Usage

```ts
import {EventBusRxJS as EventBus} from 'https://deno.land/x/event_bus_core';

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

// Emit events
bus.emit(new PlainEvent());
bus.emit(new EventWithPayload({value: 10}));

// Clean up your rxjs subscriptions!
sub1.unsubscribe();
sub2.unsubscribe();
```

## Advanced Usages

You can subscribe to the underlying RxJS Observable of this event bus, called bus.eventStream$. 
This exposes the raw events to you. 
Normally you don't need this and it's better to use the bus.on$ method which filters to a specific event.

```ts
bus.eventStream$.subscribe((event: unknown) => {
	console.log(`Received Event: `, event);
});
```

Normally, the `type` key of the BusEvent base-class is auto generated as `this.constructor.name`, which will contain the name of the class extending the BusEvent base-class.
This `type` key is used to match the event listeners with the events on the bus.
However, if you have two classes called the same name, this will collide.
To avoid this, you can override the `type` key in your event class with a custom string like this:

```ts
export class ExplicitTypeEvent extends BusEvent<void> {
	override type = 'my-explicit-event-type';
}
```

## Todos in this Repo

1. Add test for event-bus.rxjs.ts
2. Add Code from event-bus-nx package for rx version (esp. EventBus Callback Group)
3. Rewrite tests for deno
4. Check if anything still works

## Considerations

## Switching from rxjs to evt

- pro: no rxjs dependency
- contra: weird evt dependency typings (cross-compiled to deno from node via Denoify)
- steps:
  1. Add Evt as dependency in importMap
  2. Rewrite rxjs usages to evt

## Switchting to standard Webstreams

- pro: standardised spec
- contra: more difficult to have one stream be sent to mutliple listeners and correctly closing all of them

## Repo Log

### 2022-11-14

- Compilation for npm works now with dnt! https://github.com/denoland/dnt
- Setup deployment to deno.land/x & npmjs.org

### 2022-09-05

- Templated from https://github.com/codemonument/deno-module-template/commit/beb8dab612b9c71a7772064353fcd5e2ca9ecd85

# Event Bus Core

Event Bus Core is a library for creating event buses in Node.js and Deno. Based
on RXJS, with nicely typed event classes.

Published to (click badge to view):
[![JSR](https://jsr.io/badges/@codemonument/event-bus-core)](https://jsr.io/@codemonument/event-bus-core)

Legacy Publishes:

- https://deno.land/x/event_bus_core (last version published: 1.0.2)
- npm: @codemonument/event-bus-core (cross-compiled with dnt, last version
  published: 1.0.2)

=> Use JSR for latest version!

## How to Install

- see: https://jsr.io/@codemonument/event-bus-core
- on the right side: select your package manager and copy the install command

For example, in Node.js:

```bash
npx jsr add @codemonument/event-bus-core

# with version
npx jsr add @codemonument/event-bus-core@1.0.3
```

For example, in Deno:

```bash
deno add jsr:@codemonument/event-bus-core

# with version
deno add jsr:@codemonument/event-bus-core@1.0.3
```

## How to Import (in Deno, Node and Bun)

```ts
import { EventBusRxJS as EventBus } from "@codemonument/event-bus-core";
```

## Usage

```ts
import { EventBusRxJS as EventBus } from "@codemonument/event-bus-core";

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
bus.emit(new EventWithPayload({ value: 10 }));

// Clean up your rxjs subscriptions!
sub1.unsubscribe();
sub2.unsubscribe();
```

## CAUTION: Branding BusEvents

NOTE: If you have two or more events with the same payload type, YOU SHOULD
BRAND THEM! This avoids incomplete IDE type checks and runtime errors due to the
type system not being able to warn you in all cases!

If you want to distinguish between two events with the same payload type, you
can use a brand. This is important for IDE Autocompletion, but (technically)
does not affect the runtime behavior (as long as you don't make errors due to
unbranded events). For example, if you have two event classes with a different
name but the same payload type, you can create the following situation:

```ts
class MyEvent extends BusEvent<void> {}
class MyOtherEvent extends BusEvent<void> {}

// This should restrict the EventBus to only be able to emit or listen to "MyEvent" instances
const ebus = new EventBus<MyEvent>();

ebus.on$(MyOtherEvent).subscribe(() => {
  // This will not be called, since MyOtherEvent is not emitted on the bus,
  // but TS allows you to pass it to on$, since MyEvent and MyOtherEvent both extend BusEvent<void>
});

ebus.emit(new MyEvent());
```

This does not happen when using branded events:

```ts
class MyEvent extends BusEvent<void, "MyEvent"> {}
class MyOtherEvent extends BusEvent<void, "MyOtherEvent"> {}

// This should restrict the EventBus to only be able to emit or listen to "MyEvent" instances
const ebus = new EventBus<MyEvent>();

// ! => this will now throw a type error, since MyOtherEvent is not in the allowed events
// and MyEvent and MyOtherEvent are different types due to the branding
ebus.on$(MyOtherEvent).subscribe(() => {});
```

## Advanced Usages

You can subscribe to the underlying RxJS Observable of this event bus, called
bus.eventStream$.
This exposes the raw events to you.
Normally you don't need this and it's better to use the bus.on$ method which
filters to a specific event.

```ts
bus.eventStream$.subscribe((event: unknown) => {
  console.log(`Received Event: `, event);
});
```

Normally, the `type` key of the BusEvent base-class is auto generated as
`this.constructor.name`, which will contain the name of the class extending the
BusEvent base-class. This `type` key is used to match the event listeners with
the events on the bus. However, if you have two classes called the same name,
this will collide. To avoid this, you can override the `type` key in your event
class with a custom string like this:

```ts
export class ExplicitTypeEvent extends BusEvent<void> {
  override type = "my-explicit-event-type";
}
```

## Todos in this Repo

1. Add test for event-bus.rxjs.ts
2. Add Code from event-bus-nx package for rx version (esp. EventBus Callback
   Group)
3. Rewrite tests for deno
4. Check if anything still works

## Considerations

## Switchting to standard Webstreams

- pro: standardised spec
- contra: more difficult to have one stream be sent to mutliple listeners and
  correctly closing all of them

---

# Repo Log

## 2025-07-27

- add deployment to jsr.io and optimize readme, examples, tests and playgrounds

## 2022-11-14

- Compilation for npm works now with dnt! https://github.com/denoland/dnt
- Setup deployment to deno.land/x & npmjs.org

## 2022-09-05

- Templated from
  https://github.com/codemonument/deno-module-template/commit/beb8dab612b9c71a7772064353fcd5e2ca9ecd85

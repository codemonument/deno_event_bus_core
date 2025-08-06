import { expectAssignable, expectNotAssignable, expectType } from "tsd";
import { assert, assertStrictEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import type { SimpleNewable } from "@/lib/event-bus/simple-newable.type.ts";
import type {
  BusEvent,
  EventualPayload,
  NewableBusEvent,
  payloadOf,
} from "@mod";
import {
  type DemoPayload,
  EventWithPayload,
  ExplicitTypeEvent,
  ImplicitTypeEvent,
  PlainEvent,
} from "@testdata/events.mock.ts";

describe(`EventualPayload`, () => {
  it(`should not accept assigning undefined to EventualPayload<DemoPayload>`, () => {
    expectNotAssignable<EventualPayload<DemoPayload>>(undefined);
  });
  it(`should accept assigning undefined to EventualPayload<void>`, () => {
    expectAssignable<EventualPayload<void>>(undefined);
  });
  it(`should not accept assigning some object to EventualPayload<void>`, () => {
    expectNotAssignable<EventualPayload<void>>({});
  });
});

describe(`bus-event.type`, () => {
  /**
   * IF PlainEvent extends from BusEvent<void>
   * BusEvent allows the user of PlainEvent
   * to *not* provide a param to the constructor when instantiating it.
   */
  it(`should allow event construction without payload (=void)`, () => {
    const event = new PlainEvent();
    assert(event);

    // Type Expectations
    expectType<void>(event.payload);
    expectType<string>(event.type);
    expectNotAssignable<undefined>(event.payload);
  });

  /**
   * IF EventWithPayload extends BusEvent with any other type than void (let's call it T),
   * the user of EventWithPayload is forced to provide a value of type T.
   */
  it(`should allow event construction with payload (=any)`, () => {
    const payload: DemoPayload = { name: "Bob" };
    // Note: If you remove the param, typescript will complain,
    // that you need to provide a value for the payload!
    const event = new EventWithPayload(payload);
    assertStrictEquals(event.payload, payload);

    // Type Expectations
    expectType<DemoPayload>(event.payload);
  });

  it(`PlainEvent should be compareable with instanceof`, () => {
    const event = new PlainEvent();
    assert(event instanceof PlainEvent);
  });

  it(`EventWithPayload should be compareable with instanceof`, () => {
    const payload: DemoPayload = { name: "Bob" };
    const event = new EventWithPayload(payload);
    assert(event instanceof EventWithPayload);
  });

  /**
   * Maybe the NewableXXX Stuff is not testable in this manner (since plain instanceof works directly)
   * Maybe test this Newable behavior in event-bus.spec
   *
   * bjesuiter 2022-07-25: I deem the NewableXXX stuff not testable here.
   * Since NewableBusEvent interface does only testify, that a certain type can be constructed using a specific constructor,
   * it has no value representation and therefore can't be used in expectType<> generic param.
   *
   * I also failed trying to indirectly test the correctness of the NewableBusEvent Interface by using it
   * as a param to a mocked `createEvent` Function, bc. in the end, the type of payload inside PlainEvent and payload inside BusEvent
   * do not match. This may be solvable, but the construct seems too complicated.
   *
   * In the end, the event bus should work and should be able to filter events on the eventStream
   * based on the ClassObject passed to the eventBus.on$ filter function.
   * If this works in the test of event-bus.ts, I deem that it satisfies the validity of this NewableBusEvent Interface,
   * bc. the NewableBusEvent Interface has only the goal of allowing the `instanceof` check in <EventBus>.on$().
   */
  it(`PlainEvent should be assignable to SimpleNewable<PlainEvent>`, () => {
    expectAssignable<SimpleNewable<PlainEvent>>(PlainEvent);
  });

  it(`PlainEvent should be assignable to NewableBusEvent<PlainEvent, void>`, () => {
    // Working with SimpleNewable in event-bus.ts for now, until payload typing errors are fixed!
    // CAUTION: VERY COMPLICATED TYPING!
    expectType<NewableBusEvent<PlainEvent>>(PlainEvent);
  });

  it(`EventWithPayload should be assignable to NewableBusEvent<EventWithPayload, DemoPayloadType>`, () => {
    const demoPayload = { name: "Bob" };
    const demoEvent = new EventWithPayload(demoPayload);

    // Ensures that demoEvent is a valid BusEvent
    expectType<BusEvent<DemoPayload>>(demoEvent);

    // Ensures, that the extracted generic type argument of EventWithPayload is the same as the type of demoPayload variable
    expectType<payloadOf<EventWithPayload>>(demoPayload);

    // Ensures, that EventWithPayload, which consists of `extends BusEvent<DemoPayloadType>`,
    // is the same as NewableBusEvent<EventWithPayload>
    expectType<NewableBusEvent<EventWithPayload>>(EventWithPayload);
  });

  it(`ImplicitTypeEvent should have a 'type' field with 'ImplicitTypeEvent'`, () => {
    const event = new ImplicitTypeEvent();
    assert(event.type === "ImplicitTypeEvent");
  });

  it(`ExplicitTypeEvent should have an overriden 'type' field with 'my-explicit-event-type'`, () => {
    const event = new ExplicitTypeEvent();
    assert(event.type === "my-explicit-event-type");
  });
});

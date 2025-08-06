import {
  BusEvent,
  EventBusRxJS as EventBus,
  type EventualPayload,
  type payloadOf,
} from "@mod";
import { assertEquals, assertExists, assertStrictEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import pDefer from "p-defer";
import { type Observable, take } from "rxjs";
import {
  expectAssignable,
  expectNotAssignable,
  expectNotType,
  expectType,
} from "tsd";

import {
  type DemoPayload,
  EventWithPayload,
  PlainEvent,
} from "@testdata/events.mock.ts";

// --- TESTS FOR EVENT BUS WITH ANY "BusEvent<unknown>" ALLOWED ---
describe("EventBus", () => {
  it("should instantiate EventBus", () => {
    assertExists(new EventBus());
  });

  it("should have BusEvent<unknown> as default TAllowedEvents type", () => {
    const ebus = new EventBus();
    const eventStream = ebus.eventStreamAsObservable();
    expectType<Observable<BusEvent<unknown>>>(eventStream);
  });

  it("should send and receive (paramless) demo event", async () => {
    const done = pDefer();
    const ebus = new EventBus();
    const demoEventInstance = new PlainEvent();

    const listener = ebus.on$(PlainEvent);
    expectType<Observable<void>>(listener);
    expectType<Observable<EventualPayload<payloadOf<PlainEvent>>>>(listener);

    listener.pipe(take(1)).subscribe((received) => {
      // Expect received event to be undefined, since this DemoEvent does not have a payload
      // Note, that the return type of on$ is correctly typed to Observable<void> in this case!
      assertEquals(received, undefined);
      done.resolve();
    });

    ebus.emit(demoEventInstance);
    await done.promise;
  });

  it("should send and receive EventWithPayload", async () => {
    const done = pDefer();
    const ebus = new EventBus();
    const payload: DemoPayload = { name: "Bob" };
    const demoEventInstance = new EventWithPayload(payload);

    ebus
      .on$(EventWithPayload)
      .pipe(take(1))
      .subscribe((received) => {
        // This checks, whether the type of 'event' variable is correctly coerced by TS
        // Since type information is removed from resulting js,
        // we can only check the contents of event, not the shape agains the intergace DemoPayload
        assertStrictEquals(received.name, "Bob");
        assertEquals(received, payload);
        done.resolve();
      });

    ebus.emit(demoEventInstance);
    await done.promise;
  });

  it("should send and receive events as async iterable", async () => {
    const ebus = new EventBus();
    const demoEventInstance = new PlainEvent();

    // Emit events after some time to test async iterable
    setTimeout(() => {
      ebus.emit(demoEventInstance);
      ebus.emit(demoEventInstance);
      ebus.emit(demoEventInstance);
    }, 100);

    const expectedEventCount = 3;
    let currentEventCount = 0;

    const asyncIterable = ebus.eventStreamAsAsyncIterable();
    const receivedEvents: unknown[] = [];

    for await (const event of asyncIterable) {
      receivedEvents.push(event);
      currentEventCount++;
      if (currentEventCount === expectedEventCount) {
        break;
      }
    }

    assertStrictEquals(receivedEvents.length, 3);
    assertStrictEquals(receivedEvents[0], demoEventInstance);
    assertStrictEquals(receivedEvents[1], demoEventInstance);
    assertStrictEquals(receivedEvents[2], demoEventInstance);
  });
});

// --- TESTS FOR EVENT BUS WITH SPECIFIED ALLOWED EVENTS ---
describe("EventBus with specified allowed events", () => {
  it("should instantiate EventBus with specified allowed events", () => {
    const ebus = new EventBus<PlainEvent | EventWithPayload>();
    assertExists(ebus);
    const eventStream = ebus.eventStreamAsObservable();
    expectType<Observable<PlainEvent | EventWithPayload>>(eventStream);
  });

  it("should send and receive events of specified allowed events", async () => {
    const done = pDefer();
    const ebus = new EventBus<PlainEvent | EventWithPayload>();
    const payload: DemoPayload = { name: "Bob" };

    ebus.on$(EventWithPayload).pipe(take(1)).subscribe((received) => {
      assertStrictEquals(received.name, "Bob");
      assertEquals(received, payload);
      done.resolve();
    });

    ebus.emit(new EventWithPayload(payload));
    await done.promise;
  });

  it("should not allow listening to events that are not specified in TAllowedEvents", () => {
    const ebus = new EventBus<PlainEvent | EventWithPayload>();
    class _UnallowedEvent extends BusEvent<void> {}

    // The event stream observable should only contain allowed event types
    expectNotType<Observable<_UnallowedEvent>>(ebus.eventStreamAsObservable());
    expectType<Observable<PlainEvent | EventWithPayload>>(
      ebus.eventStreamAsObservable(),
    );

    // But we should be able to listen to allowed events
    expectType<Observable<void>>(ebus.on$(PlainEvent));
    expectType<Observable<DemoPayload>>(ebus.on$(EventWithPayload));
  });

  it("should only accept 'PlainEvent' in on$ method, not 'EventWithPayload'", () => {
    // Create an EventBus that only allows PlainEvent
    const restrictedBus = new EventBus<PlainEvent>();

    // This should work - PlainEvent is allowed
    expectType<Observable<void>>(restrictedBus.on$(PlainEvent));

    // Tests:
    // restrictedBus.on$(EventWithPayload);
    // (uncomment the line above to test manually)
    expectNotAssignable<Parameters<typeof restrictedBus.on$>[0]>(
      EventWithPayload,
    );
    expectAssignable<Parameters<typeof restrictedBus.on$>[0]>(
      PlainEvent,
    );
    // This is the check to test whether the test itself is working.
    // If you uncomment this, the deno linter will complain.
    // expectAssignable<Parameters<typeof restrictedBus.on$>[0]>(
    //   EventWithPayload,
    // );

    class _UnallowedStringEvent extends BusEvent<string> {}

    // Tests:
    // restrictedBus.on$(_UnallowedStringEvent);
    // (uncomment the line above to test manually)

    // restrictedBus.on$(_UnallowedStringEvent); // Error: UnallowedStringEvent is not assignable to PlainEvent

    // The event stream should only contain PlainEvent
    expectType<Observable<PlainEvent>>(restrictedBus.eventStreamAsObservable());
    expectNotType<Observable<EventWithPayload>>(
      restrictedBus.eventStreamAsObservable(),
    );
  });

  it("should not accept BusEvent<string> in on$ method when TAllowedEvents is PlainEvent", () => {
    const restrictedBus = new EventBus<PlainEvent>();

    class _UnallowedStringEvent extends BusEvent<string> {}

    expectNotAssignable<Parameters<typeof restrictedBus.on$>[0]>(
      _UnallowedStringEvent,
    );
    // Anti-Check to validate this test itself
    // If you uncomment this, the deno linter will complain.
    // expectAssignable<Parameters<typeof restrictedBus.on$>[0]>(
    //   _UnallowedStringEvent,
    // );
  });

  // WIP
  it("should not accept other payload-less events than 'PlainEvent'", () => {
    const restrictedBus = new EventBus<PlainEvent>();

    class _UnallowedPlainEvent extends BusEvent<void> {}

    expectNotAssignable<Parameters<typeof restrictedBus.on$>[0]>(
      _UnallowedPlainEvent,
    );

    // Anti-Check to validate this test itself
    // If you uncomment this, the deno linter will complain.
    expectAssignable<Parameters<typeof restrictedBus.on$>[0]>(
      _UnallowedPlainEvent,
    );
  });
});

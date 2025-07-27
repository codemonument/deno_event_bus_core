import {
  EventBusRxJS as EventBus,
  type EventualPayload,
  type payloadOf,
} from "@mod";
import { assertEquals, assertExists, assertStrictEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import pDefer from "p-defer";
import { type Observable, take } from "rxjs";
import { expectType } from "tsd";

import {
  type DemoPayload,
  EventWithPayload,
  PlainEvent,
} from "@testdata/events.mock.ts";

describe("EventBus", () => {
  it("should instantiate EventBus", () => {
    assertExists(new EventBus());
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
});

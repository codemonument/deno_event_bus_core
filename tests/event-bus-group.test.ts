import { EventBusGroup, EventBusRxJs as EventBus } from "@mod";
import { EventWithPayload, PlainEvent } from "@testdata/events.mock.ts";
import { assertEquals, assertExists, describe, it } from "@deps/std_testing.ts";
import { firstValueFrom } from "../deps/npm_rxjs.ts";
import { z } from "zod";
import pDefer from "p-defer";

describe(`event-bus-group.test`, () => {
  it(`should be constructed`, () => {
    const eBus = new EventBus();
    const eGroup = new EventBusGroup(eBus);
    assertExists(eGroup);
  });

  it(`should receive PlainEvent in callback (test event registration)`, async () => {
    const eBus = new EventBus();
    const eGroup = new EventBusGroup(eBus);
    const plainEventReceived = pDefer();

    eGroup.on(PlainEvent, plainEventReceived.resolve);

    eBus.emit(new PlainEvent());
    await plainEventReceived.promise;
  });

  it(`should receive DemoPayload in callback (test EventWithPayload)`, () => {
    const eBus = new EventBus();
    const eGroup = new EventBusGroup(eBus);
    const demoEvent = new EventWithPayload({ name: "Bob" });

    eGroup.on(EventWithPayload, ({ name }) => {
      assertEquals(name, demoEvent.payload.name);
    });

    eBus.emit(demoEvent);
  });

  it(`should unsubscribe all event callbacks`, () => {
    const eBus = new EventBus();
    const eGroup = new EventBusGroup(eBus);

    eGroup.on(PlainEvent, () => {
      console.log("Received Plain Event");
    });

    eGroup.on(EventWithPayload, (payload) => {
      console.log("Received Event with Payload", payload);
    });

    // this should not throw - test fails if it does throw
    eGroup.unsubscribeAll();
  });

  /**
   * Note: Cannot catch error like this, because the default error callback will not be thrown in the eBus.emit callstack,
   * but in the callstack triggering the callback in eGroup.on().
   *
   * => This can be avoided by the user if he
   * - either passes a global error callback when instantiating new EventBusGroup,
   * - or adding an errorCallback directly inside the eGroup.on() function.
   */
  // it(`should trigger default error callback`, (done) => {
  //   const eBus = new EventBus();
  //   const eGroup = new EventBusGroup(eBus);

  //   eGroup.on(PlainEvent, () => {
  //     throw new Error(`Fake error in callback!`);
  //   });

  //   try {
  //     eBus.emit(new PlainEvent());
  //   } catch (error) {
  //     expect(error).toBeDefined();
  //     done();
  //   }
  // });

  it(`should trigger custom error callback from EventBusGroup constructor`, async () => {
    const eBus = new EventBus();
    // Makes EventBusGroup errorhandler observable via promise
    const deferredErrorHandler = pDefer();
    const eGroup = new EventBusGroup(eBus, deferredErrorHandler.resolve);

    eGroup.on(PlainEvent, () => {
      throw new Error(`Fake error in callback!`);
    });

    eBus.emit(new PlainEvent());

    const error = await deferredErrorHandler.promise;
    const parsedError = z.instanceof(Error).parse(error);
    assertExists(parsedError);
    assertEquals(parsedError.message, `Fake error in callback!`);

    // not required in this test, but best practice
    eGroup.unsubscribeAll();
  });

  it(`should trigger custom error callback from eGroup.on()`, async () => {
    const eBus = new EventBus();
    const eGroup = new EventBusGroup(eBus);
    const deferredErrorHandler = pDefer();

    eGroup.on(PlainEvent, () => {
      throw new Error(`Fake error in callback!`);
    }, {
      errorCallback: deferredErrorHandler.resolve,
    });

    eBus.emit(new PlainEvent());

    const error = await deferredErrorHandler.promise;
    const parsedError = z.instanceof(Error).parse(error);
    assertExists(parsedError);
    assertEquals(parsedError.message, `Fake error in callback!`);

    // not required in this test, but best practice
    eGroup.unsubscribeAll();
  });

  it(`should allow overwriting error callback with setDefaultErrorCallback`, async () => {
    const eBus = new EventBus();
    const eGroup = new EventBusGroup(eBus);
    const deferredErrorHandler = pDefer();

    eGroup.setDefaultErrorCallback(deferredErrorHandler.resolve);

    eGroup.on(PlainEvent, () => {
      throw new Error(`Fake error in callback!`);
    });

    eBus.emit(new PlainEvent());

    const error = await deferredErrorHandler.promise;
    const parsedError = z.instanceof(Error).parse(error);
    assertExists(parsedError);
    assertEquals(parsedError.message, `Fake error in callback!`);

    // not required in this test, but best practice
    eGroup.unsubscribeAll();
  });
});

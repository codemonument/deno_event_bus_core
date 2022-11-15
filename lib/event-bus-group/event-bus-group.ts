import { Subscription } from "../../deps/npm_rxjs.ts";
import { EventBusRxJS as EventBus } from "../event-bus/event-bus.rxjs.ts";
import {
  BusEvent,
  EventualPayload,
  NewableBusEvent,
  payloadOf,
} from "../event-bus/bus-event.base.ts";
import {
  defaultErrorCallback,
  EventGroupCallback,
  EventGroupErrorCallback,
} from "./event-group-callback.type.ts";

/**
 * An EventBusGroup allows for using the event bus with a Callback-Interface.
 * The this.on() method allows to register a callback to a certain event type.
 * The rxjs subscription on the EventBus, which is made during the callback registration,
 * will be stored inside the EventBusGroup.
 * This allows for unsubscribing all callback subscriptions at once.
 */
export class EventBusGroup {
  private subscriptions: Subscription[] = [];

  constructor(
    private bus: EventBus,
    private eventGroupErrorCallback: EventGroupErrorCallback =
      defaultErrorCallback,
  ) {}

  /**
   * Replaces the default error callback function with a custom one
   */
  public setDefaultErrorCallback(callback: EventGroupErrorCallback): void {
    this.eventGroupErrorCallback = callback;
  }

  /**
   * I subscribe to the message bus, but only invoke the callback when the event is
   * of the given newable type (ie, it's a Class definition, not an instance).
   * --
   * NOTE: The NewableBusEvent<E, P> enables internal type inference.
   *
   * @param typeFilter
   * @param callback
   * @returns
   */
  public on<E extends BusEvent<payloadOf<E>>>(
    typeFilter: NewableBusEvent<E>,
    callback: EventGroupCallback<payloadOf<E>>,
    options?: {
      callbackContext?: unknown;
      errorCallback?: EventGroupErrorCallback;
    },
  ): void {
    const callCtx = options?.callbackContext ?? null;
    const next = (eventPayload: EventualPayload<payloadOf<E>>) => {
      try {
        callback.call(callCtx, eventPayload);
      } catch (error) {
        if (options?.errorCallback) {
          options.errorCallback.call(callCtx, error);
          return;
        }

        this.eventGroupErrorCallback.call(callCtx, error);
      }
    };

    const sub = this.bus.on$(typeFilter).subscribe({
      next,
      error: (error: unknown) =>
        this.eventGroupErrorCallback.call(callCtx, error),
    });

    this.subscriptions.push(sub);
  }

  public unsubscribeAll() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}

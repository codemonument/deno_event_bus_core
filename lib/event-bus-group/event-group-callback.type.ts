import { EventualPayload } from "../event-bus/bus-event.base.ts";

/**
 * Is called 'CallbackFunction' in original article
 */
export type EventGroupCallback<P> = (eventPayload: EventualPayload<P>) => void;

/**
 * Is called 'CallbackFunction' in original article
 */
export type EventGroupErrorCallback<T = unknown> = (error: T) => void;

export function defaultErrorCallback(error: unknown) {
  throw new Error(
    `[event-bus-group]: An Error was caught while calling a listener callback.
  This is the default ErrorCallbackFunction, which can be replaced by calling setDefaultErrorCallback() on the event-bus-group constructor,
  or passing the optional 'errorCallback' parameter when calling on(EventType, ...) function.

  Error Details:

  ${JSON.stringify(error)}
  `,
  );
}

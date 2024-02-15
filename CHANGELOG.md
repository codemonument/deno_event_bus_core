# Changelog

## 1.0.0.beta.7 - 2024-02-15

- Upgrade dnt compiler to 0.40.0
- Upgrade zod to 3.22.4
- Upgrade npm:tsd for type testing to 0.30.4
- upgrade std lib to 0.215.0

## 1.0.0.beta.6 - 2022-11-16

- Add new class EventBusGroup. Allows the user to interact with the event bus in a callback-style way.
  Records all created subscriptions to the filtered rxjs event streams and is able to unregister them all at once.
- Add tests for EventBusRxJS and EventBusGroup
- **Breaking Change**: Rename EventBusRxJs to EventBusRxJS
- Export EventBusRxJS as "default" EventBus identifier

## 1.0.0-beta.5 - 2022-11-15

- Allow Event Classes extending BaseEvent<T> to not declare the `type` key.
  Will be set to this.constructor.name per default, which evaluates to the classname of the Event Class extending BaseEvent<T> automatically.
- Re-label possibility to override the `type` property of Event Classes as explicit definition of this type key.

## 1.0.0-beta.4 - 2022-11-14

- Adjusted readme to include usage instructions
- Update example in ./examples/main.ts

## 1.0.0-beta.3 - 2022-11-14

- compiled from deno at https://github.com/codemonument/event-bus-core
- should work with rxjs right now

## 1.0.0-beta.2

- on npm

## 1.0.0-beta.1

- on npm

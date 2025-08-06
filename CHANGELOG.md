# Changelog

## 1.2.0 - 2025-08-06

- re-release of 1.1.0, but with a fix for the type issues
- add branding support to BusEvent
- add explanations for the branding support in the readme

## 1.1.0 - 2025-08-06 - not published due to slow type issues

- add eventStreamAsAsyncIterable() to EventBusRxJS
- remove abandoned evt event emitter (never worked)
- add TAllowedEvents type parameter to EventBusRxJS, to restrict the events that
  can be emitted and received
- add tests for this new TAllowedEvents type parameter

## 1.0.5 - 2025-07-27

- avoid slow types

## 1.0.4 - 2025-07-27

- remove dnt build script
- migrate from ./deps to jsr imports

## 1.0.3 - 2025-07-27

- fix link to jsr in badge in readme
- update install instructions in readme
- rename Readme.md to README.md, so that JSR finds it

## 1.0.2 - 2025-07-27

- add jsr badge to readme
- dropping deno.land/x deployment

## 1.0.1 - 2025-07-27

- first release on jsr

## 1.0.0 - 2024-03-11

- Upgrade rxjs to 7.8.1 and added it to matchers in dnt-build to be able to have
  it as peer dependency in the resulting package.json
- Consider this the first stable version, I'm using the beta versions for a long
  time now!

## 1.0.0.beta.7 - 2024-02-15

- Upgrade dnt compiler to 0.40.0
- Upgrade zod to 3.22.4
- Upgrade npm:tsd for type testing to 0.30.4
- upgrade std lib to 0.215.0

## 1.0.0.beta.6 - 2022-11-16

- Add new class EventBusGroup. Allows the user to interact with the event bus in
  a callback-style way. Records all created subscriptions to the filtered rxjs
  event streams and is able to unregister them all at once.
- Add tests for EventBusRxJS and EventBusGroup
- **Breaking Change**: Rename EventBusRxJs to EventBusRxJS
- Export EventBusRxJS as "default" EventBus identifier

## 1.0.0-beta.5 - 2022-11-15

- Allow Event Classes extending BaseEvent<T> to not declare the `type` key. Will
  be set to this.constructor.name per default, which evaluates to the classname
  of the Event Class extending BaseEvent<T> automatically.
- Re-label possibility to override the `type` property of Event Classes as
  explicit definition of this type key.

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

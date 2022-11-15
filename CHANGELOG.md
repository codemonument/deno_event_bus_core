# Changelog 

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
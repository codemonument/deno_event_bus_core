// Note: Re-Exporting npm: specifiers seems not to work in deno 1.25.3 yet.
// TS complains about non-exported members which i know are there

// TODO: When working: Replace direct import in event-bus.ts with 'rxjs' bare import via importMap

export * from "npm:rxjs@7.5.7";
// export * from "https://cdn.skypack.dev/rxjs@7.5.7?dts";

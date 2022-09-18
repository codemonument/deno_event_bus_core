// Note: Re-Exporting npm: specifiers seems not to work in deno 1.25.3 yet.
// TS complains about non-exported members which i know are there

// TODO: When working:  Replace direct import in bus-event.base.test.ts with 'tsd' bare import via importMap

export * from "npm:tsd@0.24.1";

// export * from "https://cdn.skypack.dev/tsd@0.24.1?dts";
// export * from "https://cdn.skypack.dev/-/tsd@v0.24.1-Zs6K9vV62dJrKk0WNWvh/dist=es2019,mode=imports/optimized/tsd.js";

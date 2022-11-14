// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.31.0/mod.ts";
import { VERSION } from "@version";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },

  // Don't emit tests, bc. the import_map.json imports confuse npm due to dnt not resolving them! :/
  test: false,
  package: {
    // package.json properties
    // TODO: package name is not final!
    name: "@codemonument/event-bus-core",
    version: VERSION,
    description: "A typescript event bus with fully typed events",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/codemonument/event-bus-core.git",
    },
    bugs: {
      url: "https://github.com/codemonument/event-bus-core/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");

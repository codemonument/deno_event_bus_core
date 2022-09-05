import {} from "/mod.ts";
import { log } from "std_log";
import { VERSION } from "/version.ts";

try {
  log.info(`Module Version (version.ts): ${VERSION}`);
} catch (error) {
  console.error(error);
  Deno.exit();
}

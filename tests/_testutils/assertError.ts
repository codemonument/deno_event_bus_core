import { z } from "zod";
import { assertEquals, assertExists } from "@std/assert";

export function assertError(error: unknown, message: string) {
  const parsedError = z.instanceof(Error).parse(error);
  assertExists(parsedError);
  assertEquals(parsedError.message, message);
}

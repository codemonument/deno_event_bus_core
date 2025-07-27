/**
 * The `instanceof` operator can only be used when the right-hand side of this expression is assignable to Function
 * (e.g. for a class: must be constructable via `new` === 'newable')
 * This type ensures the compiler that
 * - the type T it gets is actually a class which can be constructed
 *
 * Note: It does NOT ensure anything about the arguments of this class!
 */
export interface SimpleNewable<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

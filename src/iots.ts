import * as t from 'io-ts';
import { either } from 'fp-ts/lib/Either';

export interface StringEnum {
  [key: string]: string;
}

export const stringEnum = <T extends StringEnum>(enumObj: T, typeName: string) => new t.Type<T[keyof T], string>(
  typeName,
  (u): u is T[keyof T] => t.string.is(u) && Object.values(enumObj).includes(u),
  (u, c) => either.chain(
    t.string.validate(u, c),
    s => (Object.values(enumObj).includes(s) ? t.success(s as unknown as T[keyof T]) : t.failure(s, c)),
  ),
  a => a as unknown as string,
);

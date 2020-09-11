import { either, isLeft } from 'fp-ts/lib/Either';
import { failure, Type, string, success, AnyProps, TypeOf, Props, OutputOf, UnknownRecord, Errors, appendContext, Any, identity, failures, nullType } from 'io-ts';

const pushAll = <A>(xs: Array<A>, ys: Array<A>): void => {
  const l = ys.length
  for (let i = 0; i < l; i++) {
    xs.push(ys[i])
  }
}

const useIdentity = (codecs: Array<Any>): boolean => {
  for (let i = 0; i < codecs.length; i++) {
    if (codecs[i].encode !== identity) {
      return false
    }
  }
  return true
}

export interface StringEnum {
  [key: string]: string;
}

export const stringEnum = <T extends StringEnum>(enumObj: T, typeName: string) => new Type<T[keyof T], string>(
  typeName,
  (u): u is T[keyof T] => string.is(u) && Object.values(enumObj).includes(u),
  (u, c) => either.chain(
    string.validate(u, c),
    s => (Object.values(enumObj).includes(s) ? success(s as unknown as T[keyof T]) : failure(s, c)),
  ),
  a => a as unknown as string,
);

export class PartialNullType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'PartialNullType' = 'PartialNullType'
  constructor(
    name: string,
    is: PartialNullType<P, A, O, I>['is'],
    validate: PartialNullType<P, A, O, I>['validate'],
    encode: PartialNullType<P, A, O, I>['encode'],
    readonly props: P
  ) {
    super(name, is, validate, encode)
  }
}

export type TypeOfPartialOrNullProps<P extends AnyProps> = { [K in keyof P]?: TypeOf<P[K]> | null }
export type OutputOfPartialOrNullProps<P extends AnyProps> = { [K in keyof P]?: OutputOf<P[K]> | null }

export interface PartialOrNullC<P extends Props>
  extends PartialNullType<P, TypeOfPartialOrNullProps<P>, OutputOfPartialOrNullProps<P>, unknown> { }

export const partialOrNull = <P extends Props>(
  props: P,
  name: string,
): PartialOrNullC<P> => {
  const keys = Object.keys(props)
  const types = keys.map((key) => props[key])
  const len = keys.length
  return new PartialNullType(
    name,
    (u): u is { [K in keyof P]?: TypeOf<P[K]> | null } => {
      if (UnknownRecord.is(u)) {
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          const uk = u[k]
          if ((uk === undefined || uk !== null) && !props[k].is(uk)) {
            return false
          }
        }
        return true
      }
      return false
    },
    (u, c) => {
      const e = UnknownRecord.validate(u, c)
      if (isLeft(e)) {
        return e
      }
      const o = e.right
      let a = o
      const errors: Errors = []
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        const ak = a[k]
        const type = props[k]
        const result = type.validate(ak, appendContext(c, k, type, ak))
        if (isLeft(result)) {
          if (ak !== undefined && ak !== null) {
            pushAll(errors, result.left)
          }
        } else {
          const vak = result.right
          if (vak !== ak) {
            if (a === o) {
              a = { ...o }
            }
            a[k] = vak
          }
        }
      }
      return errors.length > 0 ? failures(errors) : success(a as any)
    },
    useIdentity(types)
      ? identity
      : (a) => {
        const s: { [key: string]: any } = { ...a }
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          const ak = a[k]
          if (ak !== undefined && ak !== null) {
            s[k] = types[i].encode(ak)
          }
        }
        return s as any
      },
    props
  )
}

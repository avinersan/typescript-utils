

/**
 * @fileoverview A module containing utility types similar to
 * https://www.typescriptlang.org/docs/handbook/utility-types.html.
 */

/**
 * Removes a prefix from a string literal type.
 */
export type RemovePrefix<Pre extends string, S extends string> =
    S extends `${Pre}${infer Rest}` ? Rest : S;

/**
 * Transforms a case insensitive snake string literal to camel case e.g.
 * sNaKe_cAsE to snakeCase.
 */
export type SnakeToCamelCase<S extends string> =
    S extends `${infer T}_${infer U}` ?
    `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}` :
    Lowercase<S>;

/**
 * Transforms an enum proto generated string literal like 'EXPERIMENT_TEST_ONE'
 * to 'experimentTestOne' or given prefix 'EXPERIMENT_' directly to 'testOne'.
 */
export type ProtoToUiEnumKey<ProtoEnumKey extends string,
                                                  Prefix extends string = ''> =
    SnakeToCamelCase<RemovePrefix<Prefix, ProtoEnumKey>>;
export type X = ProtoToUiEnumKey<'ONE'|'TWO'>;

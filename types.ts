export type OmitStrict<T, K extends keyof T> = Omit<T, K>;

export type PickByType<T, Condition> = Pick<T, { [K in keyof T]: T[K] extends Condition ? K : never }[keyof T]>;

export type KeyOfType<T, Condition> = keyof PickByType<T, Condition>;

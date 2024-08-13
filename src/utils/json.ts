type Primitive = number | string | boolean | null | undefined | symbol | bigint;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P] extends Primitive
    ? T[P]
    : never;
};

export function deepJsonCopy<T>(obj: T): DeepPartial<T> {
  return JSON.parse(JSON.stringify(obj));
}
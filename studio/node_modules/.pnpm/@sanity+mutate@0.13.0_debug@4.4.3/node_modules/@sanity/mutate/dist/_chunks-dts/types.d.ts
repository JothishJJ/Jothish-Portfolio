type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type NormalizeReadOnlyArray<T> = T extends readonly [infer NP, ...infer Rest] ? [NP, ...Rest] : T extends readonly (infer NP)[] ? NP[] : T;
type EmptyArray = never[] | readonly never[] | [] | readonly [];
type AnyArray<T = any> = T[] | readonly T[];
type ArrayLength<T extends AnyArray> = T extends never[] ? 0 : T['length'];
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Formats an intersection object type, so it outputs as `{"foo": 1, "bar": 1}` instead of `{"foo": 1} & {"bar": 2}``
 */
type Format<A> = A extends { [Key in keyof A]: A[Key] } ? { [Key in keyof A]: A[Key] } : A;
type Tuplify<T> = T extends readonly [infer NP, ...infer Rest] ? [NP, ...Rest] : T extends readonly (infer NP)[] ? NP[] : [T];
type KeyedPathElement = {
  _key: string;
};
type PropertyName = string;
type Index = number;
type PathElement = PropertyName | Index | KeyedPathElement;
type Path = PathElement[] | readonly PathElement[];
type ByIndex<P extends number, T extends AnyArray> = T[P];
type ElementType<T extends AnyArray> = T extends AnyArray<infer E> ? E : unknown;
type FindInArray<P extends KeyedPathElement | number, T extends AnyArray> = P extends KeyedPathElement ? FindBy<P, T> : P extends number ? ByIndex<P, T> : never;
type AnyEmptyArray = [] | readonly [];
type FindBy<P, T extends AnyArray> = T extends AnyEmptyArray ? undefined : T[0] extends P ? T[0] : T extends [any, ...infer Tail] | readonly [any, ...infer Tail] ? FindBy<P, Tail> : ElementType<T>;
type ParseError<T extends string = 'unknown'> = T & {
  error: true;
};
type SplitAll<S extends string, Char extends string> = S extends `${infer First}${Char}${infer Remainder}` ? [First, ...SplitAll<Remainder, Char>] : [S];
type Split<S extends string, Char extends string, IncludeSeparator extends boolean = false> = S extends `${infer First}${Char}${infer Remainder}` ? [First, `${IncludeSeparator extends true ? Char : ''}${Remainder}`] : [S];
type TrimLeft<Str extends string, Char extends string = ' '> = string extends Str ? Str : Str extends `${Char}${infer Trimmed}` ? TrimLeft<Trimmed, Char> : Str;
type TrimRight<Str extends string, Char extends string = ' '> = string extends Str ? Str : Str extends `${infer Trimmed}${Char}` ? TrimRight<Trimmed, Char> : Str;
type Trim<S extends string, Char extends string = ' '> = TrimRight<TrimLeft<S, Char>, Char>;
type ParseKVPair<S extends string> = Split<S, '=='> extends [`${infer LHS}`, `${infer RHS}`] ? ParseValue<Trim<RHS>> extends infer Res ? Res extends [null, infer Value] ? Ok<{ [P in Trim<LHS>]: Value }> : Err<ParseError<`Can't parse right hand side as a value in "${S}" (Invalid value ${RHS})`>> : never : Err<ParseError<`Can't parse key value pair from ${S}`>>;
type ParseObject<S extends string> = S extends `${infer Pair},${infer Remainder}` ? Trim<Remainder> extends '' ? Ok<Record<never, never>> : MergeInner<ParseKVPair<Pair>, ParseObject<Remainder>> : ParseKVPair<S>;
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type OnlyDigits<S> = S extends `${infer Head}${infer Tail}` ? Head extends Digit ? Tail extends '' ? true : OnlyDigits<Tail> extends true ? true : false : false : false;
type ParseNumber<S extends string> = S extends `${infer Head}${infer Tail}` ? Head extends '-' ? OnlyDigits<Tail> extends true ? Ok<ToNumber<S>> : Err<ParseError<`Invalid integer value "${S}"`>> : OnlyDigits<S> extends true ? Ok<ToNumber<S>> : Err<ParseError<`Invalid integer value "${S}"`>> : Err<ParseError<`Invalid integer value "${S}"`>>;
type ToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
type ParseValue<S extends string> = string extends S ? Err<ParseError<'ParseValue got generic string type'>> : S extends 'null' ? Ok<null> : S extends 'true' ? Ok<true> : S extends 'false' ? Ok<false> : S extends `"${infer Value}"` ? Ok<Value> : Try<ParseNumber<S>, Err<ParseError<`ParseValue failed. Can't parse "${S}" as a value.`>>>;
type Result<E, V> = [E, V];
type Err<E> = Result<E, null>;
type Ok<V> = Result<null, V>;
type Try<R extends Result<any, any>, Handled> = R[1] extends null ? Handled : R;
type Concat<R extends Result<any, any>, Arr extends any[]> = R[1] extends any[] ? Ok<[...R[1], ...Arr]> : R;
type ConcatInner<R extends Result<any, any>, R2 extends Result<any, any>> = R2[1] extends any[] ? Concat<R, R2[1]> : R2;
type Merge<R extends Result<any, any>, E> = R[0] extends null ? Ok<R[1] & E> : R;
type MergeInner<R extends Result<any, any>, R2 extends Result<any, any>> = R2[0] extends null ? Merge<R, R2[1]> : R;
type ToArray<R extends Result<any, any>> = R extends [infer E, infer V] ? E extends null ? V extends any[] ? R : Ok<[R[1]]> : R : R;
type ParseInnerExpression<S extends string> = S extends '' ? Err<ParseError<'Saw an empty expression'>> : Try<ParseNumber<S>, ParseObject<S>>;
type ParseExpressions<S extends string> = S extends `[${infer Expr}]${infer Remainder}` ? Trim<Remainder> extends '' ? ToArray<ParseInnerExpression<Trim<Expr>>> : ConcatInner<ToArray<ParseInnerExpression<Trim<Expr>>>, ParseExpressions<Remainder>> : Err<ParseError<`Cannot parse object from "${S}"`>>;
type ParseProperty<S extends string> = Trim<S> extends '' ? Err<ParseError<'Empty property'>> : Split<Trim<S>, '[', true> extends [`${infer Prop}`, `${infer Expression}`] ? Trim<Prop> extends '' ? ParseExpressions<Trim<Expression>> : ConcatInner<Ok<[Trim<Prop>]>, ParseExpressions<Trim<Expression>>> : Ok<[Trim<S>]>;
type ParseAllProps<Props extends string[]> = Props extends [`${infer Head}`, ...infer Tail] ? Tail extends string[] ? ConcatInner<ParseProperty<Trim<Head>>, ParseAllProps<Tail>> : ParseProperty<Trim<Head>> : Ok<[]>;
type Unwrap<R extends Result<any, any>> = R extends [infer E, infer V] ? E extends null ? V : E : never;
type StringToPath<S extends string> = Unwrap<ParseAllProps<SplitAll<Trim<S>, '.'>>>;
type StripError<S extends StringToPath<string> | ParseError<string>> = S extends ParseError<string> ? never : S;
type SafePath<S extends string> = StripError<StringToPath<S>>;
export { AnyArray, AnyEmptyArray, ArrayElement, ArrayLength, ByIndex, Concat, ConcatInner, Digit, ElementType, EmptyArray, Err, FindBy, FindInArray, Format, Index, KeyedPathElement, Merge, MergeInner, NormalizeReadOnlyArray, Ok, OnlyDigits, Optional, ParseAllProps, ParseError, ParseExpressions, ParseInnerExpression, ParseKVPair, ParseNumber, ParseObject, ParseProperty, ParseValue, Path, PathElement, PropertyName, Result, SafePath, Split, SplitAll, StringToPath, StripError, ToArray, ToNumber, Trim, TrimLeft, TrimRight, Try, Tuplify, Unwrap };
//# sourceMappingURL=types.d.ts.map
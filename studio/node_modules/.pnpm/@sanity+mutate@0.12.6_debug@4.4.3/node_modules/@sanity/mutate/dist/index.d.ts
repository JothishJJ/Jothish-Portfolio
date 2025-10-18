import { AnyArray, AnyEmptyArray, ArrayElement, ByIndex, Concat, ConcatInner, Digit, ElementType, Err, FindBy, FindInArray, Index, KeyedPathElement, Merge, MergeInner, NormalizeReadOnlyArray, Ok, OnlyDigits, Optional, ParseAllProps, ParseError, ParseExpressions, ParseInnerExpression, ParseKVPair, ParseNumber, ParseObject, ParseProperty, ParseValue, Path, PathElement, PropertyName, Result, SafePath, Split, SplitAll, StringToPath, StripError, ToArray, ToNumber, Trim, TrimLeft, TrimRight, Try, Tuplify, Unwrap } from "./_chunks-dts/types.js";
import { AnyOp, ArrayOp, AssignOp, CreateIfNotExistsMutation, CreateMutation, CreateOrReplaceMutation, DecOp, DeleteMutation, DiffMatchPatchOp, IncOp, InsertOp, Mutation, NodePatch, NodePatchList, NumberOp, ObjectOp, Operation, PatchMutation, PatchOptions, PrimitiveOp, RelativePosition, RemoveOp, ReplaceOp, SanityDocumentBase, SetIfMissingOp, SetOp, StringOp, Transaction, TruncateOp, UnassignOp, UnsetOp, UpsertOp } from "./_chunks-dts/types2.js";
import { Insert, SanityCreateIfNotExistsMutation, SanityCreateMutation, SanityCreateOrReplaceMutation, SanityDecPatch, SanityDeleteMutation, SanityDiffMatchPatch, SanityIncPatch, SanityInsertPatch, SanityMutation, SanityPatch, SanityPatchMutation, SanitySetIfMissingPatch, SanitySetPatch, SanityUnsetPatch, decode as decode$1, decodeAll } from "./_chunks-dts/decode.js";
declare function encode$1(mutation: Mutation): SanityMutation[] | SanityMutation;
declare function encodeAll(mutations: Mutation[]): SanityMutation[];
declare function encodeTransaction(transaction: Transaction): {
  transactionId: string | undefined;
  mutations: SanityMutation[];
};
declare function encodeMutation(mutation: Mutation): SanityMutation[] | SanityMutation;
declare namespace index_d_exports$2 {
  export { Insert, Mutation, SanityCreateIfNotExistsMutation, SanityCreateMutation, SanityCreateOrReplaceMutation, SanityDecPatch, SanityDeleteMutation, SanityDiffMatchPatch, SanityDocumentBase, SanityIncPatch, SanityInsertPatch, SanityMutation, SanityPatch, SanityPatchMutation, SanitySetIfMissingPatch, SanitySetPatch, SanityUnsetPatch, decode$1 as decode, decodeAll, encode$1 as encode, encodeAll, encodeMutation, encodeTransaction };
}
type Id = string;
type RevisionLock = string;
type CompactPath = string;
type ItemRef$1 = string | number;
type DeleteMutation$1 = ['delete', Id];
type CreateMutation$1<Doc> = ['create', Doc];
type CreateIfNotExistsMutation$1<Doc> = ['createIfNotExists', Doc];
type CreateOrReplaceMutation$1<Doc> = ['createOrReplace', Doc];
type UnsetMutation = ['patch', 'unset', Id, CompactPath, [], RevisionLock?];
type InsertMutation = ['patch', 'insert', Id, CompactPath, [RelativePosition, ItemRef$1, AnyArray], RevisionLock?];
type UpsertMutation = ['patch', 'upsert', Id, CompactPath, [RelativePosition, ItemRef$1, AnyArray], RevisionLock?];
type TruncateMutation = ['patch', 'truncate', Id, CompactPath, [startIndex: number, endIndex: number | undefined], RevisionLock?];
type IncMutation = ['patch', 'inc', Id, CompactPath, [number], RevisionLock?];
type DecMutation = ['patch', 'dec', Id, CompactPath, [number], RevisionLock?];
type AssignMutation = ['patch', 'assign', Id, CompactPath, [object], RevisionLock?];
type UnassignMutation = ['patch', 'assign', Id, CompactPath, [string[]], RevisionLock?];
type ReplaceMutation = ['patch', 'replace', Id, CompactPath, [ItemRef$1, AnyArray], RevisionLock?];
type RemoveMutation = ['patch', 'remove', Id, CompactPath, [ItemRef$1], RevisionLock?];
type SetMutation = ['patch', 'set', Id, CompactPath, any, RevisionLock?];
type SetIfMissingMutation = ['patch', 'setIfMissing', Id, CompactPath, [unknown], RevisionLock?];
type DiffMatchPatchMutation = ['patch', 'diffMatchPatch', Id, CompactPath, [string], RevisionLock?];
type CompactPatchMutation = UnsetMutation | InsertMutation | UpsertMutation | TruncateMutation | IncMutation | DecMutation | SetMutation | SetIfMissingMutation | DiffMatchPatchMutation | AssignMutation | UnassignMutation | ReplaceMutation | RemoveMutation;
type CompactMutation<Doc> = DeleteMutation$1 | CreateMutation$1<Doc> | CreateIfNotExistsMutation$1<Doc> | CreateOrReplaceMutation$1<Doc> | CompactPatchMutation;
declare function decode<Doc extends SanityDocumentBase>(mutations: CompactMutation<Doc>[]): Mutation[];
declare function encode<Doc extends SanityDocumentBase>(mutations: Mutation[]): CompactMutation<Doc>[];
declare namespace index_d_exports {
  export { AssignMutation, CompactMutation, CompactPatchMutation, CompactPath, CreateIfNotExistsMutation$1 as CreateIfNotExistsMutation, CreateMutation$1 as CreateMutation, CreateOrReplaceMutation$1 as CreateOrReplaceMutation, DecMutation, DeleteMutation$1 as DeleteMutation, DiffMatchPatchMutation, Id, IncMutation, InsertMutation, ItemRef$1 as ItemRef, RemoveMutation, ReplaceMutation, RevisionLock, SetIfMissingMutation, SetMutation, TruncateMutation, UnassignMutation, UnsetMutation, UpsertMutation, decode, encode };
}
/**
 * @deprecated
 */
type FormPatchPathKeyedSegment = {
  _key: string;
};
/**
 * @deprecated
 */
type FormPatchPathIndexTuple = [number | '', number | ''];
/**
 * @deprecated
 */
type FormPatchPathSegment = string | number | FormPatchPathKeyedSegment | FormPatchPathIndexTuple;
/**
 * @deprecated
 */
type FormPatchPath = FormPatchPathSegment[];
/**
 * A variant of the FormPath type that never contains index tupes
 */
type CompatPath = Exclude<ElementType<FormPatchPath>, FormPatchPathIndexTuple>[];
/**
 *
 * @internal
 * @deprecated
 */
type FormPatchJSONValue = number | string | boolean | {
  [key: string]: FormPatchJSONValue;
} | FormPatchJSONValue[];
/**
 *
 * @internal
 * @deprecated
 */
type FormPatchOrigin = 'remote' | 'local' | 'internal';
/**
 *
 * @internal
 * @deprecated
 */
interface FormSetPatch {
  path: FormPatchPath;
  type: 'set';
  value: FormPatchJSONValue;
}
/**
 *
 * @internal
 * @deprecated
 */
interface FormIncPatch {
  path: FormPatchPath;
  type: 'inc';
  value: FormPatchJSONValue;
}
/**
 *
 * @internal
 * @deprecated
 */
interface FormDecPatch {
  path: FormPatchPath;
  type: 'dec';
  value: FormPatchJSONValue;
}
/**
 *
 * @internal
 * @deprecated
 */
interface FormSetIfMissingPatch {
  path: FormPatchPath;
  type: 'setIfMissing';
  value: FormPatchJSONValue;
}
/**
 *
 * @internal
 * @deprecated
 */
interface FormUnsetPatch {
  path: FormPatchPath;
  type: 'unset';
}
/**
 *
 * @internal
 * @deprecated
 */
type FormInsertPatchPosition = 'before' | 'after';
/**
 *
 * @internal
 * @deprecated
 */
interface FormInsertPatch {
  path: FormPatchPath;
  type: 'insert';
  position: FormInsertPatchPosition;
  items: FormPatchJSONValue[];
}
/**
 *
 * @internal
 * @deprecated
 */
interface FormDiffMatchPatch {
  path: FormPatchPath;
  type: 'diffMatchPatch';
  value: string;
}
/**
 *
 * @internal
 * @deprecated
 */
type FormPatchLike = FormSetPatch | FormSetIfMissingPatch | FormUnsetPatch | FormInsertPatch | FormDiffMatchPatch;
/**
 * Convert a Sanity form patch (ie emitted from an input component) to a {@link NodePatch}
 * Note the lack of encodeMutation here. Sanity forms never emit *mutations*, only patches
 * @param patches - Array of {@link FormPatchLike}
 * @internal
 */
declare function encodePatches(patches: FormPatchLike[]): NodePatch[];
declare namespace index_d_exports$1 {
  export { CompatPath, FormDecPatch, FormDiffMatchPatch, FormIncPatch, FormInsertPatch, FormInsertPatchPosition, FormPatchJSONValue, FormPatchLike, FormPatchOrigin, FormPatchPath, FormPatchPathIndexTuple, FormPatchPathKeyedSegment, FormPatchPathSegment, FormSetIfMissingPatch, FormSetPatch, FormUnsetPatch, encodePatches };
}
declare namespace compact_d_exports {
  export { ItemRef, format };
}
type ItemRef = string | number;
declare function format<Doc extends SanityDocumentBase>(mutations: Mutation[]): string;
declare function autoKeys<Item>(generateKey: (item: Item) => string): {
  insert: <Pos extends RelativePosition, Ref extends Index | KeyedPathElement>(position: Pos, referenceItem: Ref, items: Item[]) => InsertOp<Item[], Pos, Ref>;
  upsert: <Pos extends RelativePosition, ReferenceItem extends Index | KeyedPathElement>(items: Item[], position: Pos, referenceItem: ReferenceItem) => UpsertOp<Item[], Pos, ReferenceItem>;
  replace: <Pos extends RelativePosition, ReferenceItem extends Index | KeyedPathElement>(items: Item[], position: Pos, referenceItem: ReferenceItem) => ReplaceOp<Item[], ReferenceItem>;
  insertBefore: <Ref extends Index | KeyedPathElement>(ref: Ref, items: Item[]) => InsertOp<Item[], "before", Ref>;
  prepend: (items: Item[]) => InsertOp<Item[], "before", 0>;
  insertAfter: <Ref extends Index | KeyedPathElement>(ref: Ref, items: Item[]) => InsertOp<Item[], "after", Ref>;
  append: (items: Item[]) => InsertOp<Item[], "after", -1>;
};
declare function create<Doc extends Optional<SanityDocumentBase, '_id'>>(document: Doc): CreateMutation<Doc>;
declare function patch<P extends NodePatchList | NodePatch>(id: string, patches: P, options?: PatchOptions): PatchMutation<NormalizeReadOnlyArray<Tuplify<P>>>;
declare function at<const P extends Path, O extends Operation>(path: P, operation: O): NodePatch<NormalizeReadOnlyArray<P>, O>;
declare function at<const P extends string, O extends Operation>(path: P, operation: O): NodePatch<SafePath<P>, O>;
declare function createIfNotExists<Doc extends SanityDocumentBase>(document: Doc): CreateIfNotExistsMutation<Doc>;
declare function createOrReplace<Doc extends SanityDocumentBase>(document: Doc): CreateOrReplaceMutation<Doc>;
declare function delete_(id: string): DeleteMutation;
declare const del: typeof delete_;
declare const destroy: typeof delete_;
declare const set: <const T>(value: T) => SetOp<T>;
declare const assign: <const T extends { [K in string]: unknown }>(value: T) => AssignOp<T>;
declare const unassign: <const K extends readonly string[]>(keys: K) => UnassignOp<K>;
declare const setIfMissing: <const T>(value: T) => SetIfMissingOp<T>;
declare const unset: () => UnsetOp;
declare const inc: <const N extends number = 1>(amount?: N) => IncOp<N>;
declare const dec: <const N extends number = 1>(amount?: N) => DecOp<N>;
declare const diffMatchPatch: (value: string) => DiffMatchPatchOp;
declare function insert<const Items extends AnyArray<unknown>, const Pos extends RelativePosition, const ReferenceItem extends Index | KeyedPathElement>(items: Items | ArrayElement<Items>, position: Pos, indexOrReferenceItem: ReferenceItem): InsertOp<NormalizeReadOnlyArray<Items>, Pos, ReferenceItem>;
declare function append<const Items extends AnyArray<unknown>>(items: Items | ArrayElement<Items>): InsertOp<NormalizeReadOnlyArray<Items>, "after", -1>;
declare function prepend<const Items extends AnyArray<unknown>>(items: Items | ArrayElement<Items>): InsertOp<NormalizeReadOnlyArray<Items>, "before", 0>;
declare function insertBefore<const Items extends AnyArray<unknown>, const ReferenceItem extends Index | KeyedPathElement>(items: Items | ArrayElement<Items>, indexOrReferenceItem: ReferenceItem): InsertOp<NormalizeReadOnlyArray<Items>, "before", ReferenceItem>;
declare const insertAfter: <const Items extends AnyArray<unknown>, const ReferenceItem extends Index | KeyedPathElement>(items: Items | ArrayElement<Items>, indexOrReferenceItem: ReferenceItem) => InsertOp<NormalizeReadOnlyArray<Items>, "after", ReferenceItem>;
declare function truncate(startIndex: number, endIndex?: number): TruncateOp;
declare function replace<Items extends any[], ReferenceItem extends Index | KeyedPathElement>(items: Items | ArrayElement<Items>, referenceItem: ReferenceItem): ReplaceOp<Items, ReferenceItem>;
declare function remove<ReferenceItem extends Index | KeyedPathElement>(referenceItem: ReferenceItem): RemoveOp<ReferenceItem>;
declare function upsert<const Items extends AnyArray<unknown>, const Pos extends RelativePosition, const ReferenceItem extends Index | KeyedPathElement>(items: Items | ArrayElement<Items>, position: Pos, referenceItem: ReferenceItem): UpsertOp<Items, Pos, ReferenceItem>;
type Arrify<T> = (T extends (infer E)[] ? E : T)[];
export { type AnyArray, AnyEmptyArray, AnyOp, type ArrayElement, ArrayOp, type Arrify, AssignOp, ByIndex, index_d_exports as CompactEncoder, compact_d_exports as CompactFormatter, Concat, ConcatInner, CreateIfNotExistsMutation, CreateMutation, CreateOrReplaceMutation, DecOp, DeleteMutation, DiffMatchPatchOp, Digit, ElementType, Err, FindBy, FindInArray, index_d_exports$1 as FormCompatEncoder, IncOp, Index, InsertOp, KeyedPathElement, Merge, MergeInner, Mutation, NodePatch, NodePatchList, type NormalizeReadOnlyArray, NumberOp, ObjectOp, Ok, OnlyDigits, Operation, type Optional, ParseAllProps, ParseError, ParseExpressions, ParseInnerExpression, ParseKVPair, ParseNumber, ParseObject, ParseProperty, ParseValue, PatchMutation, PatchOptions, Path, PathElement, PrimitiveOp, PropertyName, RelativePosition, RemoveOp, ReplaceOp, Result, SafePath, SanityDocumentBase, index_d_exports$2 as SanityEncoder, SetIfMissingOp, SetOp, Split, SplitAll, StringOp, StringToPath, StripError, ToArray, ToNumber, Transaction, Trim, TrimLeft, TrimRight, TruncateOp, Try, type Tuplify, UnassignOp, UnsetOp, Unwrap, UpsertOp, append, assign, at, autoKeys, create, createIfNotExists, createOrReplace, dec, del, delete_, destroy, diffMatchPatch, inc, insert, insertAfter, insertBefore, patch, prepend, remove, replace, set, setIfMissing, truncate, unassign, unset, upsert };
//# sourceMappingURL=index.d.ts.map
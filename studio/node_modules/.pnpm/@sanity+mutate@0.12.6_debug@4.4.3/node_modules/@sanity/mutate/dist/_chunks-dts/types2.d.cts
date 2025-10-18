import { AnyArray, Index, KeyedPathElement, Optional, Path } from "./types.cjs";
type SetOp<T> = {
  type: 'set';
  value: T;
};
type UnsetOp = {
  type: 'unset';
};
type SetIfMissingOp<T> = {
  type: 'setIfMissing';
  value: T;
};
type IncOp<Amount extends number> = {
  type: 'inc';
  amount: Amount;
};
type DecOp<Amount extends number> = {
  type: 'dec';
  amount: Amount;
};
type RelativePosition = 'before' | 'after';
type InsertOp<Items extends AnyArray, Pos extends RelativePosition, ReferenceItem extends Index | KeyedPathElement> = {
  type: 'insert';
  referenceItem: ReferenceItem;
  position: Pos;
  items: Items;
};
type TruncateOp = {
  type: 'truncate';
  startIndex: number;
  endIndex?: number;
};
type RemoveOp<ReferenceItem extends Index | KeyedPathElement> = {
  type: 'remove';
  referenceItem: ReferenceItem;
};
type ReplaceOp<Items extends AnyArray, ReferenceItem extends Index | KeyedPathElement> = {
  type: 'replace';
  referenceItem: ReferenceItem;
  items: Items;
};
type UpsertOp<Items extends AnyArray, Pos extends RelativePosition, ReferenceItem extends Index | KeyedPathElement> = {
  type: 'upsert';
  items: Items;
  referenceItem: ReferenceItem;
  position: Pos;
};
type AssignOp<T extends object = object> = {
  type: 'assign';
  value: T;
};
type UnassignOp<K extends readonly string[] = readonly string[]> = {
  type: 'unassign';
  keys: K;
};
type DiffMatchPatchOp = {
  type: 'diffMatchPatch';
  value: string;
};
type Operation = PrimitiveOp | ArrayOp | ObjectOp;
type AnyOp = SetOp<unknown> | SetIfMissingOp<unknown> | UnsetOp;
type NumberOp = IncOp<number> | DecOp<number>;
type StringOp = DiffMatchPatchOp;
type ObjectOp = AssignOp | UnassignOp;
type ArrayOp = InsertOp<AnyArray, RelativePosition, Index | KeyedPathElement> | UpsertOp<AnyArray, RelativePosition, Index | KeyedPathElement> | ReplaceOp<AnyArray, Index | KeyedPathElement> | TruncateOp | RemoveOp<Index | KeyedPathElement>;
type PrimitiveOp = AnyOp | StringOp | NumberOp;
type NodePatchList = [NodePatch, ...NodePatch[]] | NodePatch[] | readonly NodePatch[] | readonly [NodePatch, ...NodePatch[]];
interface SanityDocumentBase {
  _id?: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
}
type CreateMutation<Doc extends Optional<SanityDocumentBase, '_id'>> = {
  type: 'create';
  document: Doc;
};
type CreateIfNotExistsMutation<Doc extends SanityDocumentBase> = {
  type: 'createIfNotExists';
  document: Doc;
};
type CreateOrReplaceMutation<Doc extends SanityDocumentBase> = {
  type: 'createOrReplace';
  document: Doc;
};
type DeleteMutation = {
  type: 'delete';
  id: string;
};
type PatchMutation<Patches extends NodePatchList = NodePatchList> = {
  type: 'patch';
  id: string;
  patches: Patches;
  options?: PatchOptions;
};
type Mutation<Doc extends SanityDocumentBase = any> = CreateMutation<Doc> | CreateIfNotExistsMutation<Doc> | CreateOrReplaceMutation<Doc> | DeleteMutation | PatchMutation;
type NodePatch<P extends Path = Path, O extends Operation = Operation> = {
  path: P;
  op: O;
};
type PatchOptions = {
  ifRevision?: string;
};
interface Transaction {
  id?: string;
  mutations: Mutation[];
}
export { AnyOp, ArrayOp, AssignOp, CreateIfNotExistsMutation, CreateMutation, CreateOrReplaceMutation, DecOp, DeleteMutation, DiffMatchPatchOp, IncOp, InsertOp, Mutation, NodePatch, NodePatchList, NumberOp, ObjectOp, Operation, PatchMutation, PatchOptions, PrimitiveOp, RelativePosition, RemoveOp, ReplaceOp, SanityDocumentBase, SetIfMissingOp, SetOp, StringOp, Transaction, TruncateOp, UnassignOp, UnsetOp, UpsertOp };
//# sourceMappingURL=types2.d.cts.map
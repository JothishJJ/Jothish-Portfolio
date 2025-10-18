import { IdentifiedSanityDocument, SanityDocumentBase } from "./types2.cjs";
import { Mutation as SanityMutation, PatchMutationOperation, PatchOperations } from "@sanity/client";
type SanityDiffMatchPatch = {
  id: string;
  diffMatchPatch: {
    [path: string]: string;
  };
};
type SanitySetPatch = {
  id: string;
  set: {
    [path: string]: any;
  };
};
type InsertBefore = {
  before: string;
  items: any[];
};
type InsertAfter = {
  after: string;
  items: any[];
};
type InsertReplace = {
  replace: string;
  items: any[];
};
type Insert = InsertBefore | InsertAfter | InsertReplace;
type SanityInsertPatch = {
  id: string;
  insert: Insert;
};
type SanityUnsetPatch = {
  id: string;
  unset: string[];
};
type SanityIncPatch = {
  id: string;
  inc: {
    [path: string]: number;
  };
};
type SanityDecPatch = {
  id: string;
  dec: {
    [path: string]: number;
  };
};
type SanitySetIfMissingPatch = {
  id: string;
  setIfMissing: {
    [path: string]: any;
  };
};
type SanityPatch = PatchOperations & {
  id: string;
};
type SanityCreateIfNotExistsMutation<Doc extends IdentifiedSanityDocument = IdentifiedSanityDocument> = {
  createIfNotExists: Doc;
};
type SanityCreateOrReplaceMutation<Doc extends IdentifiedSanityDocument = IdentifiedSanityDocument> = {
  createOrReplace: Doc;
};
type SanityCreateMutation<Doc extends SanityDocumentBase> = {
  create: Doc;
};
type SanityDeleteMutation = {
  delete: {
    id: string;
  };
};
export { Insert, InsertAfter, InsertBefore, InsertReplace, type PatchMutationOperation, SanityCreateIfNotExistsMutation, SanityCreateMutation, SanityCreateOrReplaceMutation, SanityDecPatch, SanityDeleteMutation, SanityDiffMatchPatch, SanityIncPatch, SanityInsertPatch, type SanityMutation, SanityPatch, SanitySetIfMissingPatch, SanitySetPatch, SanityUnsetPatch };
//# sourceMappingURL=types3.d.cts.map
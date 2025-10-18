import { Mutation, SanityDocumentBase } from "./types2.cjs";
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
type Insert = {
  before?: string;
  after?: string;
  replace?: string;
  items: any[];
};
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
type SanityPatch = SanitySetPatch | SanityUnsetPatch | SanityInsertPatch | SanitySetIfMissingPatch | SanityDiffMatchPatch | SanityIncPatch | SanityDecPatch;
type SanityCreateIfNotExistsMutation<Doc extends SanityDocumentBase> = {
  createIfNotExists: Doc;
};
type SanityCreateOrReplaceMutation<Doc extends SanityDocumentBase> = {
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
type SanityPatchMutation = {
  patch: SanitySetPatch | SanitySetIfMissingPatch | SanityDiffMatchPatch | SanityInsertPatch | SanityUnsetPatch;
};
type SanityMutation<Doc extends SanityDocumentBase = SanityDocumentBase> = SanityCreateMutation<Doc> | SanityCreateIfNotExistsMutation<Doc> | SanityCreateOrReplaceMutation<Doc> | SanityDeleteMutation | SanityPatchMutation;
declare function decodeAll<Doc extends SanityDocumentBase>(sanityMutations: SanityMutation<Doc>[]): Mutation[];
declare function decode<Doc extends SanityDocumentBase>(encodedMutation: SanityMutation<Doc>): Mutation;
export { Insert, SanityCreateIfNotExistsMutation, SanityCreateMutation, SanityCreateOrReplaceMutation, SanityDecPatch, SanityDeleteMutation, SanityDiffMatchPatch, SanityIncPatch, SanityInsertPatch, SanityMutation, SanityPatch, SanityPatchMutation, SanitySetIfMissingPatch, SanitySetPatch, SanityUnsetPatch, decode, decodeAll };
//# sourceMappingURL=decode.d.cts.map
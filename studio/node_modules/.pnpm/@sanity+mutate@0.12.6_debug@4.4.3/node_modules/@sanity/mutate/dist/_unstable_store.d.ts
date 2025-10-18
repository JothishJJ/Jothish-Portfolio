import { AnyArray, AnyEmptyArray, ByIndex, Concat, ConcatInner, Digit, ElementType, Err, FindBy, FindInArray, Index, KeyedPathElement, Merge, MergeInner, Ok, OnlyDigits, Optional, ParseAllProps, ParseError, ParseExpressions, ParseInnerExpression, ParseKVPair, ParseNumber, ParseObject, ParseProperty, ParseValue, Path, PathElement, PropertyName, Result, SafePath, Split, SplitAll, StringToPath, StripError, ToArray, ToNumber, Trim, TrimLeft, TrimRight, Try, Unwrap } from "./_chunks-dts/types.js";
import { Get, GetAtPath, getAtPath, isArrayElement, isElementEqual, isEqual, isIndexElement, isKeyElement, isKeyedElement, isPropertyElement, normalize, parse, startsWith, stringify } from "./_chunks-dts/predicates.js";
import { AnyOp, ArrayOp, AssignOp, CreateIfNotExistsMutation, CreateMutation, CreateOrReplaceMutation, DecOp, DeleteMutation, DiffMatchPatchOp, IncOp, InsertOp, Mutation, NodePatch, NodePatchList, NumberOp, ObjectOp, Operation, PatchMutation, PatchOptions, PrimitiveOp, RelativePosition, RemoveOp, ReplaceOp, SanityDocumentBase, SetIfMissingOp, SetOp, StringOp, Transaction, TruncateOp, UnassignOp, UnsetOp, UpsertOp } from "./_chunks-dts/types2.js";
import { Insert, SanityCreateIfNotExistsMutation, SanityCreateMutation, SanityCreateOrReplaceMutation, SanityDecPatch, SanityDeleteMutation, SanityDiffMatchPatch, SanityIncPatch, SanityInsertPatch, SanityMutation, SanityPatch, SanityPatchMutation, SanitySetIfMissingPatch, SanitySetPatch, SanityUnsetPatch } from "./_chunks-dts/decode.js";
import { Observable } from "rxjs";
import { RawPatch } from "mendoza";
import { ReconnectEvent, SanityClient, WelcomeEvent } from "@sanity/client";
interface ListenerSyncEvent<Doc extends SanityDocumentBase = SanityDocumentBase> {
  type: 'sync';
  document: Doc | undefined;
}
interface ListenerMutationEvent {
  type: 'mutation';
  documentId: string;
  transactionId: string;
  resultRev?: string;
  previousRev?: string;
  effects?: {
    apply: RawPatch;
  };
  mutations: SanityMutation[];
  transition: 'update' | 'appear' | 'disappear';
}
interface ListenerReconnectEvent {
  type: 'reconnect';
}
type ListenerChannelErrorEvent = {
  type: 'channelError';
  message: string;
};
type ListenerWelcomeEvent = {
  type: 'welcome';
  listenerName: string;
};
type ListenerDisconnectEvent = {
  type: 'disconnect';
  reason: string;
};
type ListenerEndpointEvent = ListenerWelcomeEvent | ListenerMutationEvent | ListenerReconnectEvent | ListenerChannelErrorEvent | ListenerDisconnectEvent;
type ListenerEvent<Doc extends SanityDocumentBase = SanityDocumentBase> = ListenerSyncEvent<Doc> | ListenerMutationEvent | ListenerReconnectEvent;
interface OptimisticDocumentEvent {
  type: 'optimistic';
  id: string;
  before: SanityDocumentBase | undefined;
  after: SanityDocumentBase | undefined;
  mutations: Mutation[];
  stagedChanges: Mutation[];
}
type QueryParams = Record<string, string | number | boolean | (string | number | boolean)[]>;
interface RemoteSyncEvent {
  type: 'sync';
  id: string;
  before: {
    local: SanityDocumentBase | undefined;
    remote: SanityDocumentBase | undefined;
  };
  after: {
    local: SanityDocumentBase | undefined;
    remote: SanityDocumentBase | undefined;
  };
  rebasedStage: MutationGroup[];
}
interface RemoteMutationEvent {
  type: 'mutation';
  id: string;
  before: {
    local: SanityDocumentBase | undefined;
    remote: SanityDocumentBase | undefined;
  };
  after: {
    local: SanityDocumentBase | undefined;
    remote: SanityDocumentBase | undefined;
  };
  effects?: {
    apply: RawPatch;
  };
  previousRev?: string;
  resultRev?: string;
  mutations: Mutation[];
  rebasedStage: MutationGroup[];
}
type RemoteDocumentEvent = RemoteSyncEvent | RemoteMutationEvent;
type DocumentMap<Doc extends SanityDocumentBase> = {
  get(id: string): Doc | undefined;
  set(id: string, doc: Doc | undefined): void;
  delete(id: string): void;
};
interface MutationResult {}
interface SubmitResult {}
interface NonTransactionalMutationGroup {
  transaction: false;
  mutations: Mutation[];
}
interface TransactionalMutationGroup {
  transaction: true;
  id?: string;
  mutations: Mutation[];
}
/**
 * A mutation group represents an incoming, locally added group of mutations
 * They can either be transactional or non-transactional
 * - Transactional means that they must be submitted as a separate transaction (with an optional id) and no other mutations can be mixed with it
 * – Non-transactional means that they can be combined with other mutations
 */
type MutationGroup = NonTransactionalMutationGroup | TransactionalMutationGroup;
type Conflict = {
  path: Path;
  error: Error;
  base: SanityDocumentBase | undefined;
  local: SanityDocumentBase | undefined;
};
interface OptimisticStore {
  meta: {
    /**
     * A stream of events for anything that happens in the store
     */
    events: Observable<OptimisticDocumentEvent | RemoteDocumentEvent>;
    /**
     * A stream of current staged changes
     */
    stage: Observable<MutationGroup[]>;
    /**
     * A stream of current conflicts. TODO: Needs more work
     */
    conflicts: Observable<Conflict[]>;
  };
  /**
   * Applies the given mutations. Mutations are not guaranteed to be submitted in the same transaction
   * Can this mutate both local and remote documents at the same time
   */
  mutate(mutation: Mutation[]): MutationResult;
  /**
   * Makes sure the given mutations are posted in a single transaction
   */
  transaction(transaction: {
    id?: string;
    mutations: Mutation[];
  } | Mutation[]): MutationResult;
  /**
   * Checkout a document for editing. This is required to be able to see optimistic changes
   */
  listen(id: string): Observable<SanityDocumentBase | undefined>;
  /**
   * Listen for events for a given document id
   */
  listenEvents(id: string): Observable<RemoteDocumentEvent | OptimisticDocumentEvent>;
  /**
   * Optimize list of pending mutations
   */
  optimize(): void;
  /**
   * Submit pending mutations
   */
  submit(): Promise<SubmitResult[]>;
}
interface DocumentSyncUpdate<Doc extends SanityDocumentBase> {
  documentId: string;
  snapshot: Doc | undefined;
  event: ListenerSyncEvent<Doc>;
}
interface DocumentMutationUpdate<Doc extends SanityDocumentBase> {
  documentId: string;
  snapshot: Doc | undefined;
  event: ListenerMutationEvent;
}
interface DocumentReconnectUpdate<Doc extends SanityDocumentBase> {
  documentId: string;
  snapshot: Doc | undefined;
  event: ListenerReconnectEvent;
}
type DocumentUpdate<Doc extends SanityDocumentBase> = DocumentSyncUpdate<Doc> | DocumentMutationUpdate<Doc> | DocumentReconnectUpdate<any>;
type DocumentUpdateListener<Doc extends SanityDocumentBase> = (id: string) => Observable<DocumentUpdate<Doc>>;
/**
 * Creates a function that can be used to listen for document updates
 * Emits the latest snapshot of the document along with the latest event
 * @param options
 */
declare function createDocumentUpdateListener(options: {
  listenDocumentEvents: (documentId: string) => Observable<ListenerEvent>;
}): <Doc extends SanityDocumentBase>(documentId: string) => Observable<DocumentUpdate<Doc>>;
type MapTuple<T, U> = { [K in keyof T]: U };
interface ReadOnlyDocumentStore {
  listenDocument: <Doc extends SanityDocumentBase>(id: string) => Observable<DocumentUpdate<Doc>>;
  listenDocuments: <Doc extends SanityDocumentBase, const IdTuple extends string[]>(id: IdTuple) => Observable<MapTuple<IdTuple, DocumentUpdate<Doc>>>;
}
/**
 * @param listenDocumentUpdates – a function that takes a document id and returns  an observable of document snapshots
 * @param options
 */
declare function createReadOnlyStore(listenDocumentUpdates: DocumentUpdateListener<SanityDocumentBase>, options?: {
  shutdownDelay?: number;
}): ReadOnlyDocumentStore;
interface AccessibleDocumentResult {
  id: string;
  document: SanityDocumentBase;
  accessible: true;
}
type InaccessibleReason = 'existence' | 'permission';
interface InaccessibleDocumentResult {
  accessible: false;
  id: string;
  reason: InaccessibleReason;
}
type DocumentResult = AccessibleDocumentResult | InaccessibleDocumentResult;
type DocumentLoader = (documentIds: string) => Observable<DocumentResult>;
/**
 * Creates a function that can be used to listen for events that happens in a single document
 * Features
 *  - builtin retrying and connection recovery (track disconnected state by listening for `reconnect` events)
 *  - builtin mutation event ordering (they might arrive out of order), lost events detection (/listen endpoint doesn't guarantee delivery) and recovery
 *  - discards already-applied mutation events received while fetching the initial document snapshot
 * @param options
 */
declare function createDocumentEventListener(options: {
  loadDocument: DocumentLoader;
  listenerEvents: Observable<WelcomeEvent | ListenerMutationEvent | ReconnectEvent>;
}): <Doc extends SanityDocumentBase>(documentId: string) => Observable<ListenerEvent>;
type FetchDocuments = (ids: string[]) => Observable<DocEndpointResponse>;
interface OmittedDocument {
  id: string;
  reason: 'existence' | 'permission';
}
interface DocEndpointResponse {
  documents: SanityDocumentBase[];
  omitted: OmittedDocument[];
}
/**
 * Creates a "dataloader" style document loader that fetches from the /doc endpoint
 * @param {FetchDocuments} fetchDocuments - The client instance used for fetching documents.
 * @param options
 */
declare function createDocumentLoader(fetchDocuments: FetchDocuments, options?: {
  durationSelector?: () => Observable<unknown>;
  tag?: string;
}): (key: string) => Observable<DocumentResult>;
declare function createDocumentLoaderFromClient(client: SanityClient, options?: {
  durationSelector?: () => Observable<unknown>;
  tag?: string;
}): (key: string) => Observable<DocumentResult>;
type DocumentIdSetState = {
  status: 'connecting' | 'reconnecting' | 'connected';
  event: DocumentIdSetEvent | InitialEvent;
  snapshot: string[];
};
type InitialEvent = {
  type: 'connect';
};
type InsertMethod = 'sorted' | 'prepend' | 'append';
type DocumentIdSetEvent = {
  type: 'sync';
  documentIds: string[];
} | {
  type: 'reconnect';
} | {
  type: 'op';
  op: 'add' | 'remove';
  documentId: string;
};
type FetchDocumentIdsFn = (query: string, params?: QueryParams, options?: {
  tag?: string;
}) => Observable<string[]>;
type IdSetListenFn = (query: string, params?: QueryParams, options?: {
  visibility: 'transaction';
  events: ['welcome', 'mutation', 'reconnect'];
  includeResult: false;
  includeMutations: false;
  tag?: string;
}) => Observable<ListenerEndpointEvent>;
declare function createIdSetListener(listen: IdSetListenFn, fetch: FetchDocumentIdsFn): (queryFilter: string, params: QueryParams, options?: {
  tag?: string;
}) => Observable<DocumentIdSetEvent>;
declare function createIdSetListenerFromClient(client: SanityClient): void;
/** Converts a stream of id set listener events into a state containing the list of document ids */
declare function toState(options?: {
  insert?: InsertMethod;
}): (input$: Observable<DocumentIdSetEvent>) => Observable<DocumentIdSetState>;
interface ListenerOptions {
  /**
   * Provide a custom filter to the listener. By default, this listener will include all events
   * Note: make sure the filter includes events from documents you will subscribe to.
   */
  filter?: string;
  /**
   * Whether to include system documents or not
   * This will be ignored if a custom filter is provided
   */
  includeSystemDocuments?: boolean;
  /**
   * How long after the last subscriber is unsubscribed to keep the connection open
   */
  shutdownDelay?: number;
  /**
   * Include mutations in listener events
   */
  includeMutations?: boolean;
  /**
   * Request tag
   */
  tag?: string;
}
type SharedListenerListenFn = (query: string, queryParams: QueryParams, options: RequestOptions) => Observable<ListenerEndpointEvent>;
/**
 * These are fixed, and it's up to the implementation of the listen function to turn them into request parameters
 */
interface RequestOptions {
  events: ['welcome', 'mutation', 'reconnect'];
  includeResult: false;
  includePreviousRevision: false;
  visibility: 'transaction';
  effectFormat: 'mendoza';
  includeMutations?: boolean;
  tag?: string;
}
/**
 * Creates a (low level) shared listener that will emit 'welcome' for all new subscribers immediately, and thereafter emit every listener event, including welcome, mutation, and reconnects
 * Requires a Sanity client instance
 */
declare function createSharedListenerFromClient(client: SanityClient, options?: ListenerOptions): Observable<WelcomeEvent | ListenerMutationEvent | ReconnectEvent>;
/**
 * Creates a (low level) shared listener that will emit 'welcome' for all new subscribers immediately, and thereafter emit every listener event, including welcome, mutation, and reconnects
 * Useful for cases where you need control of how the listen request is set up
 */
declare function createSharedListener(listen: SharedListenerListenFn, options?: ListenerOptions): Observable<WelcomeEvent | ListenerMutationEvent | ReconnectEvent>;
/**
 * This is the interface that a mock backend instance needs to implement
 */
interface MockBackendAPI {
  listen(query: string): Observable<ListenerEndpointEvent>;
  getDocuments(ids: string[]): Observable<DocEndpointResponse>;
  submit(transaction: Transaction): Observable<SubmitResult>;
}
declare function createMockBackendAPI(): MockBackendAPI;
interface OptimisticStoreBackend {
  /**
   * Sets up a subscription to a document
   * The first event should either be a sync event or an error event.
   * After that, it should emit mutation events, error events or sync events
   * @param id
   */
  listen: (id: string) => Observable<ListenerEvent>;
  submit: (mutationGroups: Transaction) => Observable<SubmitResult>;
}
/**
 * Creates a local dataset that allows subscribing to documents by id and submitting mutations to be optimistically applied
 * @param backend
 */
declare function createOptimisticStore(backend: OptimisticStoreBackend): OptimisticStore;
declare function createOptimisticStoreClientBackend(client: SanityClient): OptimisticStoreBackend;
declare function createOptimisticStoreMockBackend(backendAPI: MockBackendAPI): OptimisticStoreBackend;
export { AccessibleDocumentResult, AnyArray, AnyEmptyArray, AnyOp, ArrayOp, AssignOp, ByIndex, Concat, ConcatInner, Conflict, CreateIfNotExistsMutation, CreateMutation, CreateOrReplaceMutation, DecOp, DeleteMutation, DiffMatchPatchOp, Digit, DocEndpointResponse, DocumentIdSetEvent, DocumentIdSetState, DocumentLoader, DocumentMap, DocumentMutationUpdate, DocumentReconnectUpdate, DocumentResult, DocumentSyncUpdate, DocumentUpdate, DocumentUpdateListener, ElementType, Err, FetchDocumentIdsFn, FetchDocuments, FindBy, FindInArray, Get, GetAtPath, IdSetListenFn, InaccessibleDocumentResult, InaccessibleReason, IncOp, Index, InitialEvent, Insert, InsertMethod, InsertOp, KeyedPathElement, ListenerChannelErrorEvent, ListenerDisconnectEvent, ListenerEndpointEvent, ListenerEvent, ListenerMutationEvent, ListenerOptions, ListenerReconnectEvent, ListenerSyncEvent, ListenerWelcomeEvent, MapTuple, Merge, MergeInner, MockBackendAPI, Mutation, MutationGroup, MutationResult, NodePatch, NodePatchList, NonTransactionalMutationGroup, NumberOp, ObjectOp, Ok, OmittedDocument, OnlyDigits, Operation, OptimisticDocumentEvent, OptimisticStore, OptimisticStoreBackend, Optional, ParseAllProps, ParseError, ParseExpressions, ParseInnerExpression, ParseKVPair, ParseNumber, ParseObject, ParseProperty, ParseValue, PatchMutation, PatchOptions, Path, PathElement, PrimitiveOp, PropertyName, QueryParams, ReadOnlyDocumentStore, RelativePosition, RemoteDocumentEvent, RemoteMutationEvent, RemoteSyncEvent, RemoveOp, ReplaceOp, RequestOptions, Result, SafePath, SanityCreateIfNotExistsMutation, SanityCreateMutation, SanityCreateOrReplaceMutation, SanityDecPatch, SanityDeleteMutation, SanityDiffMatchPatch, SanityDocumentBase, SanityIncPatch, SanityInsertPatch, SanityMutation, SanityPatch, SanityPatchMutation, SanitySetIfMissingPatch, SanitySetPatch, SanityUnsetPatch, SetIfMissingOp, SetOp, SharedListenerListenFn, Split, SplitAll, StringOp, StringToPath, StripError, SubmitResult, ToArray, ToNumber, Transaction, TransactionalMutationGroup, Trim, TrimLeft, TrimRight, TruncateOp, Try, UnassignOp, UnsetOp, Unwrap, UpsertOp, createDocumentEventListener, createDocumentLoader, createDocumentLoaderFromClient, createDocumentUpdateListener, createIdSetListener, createIdSetListenerFromClient, createMockBackendAPI, createOptimisticStore, createOptimisticStoreClientBackend, createOptimisticStoreMockBackend, createReadOnlyStore, createSharedListener, createSharedListenerFromClient, getAtPath, isArrayElement, isElementEqual, isEqual, isIndexElement, isKeyElement, isKeyedElement, isPropertyElement, normalize, parse, startsWith, stringify, toState };
//# sourceMappingURL=_unstable_store.d.ts.map
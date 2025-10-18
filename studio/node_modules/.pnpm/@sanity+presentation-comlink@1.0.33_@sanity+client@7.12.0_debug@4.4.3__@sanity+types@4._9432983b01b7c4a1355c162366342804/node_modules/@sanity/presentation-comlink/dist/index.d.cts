import * as _sanity_comlink19 from "@sanity/comlink";
import { ListenInput, MSG_RESPONSE, Message, Message as Message$1, MessageData, MessageType, ProtocolMessage, ProtocolMessage as ProtocolMessage$1, RequestMachineContext, RequestMachineContext as RequestMachineContext$1, ResponseMessage } from "@sanity/comlink";
import * as xstate54 from "xstate";
import { DocumentSchema, InsertMenuOptions, PreviewSnapshot, PreviewSnapshot as PreviewSnapshot$1, ResolvedSchemaTypeMap, ResolvedSchemaTypeMap as ResolvedSchemaTypeMap$1, SanityNode, SanityNode as SanityNode$1, SanityStegaNode, SanityStegaNode as SanityStegaNode$1, SchemaArrayItem, SchemaArrayNode, SchemaBooleanNode, SchemaInlineNode, SchemaNode, SchemaNullNode, SchemaNumberNode, SchemaObjectField, SchemaObjectNode, SchemaStringNode, SchemaType, SchemaType as SchemaType$1, SchemaUnionNode, SchemaUnionNodeOptions, SchemaUnionOption, SchemaUnknownNode, TypeSchema, UnresolvedPath, UnresolvedPath as UnresolvedPath$1 } from "@sanity/visual-editing-types";
import { Path } from "@sanity/client/csm";
declare const createCompatibilityActors: <T extends Message$1>() => {
  listen: xstate54.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage$1>;
  }, _sanity_comlink19.ListenInput, xstate54.EventObject>;
  requestMachine: xstate54.StateMachine<RequestMachineContext$1<T>, {
    type: "message";
    data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
  } | {
    type: "abort";
  }, {
    "listen for response"?: xstate54.ActorRefFromLogic<xstate54.ObservableActorLogic<MessageEvent<ProtocolMessage$1<_sanity_comlink19.ResponseMessage>>, {
      requestId: string;
      sources: Set<MessageEventSource>;
      signal?: AbortSignal;
    }, xstate54.EventObject>> | undefined;
  }, {
    src: "listen";
    logic: xstate54.ObservableActorLogic<MessageEvent<ProtocolMessage$1<_sanity_comlink19.ResponseMessage>>, {
      requestId: string;
      sources: Set<MessageEventSource>;
      signal?: AbortSignal;
    }, xstate54.EventObject>;
    id: "listen for response";
  }, xstate54.Values<{
    "send message": {
      type: "send message";
      params: {
        message: ProtocolMessage$1;
      };
    };
    "on success": {
      type: "on success";
      params: xstate54.NonReducibleUnknown;
    };
    "on fail": {
      type: "on fail";
      params: xstate54.NonReducibleUnknown;
    };
    "on abort": {
      type: "on abort";
      params: xstate54.NonReducibleUnknown;
    };
  }>, {
    type: "expectsResponse";
    params: unknown;
  }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
    channelId: string;
    data?: T["data"];
    domain: string;
    expectResponse?: boolean;
    from: string;
    parentRef: xstate54.AnyActorRef;
    resolvable?: PromiseWithResolvers<T["response"]>;
    responseTimeout?: number;
    responseTo?: string;
    signal?: AbortSignal;
    sources: Set<MessageEventSource> | MessageEventSource;
    suppressWarnings?: boolean;
    targetOrigin: string;
    to: string;
    type: T["type"];
  }, {
    requestId: string;
    response: T["response"] | null;
    responseTo: string | undefined;
  }, {
    type: "request.failed";
    requestId: string;
  } | {
    type: "request.aborted";
    requestId: string;
  } | {
    type: "request.success";
    requestId: string;
    response: _sanity_comlink19.MessageData | null;
    responseTo: string | undefined;
  }, xstate54.MetaObject, {
    readonly context: ({
      input
    }: {
      spawn: {
        <TSrc extends "listen">(logic: TSrc, ...[options]: {
          src: "listen";
          logic: xstate54.ObservableActorLogic<MessageEvent<ProtocolMessage$1<_sanity_comlink19.ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate54.EventObject>;
          id: "listen for response";
        } extends infer T_1 ? T_1 extends {
          src: "listen";
          logic: xstate54.ObservableActorLogic<MessageEvent<ProtocolMessage$1<_sanity_comlink19.ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate54.EventObject>;
          id: "listen for response";
        } ? T_1 extends {
          src: TSrc;
        } ? xstate54.ConditionalRequired<[options?: ({
          id?: T_1["id"] | undefined;
          systemId?: string;
          input?: xstate54.InputFrom<T_1["logic"]> | undefined;
          syncSnapshot?: boolean;
        } & { [K in xstate54.RequiredActorOptions<T_1>]: unknown }) | undefined], xstate54.IsNotNever<xstate54.RequiredActorOptions<T_1>>> : never : never : never): xstate54.ActorRefFromLogic<xstate54.GetConcreteByKey<{
          src: "listen";
          logic: xstate54.ObservableActorLogic<MessageEvent<ProtocolMessage$1<_sanity_comlink19.ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate54.EventObject>;
          id: "listen for response";
        }, "src", TSrc>["logic"]>;
        <TLogic extends xstate54.AnyActorLogic>(src: TLogic, ...[options]: xstate54.ConditionalRequired<[options?: ({
          id?: never;
          systemId?: string;
          input?: xstate54.InputFrom<TLogic> | undefined;
          syncSnapshot?: boolean;
        } & { [K in xstate54.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate54.IsNotNever<xstate54.RequiredLogicInput<TLogic>>>): xstate54.ActorRefFromLogic<TLogic>;
      };
      input: {
        channelId: string;
        data?: T["data"];
        domain: string;
        expectResponse?: boolean;
        from: string;
        parentRef: xstate54.AnyActorRef;
        resolvable?: PromiseWithResolvers<T["response"]>;
        responseTimeout?: number;
        responseTo?: string;
        signal?: AbortSignal;
        sources: Set<MessageEventSource> | MessageEventSource;
        suppressWarnings?: boolean;
        targetOrigin: string;
        to: string;
        type: T["type"];
      };
      self: xstate54.ActorRef<xstate54.MachineSnapshot<RequestMachineContext$1<T>, {
        type: "message";
        data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
      } | {
        type: "abort";
      }, Record<string, xstate54.AnyActorRef | undefined>, xstate54.StateValue, string, unknown, any, any>, {
        type: "message";
        data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
      } | {
        type: "abort";
      }, xstate54.AnyEventObject>;
    }) => {
      channelId: string;
      data: T["data"] | undefined;
      domain: string;
      expectResponse: boolean;
      from: string;
      id: string;
      parentRef: xstate54.AnyActorRef;
      resolvable: PromiseWithResolvers<T["response"]> | undefined;
      response: null;
      responseTimeout: number | undefined;
      responseTo: string | undefined;
      signal: AbortSignal | undefined;
      sources: Set<MessageEventSource>;
      suppressWarnings: boolean | undefined;
      targetOrigin: string;
      to: string;
      type: T["type"];
    };
    readonly initial: "idle";
    readonly on: {
      readonly abort: ".aborted";
    };
    readonly states: {
      readonly idle: {
        readonly after: {
          readonly initialTimeout: readonly [{
            readonly target: "sending";
          }];
        };
      };
      readonly sending: {
        readonly entry: {
          readonly type: "send message";
          readonly params: ({
            context
          }: {
            context: RequestMachineContext$1<T>;
            event: {
              type: "message";
              data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
            } | {
              type: "abort";
            };
          }) => {
            message: {
              channelId: string;
              data: _sanity_comlink19.MessageData;
              domain: string;
              from: string;
              id: string;
              to: string;
              type: string;
              responseTo: string | undefined;
            };
          };
        };
        readonly always: readonly [{
          readonly guard: "expectsResponse";
          readonly target: "awaiting";
        }, "success"];
      };
      readonly awaiting: {
        readonly invoke: {
          readonly id: "listen for response";
          readonly src: "listen";
          readonly input: ({
            context
          }: {
            context: RequestMachineContext$1<T>;
            event: {
              type: "message";
              data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
            } | {
              type: "abort";
            };
            self: xstate54.ActorRef<xstate54.MachineSnapshot<RequestMachineContext$1<T>, {
              type: "message";
              data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate54.AnyActorRef>, xstate54.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
            } | {
              type: "abort";
            }, xstate54.AnyEventObject>;
          }) => {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal: AbortSignal | undefined;
          };
          readonly onError: "aborted";
        };
        readonly after: {
          readonly responseTimeout: "failed";
        };
        readonly on: {
          readonly message: {
            readonly actions: xstate54.ActionFunction<RequestMachineContext$1<T>, {
              type: "message";
              data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
            }, {
              type: "message";
              data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
            } | {
              type: "abort";
            }, undefined, {
              src: "listen";
              logic: xstate54.ObservableActorLogic<MessageEvent<ProtocolMessage$1<_sanity_comlink19.ResponseMessage>>, {
                requestId: string;
                sources: Set<MessageEventSource>;
                signal?: AbortSignal;
              }, xstate54.EventObject>;
              id: "listen for response";
            }, never, never, never, never>;
            readonly target: "success";
          };
        };
      };
      readonly failed: {
        readonly type: "final";
        readonly entry: "on fail";
      };
      readonly success: {
        readonly type: "final";
        readonly entry: "on success";
      };
      readonly aborted: {
        readonly type: "final";
        readonly entry: "on abort";
      };
    };
    readonly output: ({
      context,
      self
    }: {
      context: RequestMachineContext$1<T>;
      event: xstate54.DoneStateEvent<unknown>;
      self: xstate54.ActorRef<xstate54.MachineSnapshot<RequestMachineContext$1<T>, {
        type: "message";
        data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
      } | {
        type: "abort";
      }, Record<string, xstate54.AnyActorRef>, xstate54.StateValue, string, unknown, any, any>, {
        type: "message";
        data: ProtocolMessage$1<_sanity_comlink19.ResponseMessage>;
      } | {
        type: "abort";
      }, xstate54.AnyEventObject>;
    }) => {
      requestId: string;
      response: T["response"] | null;
      responseTo: string | undefined;
    };
  }>;
};
declare function isMaybePreviewIframe(): boolean;
declare function isMaybePreviewWindow(): boolean;
declare function isMaybePresentation(): boolean;
/**
 * Used to tag types that is set to `any` as a temporary measure, but should be replaced with proper typings in the future
 * @internal
 */
declare type Any = any;
/** @public */
declare type ClientPerspective = DeprecatedPreviewDrafts | 'published' | 'drafts' | 'raw' | StackablePerspective[];
/** @public */
declare interface ContentSourceMap {
  mappings: ContentSourceMapMappings;
  documents: ContentSourceMapDocuments;
  paths: ContentSourceMapPaths;
}
/** @public */
declare interface ContentSourceMapDocument extends ContentSourceMapDocumentBase {
  _projectId?: undefined;
  _dataset?: undefined;
}
/** @public */
declare interface ContentSourceMapDocumentBase {
  _id: string;
  _type: string;
}
/** @public */
declare type ContentSourceMapDocuments = (ContentSourceMapDocument | ContentSourceMapRemoteDocument)[];
/**
 * DocumentValueSource is a path to a value within a document
 * @public
 */
declare interface ContentSourceMapDocumentValueSource {
  type: 'documentValue';
  document: number;
  path: number;
}
/**
 * When a value is not from a source, its a literal
 * @public
 */
declare interface ContentSourceMapLiteralSource {
  type: 'literal';
}
/** @public */
declare type ContentSourceMapMapping = ContentSourceMapValueMapping;
/** @public */
declare type ContentSourceMapMappings = Record<string, ContentSourceMapMapping>;
/** @public */
declare type ContentSourceMapPaths = string[];
/** @public */
declare interface ContentSourceMapRemoteDocument extends ContentSourceMapDocumentBase {
  _projectId: string;
  _dataset: string;
}
/** @public */
declare type ContentSourceMapSource = ContentSourceMapDocumentValueSource | ContentSourceMapLiteralSource | ContentSourceMapUnknownSource;
/**
 * When a field source is unknown
 * @public
 */
declare interface ContentSourceMapUnknownSource {
  type: 'unknown';
}
/**
 * ValueMapping is a mapping when for value that is from a single source value
 * It may refer to a field within a document or a literal value
 * @public
 */
declare interface ContentSourceMapValueMapping {
  type: 'value';
  source: ContentSourceMapSource;
}
/**
 * @deprecated use 'drafts' instead
 */
declare type DeprecatedPreviewDrafts = 'previewDrafts';

/**
 * Delete the draft version of a document.
 * It is an error if it does not exist. If the purge flag is set, the document history is also deleted.
 *
 * @public
 * @deprecated Use {@link DiscardVersionAction} instead
 */

/** @public */
declare type IdentifiedSanityDocumentStub<T extends Record<string, Any> = Record<string, Any>> = { [P in keyof T]: T[P] } & {
  _id: string;
} & SanityDocumentStub;
/** @internal */
declare type InsertPatch = {
  before: string;
  items: Any[];
} | {
  after: string;
  items: Any[];
} | {
  replace: string;
  items: Any[];
};
/** @public */
declare type Mutation<R extends Record<string, Any> = Record<string, Any>> = {
  create: SanityDocumentStub<R>;
} | {
  createOrReplace: IdentifiedSanityDocumentStub<R>;
} | {
  createIfNotExists: IdentifiedSanityDocumentStub<R>;
} | {
  delete: MutationSelection;
} | {
  patch: PatchMutationOperation;
};
/**
 * A mutation was performed. Note that when updating multiple documents in a transaction,
 * each document affected will get a separate mutation event.
 *
 * @public
 */
declare type MutationEvent<R extends Record<string, Any> = Record<string, Any>> = {
  type: 'mutation';
  /**
   * The ID of the document that was affected
   */
  documentId: string;
  /**
   * A unique ID for this event
   */
  eventId: string;
  /**
   * The user ID of the user that performed the mutation
   */
  identity: string;
  /**
   * An array of mutations that were performed. Note that this can differ slightly from the
   * mutations sent to the server, as the server may perform some mutations automatically.
   */
  mutations: Mutation[];
  /**
   * The revision ID of the document before the mutation was performed
   */
  previousRev?: string;
  /**
   * The revision ID of the document after the mutation was performed
   */
  resultRev?: string;
  /**
   * The document as it looked after the mutation was performed. This is only included if
   * the listener was configured with `includeResult: true`.
   */
  result?: SanityDocument<R>;
  /**
   * The document as it looked before the mutation was performed. This is only included if
   * the listener was configured with `includePreviousRevision: true`.
   */
  previous?: SanityDocument<R> | null;
  /**
   * The effects of the mutation, if the listener was configured with `effectFormat: 'mendoza'`.
   * Object with `apply` and `revert` arrays, see {@link https://github.com/sanity-io/mendoza}.
   */
  effects?: {
    apply: unknown[];
    revert: unknown[];
  };
  /**
   * A timestamp for when the mutation was performed
   */
  timestamp: string;
  /**
   * The transaction ID for the mutation
   */
  transactionId: string;
  /**
   * The type of transition the document went through.
   *
   * - `update` means the document was previously part of the subscribed set of documents,
   *   and still is.
   * - `appear` means the document was not previously part of the subscribed set of documents,
   *   but is now. This can happen both on create or if updating to a state where it now matches
   *   the filter provided to the listener.
   * - `disappear` means the document was previously part of the subscribed set of documents,
   *   but is no longer. This can happen both on delete or if updating to a state where it no
   *   longer matches the filter provided to the listener.
   */
  transition: 'update' | 'appear' | 'disappear';
  /**
   * Whether the change that triggered this event is visible to queries (query) or only to
   * subsequent transactions (transaction). The listener client can specify a preferred visibility
   * through the `visibility` parameter on the listener, but this is only on a best-effort basis,
   * and may yet not be accurate.
   */
  visibility: 'query' | 'transaction';
  /**
   * The total number of events that will be sent for this transaction.
   * Note that this may differ from the amount of _documents_ affected by the transaction, as this
   * number only includes the documents that matches the given filter.
   *
   * This can be useful if you need to perform changes to all matched documents atomically,
   * eg you would wait for `transactionTotalEvents` events with the same `transactionId` before
   * applying the changes locally.
   */
  transactionTotalEvents: number;
  /**
   * The index of this event within the transaction. Note that events may be delivered out of order,
   * and that the index is zero-based.
   */
  transactionCurrentEvent: number;
};
/** @internal */
declare type MutationSelection = {
  query: string;
  params?: MutationSelectionQueryParams;
} | {
  id: string | string[];
};
/** @internal */
declare type MutationSelectionQueryParams = {
  [key: string]: Any;
};
/** @internal */
declare type PatchMutationOperation = PatchOperations & MutationSelection;
/** @internal */
declare interface PatchOperations {
  set?: {
    [key: string]: Any;
  };
  setIfMissing?: {
    [key: string]: Any;
  };
  diffMatchPatch?: {
    [key: string]: Any;
  };
  unset?: string[];
  inc?: {
    [key: string]: number;
  };
  dec?: {
    [key: string]: number;
  };
  insert?: InsertPatch;
  ifRevisionID?: string;
}
/** @public */
declare interface QueryParams {
  [key: string]: any;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  body?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  cache?: 'next' extends keyof RequestInit ? never : any;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  filterResponse?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  headers?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  method?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  next?: 'next' extends keyof RequestInit ? never : any;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  perspective?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  query?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  resultSourceMap?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  returnQuery?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  signal?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  stega?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  tag?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  timeout?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  token?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  useCdn?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  lastLiveEventId?: never;
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  cacheMode?: never;
}
/**
 * The listener has been disconnected, and a reconnect attempt is scheduled.
 *
 * @public
 */
declare type ReconnectEvent = {
  type: 'reconnect';
};
/** @internal */
declare type SanityDocument<T extends Record<string, Any> = Record<string, Any>> = { [P in keyof T]: T[P] } & {
  _id: string;
  _rev: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  /**
   * Present when `perspective` is set to `previewDrafts`
   */
  _originalId?: string;
};
/** @public */
declare type SanityDocumentStub<T extends Record<string, Any> = Record<string, Any>> = { [P in keyof T]: T[P] } & {
  _type: string;
};
/** @public */
declare type StackablePerspective = ('published' | 'drafts' | string) & {};
/** @public */
declare type SyncTag = `s1:${string}`;
/**
 * The listener has been established, and will start receiving events.
 * Note that this is also emitted upon _reconnection_.
 *
 * @public
 */
declare type WelcomeEvent = {
  type: 'welcome';
  listenerName: string;
};
/**
 * Preview frame history update
 * @public
 */
type HistoryUpdate = {
  type: 'push' | 'pop' | 'replace';
  title?: string;
  url: string;
};
/**
 * Preview frame history refresh event, emitted by Presentation Tool
 * @public
 */
type HistoryRefresh = {
  /**
   * source 'manual' means the refresh button were clicked by the user
   */
  source: 'manual';
  /**
   * If true then there's either preview-kit or a loader connected on the page
   */
  livePreviewEnabled: boolean;
} | {
  /**
   * source 'mutation' means a document were mutated and the preview might need to refresh
   */
  source: 'mutation';
  /**
   * If true then there's either preview-kit or a loader connected on the page
   */
  livePreviewEnabled: boolean;
  /**
   * Select metadata about the document that were mutated
   * If it's prefixed with `drafts.` then it's a draft document, otherwise it's a published document.
   */
  document: {
    /**
     * If it's prefixed with `drafts.` then it's a draft document, otherwise it's a published document.
     */
    _id: string;
    /**
     * The document type is frequently used in `revalidateTag` scenarios with Next.js App Router
     */
    _type: string;
    /**
     * The document revision, can be used to dedupe requests, as we always send two due to debouncing and handling Content Lake eventual consistency
     */
    _rev: string;
    /**
     * If the document has a top level slug field named `slug` with the type `slug`, then it'll be included here
     */
    slug?: {
      current?: string | null;
    };
  };
};
/**
 * @public
 */
type VisualEditingControllerMsg = {
  type: 'presentation/focus';
  data: {
    id: string;
    path: string;
  };
} | {
  type: 'presentation/blur';
  data: undefined;
} | {
  type: 'presentation/navigate';
  data: HistoryUpdate;
} | {
  type: 'presentation/toggle-overlay';
  data: undefined;
} | {
  type: 'presentation/refresh';
  data: HistoryRefresh;
} | {
  type: 'presentation/perspective';
  data: {
    perspective: ClientPerspective;
  };
}
/**
 * @deprecated switch to explict schema fetching (using
 * 'visual-editing/schema') at next major
 */ | {
  type: 'presentation/schema';
  data: {
    schema: SchemaType$1[];
  };
} | {
  type: 'presentation/preview-snapshots';
  data: {
    snapshots: PreviewSnapshot$1[];
  };
} | {
  type: 'presentation/snapshot-event';
  data: {
    event: ReconnectEvent | WelcomeEvent | MutationEvent;
  };
} | {
  type: 'presentation/shared-state';
  data: {
    key: string;
    value?: Serializable;
  };
} | {
  /**
   * Special event where Presentation Tool is unable to connect to a target iframe or popup window, and is asking for status with `targetOrigin: *` to detect
   * if the URL origin is misconfigured. Presentation doesn't send any data, as any listener can see it.
   */
  type: 'presentation/status';
  data: undefined;
};
/**
 * @public
 */
type VisualEditingNodeMsg = {
  type: 'visual-editing/focus';
  data: SanityNode$1 | SanityStegaNode$1;
} | {
  type: 'overlay/focus';
  data: SanityNode$1 | SanityStegaNode$1;
} | {
  type: 'visual-editing/navigate';
  data: HistoryUpdate;
} | {
  type: 'overlay/navigate';
  data: HistoryUpdate;
} | {
  type: 'visual-editing/toggle';
  data: {
    enabled: boolean;
  };
} | {
  type: 'overlay/toggle';
  data: {
    enabled: boolean;
  };
} | {
  type: 'visual-editing/meta';
  data: {
    title: string;
  };
} | {
  type: 'visual-editing/documents';
  data: {
    projectId?: string;
    dataset?: string;
    perspective: ClientPerspective;
    documents: ContentSourceMapDocuments;
  };
} | {
  type: 'visual-editing/preview-snapshots';
  data: undefined;
  response: {
    snapshots: PreviewSnapshot$1[];
  };
} | {
  type: 'visual-editing/refreshing';
  data: HistoryRefresh;
} | {
  type: 'visual-editing/refreshed';
  data: HistoryRefresh;
} | {
  type: 'visual-editing/schema';
  data: undefined;
  response: {
    schema: SchemaType$1[];
  };
} | {
  type: 'visual-editing/schema-union-types';
  data: {
    paths: UnresolvedPath$1[];
  };
  response: {
    types: ResolvedSchemaTypeMap$1;
  };
} | {
  type: 'visual-editing/observe-documents';
  data: {
    documentIds: string[];
  };
} | {
  type: 'visual-editing/fetch-snapshot';
  data: {
    documentId: string;
  };
  response: {
    snapshot: SanityDocument<Record<string, any>> | undefined | void;
  };
} | {
  type: 'visual-editing/mutate';
  data: {
    transactionId: string | undefined;
    mutations: any[];
  };
  response: any;
} | {
  type: 'visual-editing/snapshot-welcome';
  data: undefined;
  response: {
    event: WelcomeEvent;
  };
} | {
  type: 'visual-editing/fetch-perspective';
  data: undefined;
  response: {
    perspective: ClientPerspective;
  };
} | {
  type: 'visual-editing/features';
  data: undefined;
  response: {
    features: Record<string, boolean>;
  };
} | {
  type: 'visual-editing/shared-state';
  data: undefined;
  response: {
    state: SerializableObject;
  };
} | {
  type: 'visual-editing/telemetry-log';
  data: {
    event: any;
    data: any;
  };
} | {
  /**
   * Special event related to the `presentation/status` event, where comlink is unable to connect,
   * and we're asking for some status information to detect if the URL origin is misconfigured.
   */
  type: 'visual-editing/status';
  data: {
    origin: string;
  };
};
/**
 * @public
 */
type LoaderControllerMsg = {
  type: 'loader/perspective';
  data: {
    projectId: string;
    dataset: string;
    perspective: ClientPerspective;
  };
} | {
  type: 'loader/query-change';
  data: {
    projectId: string;
    dataset: string;
    perspective: ClientPerspective;
    query: string;
    params: QueryParams;
    result: any;
    resultSourceMap?: ContentSourceMap;
    tags?: SyncTag[];
  };
};
/**
 * @public
 */
type LoaderNodeMsg = {
  type: 'loader/query-listen';
  data: {
    projectId: string;
    dataset: string;
    perspective: ClientPerspective;
    query: string;
    params: QueryParams;
    /**
     * If above 0, then the loader will fire listen events on a heartbeat interval,
     * allowing Presentation Tool to detect when it's no longer necessary to subscribe to a query.
     */
    heartbeat?: number;
  };
} | {
  /**
   * Sends over the CSM reported documents in use on the page. If there are multiple queries and thus
   * multiple CSM's, they're all deduped and concatenated into a single list.
   */
  type: 'loader/documents';
  data: {
    projectId: string;
    dataset: string;
    perspective: ClientPerspective;
    documents: ContentSourceMapDocuments;
  };
};
/**
 * @public
 */
type PreviewKitNodeMsg = {
  /**
   * Sends over the CSM reported documents in use on the page. If there are multiple queries and thus
   * multiple CSM's, they're all deduped and concatenated into a single list.
   */
  type: 'preview-kit/documents';
  data: {
    projectId: string;
    dataset: string;
    perspective: ClientPerspective;
    documents: ContentSourceMapDocuments;
  };
};
/**
 * @public
 */
type SerializablePrimitive = string | number | boolean | null | undefined;
/**
 * @public
 */
type SerializableObject = {
  [key: string]: Serializable;
};
/**
 * @public
 */
type SerializableArray = Serializable[];
/**
 * @public
 */
type Serializable = SerializablePrimitive | SerializableObject | SerializableArray;
export { type DocumentSchema, HistoryRefresh, HistoryUpdate, type InsertMenuOptions, type ListenInput, LoaderControllerMsg, LoaderNodeMsg, MSG_RESPONSE, type Message, type MessageData, type MessageType, type Path, PreviewKitNodeMsg, type PreviewSnapshot, type ProtocolMessage, type RequestMachineContext, type ResolvedSchemaTypeMap, type ResponseMessage, type SanityNode, type SanityStegaNode, type SchemaArrayItem, type SchemaArrayNode, type SchemaBooleanNode, type SchemaInlineNode, type SchemaNode, type SchemaNullNode, type SchemaNumberNode, type SchemaObjectField, type SchemaObjectNode, type SchemaStringNode, type SchemaType, type SchemaUnionNode, type SchemaUnionNodeOptions, type SchemaUnionOption, type SchemaUnknownNode, Serializable, SerializableArray, SerializableObject, SerializablePrimitive, type TypeSchema, type UnresolvedPath, VisualEditingControllerMsg, VisualEditingNodeMsg, createCompatibilityActors, isMaybePresentation, isMaybePreviewIframe, isMaybePreviewWindow };
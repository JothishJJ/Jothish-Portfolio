import * as _sanity_client12 from "@sanity/client";
import { ClientConfig, ClientPerspective, ListenEvent, ResponseQueryOptions, SanityClient, SanityDocument as SanityDocument$1, SanityProject as SanityProject$1, StackablePerspective } from "@sanity/client";
import { Observable, Subject } from "rxjs";
import { CurrentUser, CurrentUser as CurrentUser$1, Mutation, PatchOperations, Role, SanityDocument, SanityDocument as SanityDocument$2, SanityDocumentLike } from "@sanity/types";
import * as _sanity_comlink3 from "@sanity/comlink";
import { ChannelInput, ChannelInstance, Controller, Message, Node, NodeInput, Status } from "@sanity/comlink";
import { PatchMutation } from "@sanity/mutate/_unstable_store";
import { SanityDocument as SanityDocument$3, SanityProjectionResult, SanityQueryResult } from "groq";
import { CanvasResource, MediaResource, StudioResource } from "@sanity/message-protocol";
import { getIndexForKey, getPathDepth, joinPaths, jsonMatch, slicePath, stringifyPath } from "@sanity/json-match";
/**
 * Represents the various states the authentication type can be in.
 *
 * @public
 */
declare enum AuthStateType {
  LOGGED_IN = "logged-in",
  LOGGING_IN = "logging-in",
  ERROR = "error",
  LOGGED_OUT = "logged-out",
}
/**
 * Configuration for an authentication provider
 * @public
 */
interface AuthProvider {
  /**
   * Unique identifier for the auth provider (e.g., 'google', 'github')
   */
  name: string;
  /**
   * Display name for the auth provider in the UI
   */
  title: string;
  /**
   * Complete authentication URL including callback and token parameters
   */
  url: string;
  /**
   * Optional URL for direct sign-up flow
   */
  signUpUrl?: string;
}
/**
 * Configuration options for creating an auth store.
 *
 * @public
 */
interface AuthConfig {
  /**
   * The initial location href to use when handling auth callbacks.
   * Defaults to the current window location if available.
   */
  initialLocationHref?: string;
  /**
   * Factory function to create a SanityClient instance.
   * Defaults to the standard Sanity client factory if not provided.
   */
  clientFactory?: (config: ClientConfig) => SanityClient;
  /**
   * Custom authentication providers to use instead of or in addition to the default ones.
   * Can be an array of providers or a function that takes the default providers and returns
   * a modified array or a Promise resolving to one.
   */
  providers?: AuthProvider[] | ((prev: AuthProvider[]) => AuthProvider[] | Promise<AuthProvider[]>);
  /**
   * The API hostname for requests. Usually leave this undefined, but it can be set
   * if using a custom domain or CNAME for the API endpoint.
   */
  apiHost?: string;
  /**
   * Storage implementation to persist authentication state.
   * Defaults to `localStorage` if available.
   */
  storageArea?: Storage;
  /**
   * A callback URL for your application.
   * If none is provided, the auth API will redirect back to the current location (`location.href`).
   * When handling callbacks, this URL's pathname is checked to ensure it matches the callback.
   */
  callbackUrl?: string;
  /**
   * A static authentication token to use instead of handling the OAuth flow.
   * When provided, the auth store will remain in a logged-in state with this token,
   * ignoring any storage or callback handling.
   */
  token?: string;
}
/**
 * Represents the minimal configuration required to identify a Sanity project.
 * @public
 */
interface ProjectHandle<TProjectId extends string = string> {
  projectId?: TProjectId;
}
/**
 * @public
 */
type ReleasePerspective = {
  releaseName: string;
  excludedPerspectives?: StackablePerspective[];
};
/**
 * @public
 */
interface PerspectiveHandle {
  perspective?: ClientPerspective | ReleasePerspective;
}
/**
 * @public
 */
interface DatasetHandle<TDataset extends string = string, TProjectId extends string = string> extends ProjectHandle<TProjectId>, PerspectiveHandle {
  dataset?: TDataset;
}
/**
 * Identifies a specific document type within a Sanity dataset and project.
 * Includes `projectId`, `dataset`, and `documentType`.
 * Optionally includes a `documentId`, useful for referencing a specific document type context, potentially without a specific document ID.
 * @public
 */
interface DocumentTypeHandle<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DatasetHandle<TDataset, TProjectId> {
  documentId?: string;
  documentType: TDocumentType;
}
/**
 * Uniquely identifies a specific document within a Sanity dataset and project.
 * Includes `projectId`, `dataset`, `documentType`, and the required `documentId`.
 * Commonly used by document-related hooks and components to reference a document without fetching its full content initially.
 * @public
 */
interface DocumentHandle<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentTypeHandle<TDocumentType, TDataset, TProjectId> {
  documentId: string;
}
/**
 * Represents the complete configuration for a Sanity SDK instance
 * @public
 */
interface SanityConfig extends DatasetHandle, PerspectiveHandle {
  /**
   * Authentication configuration for the instance
   * @remarks Merged with parent configurations when using createChild
   */
  auth?: AuthConfig;
  /**
   * Studio mode configuration for use of the SDK in a Sanity Studio
   * @remarks Controls whether studio mode features are enabled
   */
  studioMode?: {
    enabled: boolean;
  };
}
/**
 * Represents a Sanity.io resource instance with its own configuration and lifecycle
 * @remarks Instances form a hierarchy through parent/child relationships
 *
 * @public
 */
interface SanityInstance {
  /**
   * Unique identifier for this instance
   * @remarks Generated using crypto.randomUUID()
   */
  readonly instanceId: string;
  /**
   * Resolved configuration for this instance
   * @remarks Merges values from parent instances where appropriate
   */
  readonly config: SanityConfig;
  /**
   * Checks if the instance has been disposed
   * @returns true if dispose() has been called
   */
  isDisposed(): boolean;
  /**
   * Disposes the instance and cleans up associated resources
   * @remarks Triggers all registered onDispose callbacks
   */
  dispose(): void;
  /**
   * Registers a callback to be invoked when the instance is disposed
   * @param cb - Callback to execute on disposal
   * @returns Function to unsubscribe the callback
   */
  onDispose(cb: () => void): () => void;
  /**
   * Gets the parent instance in the hierarchy
   * @returns Parent instance or undefined if this is the root
   */
  getParent(): SanityInstance | undefined;
  /**
   * Creates a child instance with merged configuration
   * @param config - Configuration to merge with parent values
   * @remarks Child instances inherit parent configuration but can override values
   */
  createChild(config: SanityConfig): SanityInstance;
  /**
   * Traverses the instance hierarchy to find the first instance whose configuration
   * matches the given target config using a shallow comparison.
   * @param targetConfig - A partial configuration object containing key-value pairs to match.
   * @returns The first matching instance or undefined if no match is found.
   */
  match(targetConfig: Partial<SanityConfig>): SanityInstance | undefined;
}
/**
 * Creates a new Sanity resource instance
 * @param config - Configuration for the instance (optional)
 * @returns A configured SanityInstance
 * @remarks When creating child instances, configurations are merged with parent values
 *
 * @public
 */
declare function createSanityInstance(config?: SanityConfig): SanityInstance;
/**
 * Represents a store action that has been bound to a specific store instance
 */
type BoundStoreAction<_TState, TParams extends unknown[], TReturn> = (instance: SanityInstance, ...params: TParams) => TReturn;
/**
 * Creates an action binder function that uses the provided key function
 * to determine how store instances are shared between Sanity instances
 *
 * @param keyFn - Function that generates a key from a Sanity config
 * @returns A function that binds store actions to Sanity instances
 *
 * @remarks
 * Action binders determine how store instances are shared across multiple
 * Sanity instances. The key function determines which instances share state.
 *
 * @example
 * ```ts
 * // Create a custom binder that uses a tenant ID for isolation
 * const bindActionByTenant = createActionBinder(config => config.tenantId || 'default')
 *
 * // Use the custom binder with a store definition
 * const getTenantUsers = bindActionByTenant(
 *   userStore,
 *   ({state}) => state.get().users
 * )
 * ```
 */
/**
 * Represents the various states the authentication can be in.
 *
 * @public
 */
type AuthState = LoggedInAuthState | LoggedOutAuthState | LoggingInAuthState | ErrorAuthState;
/**
 * Logged-in state from the auth state.
 * @public
 */
type LoggedInAuthState = {
  type: AuthStateType.LOGGED_IN;
  token: string;
  currentUser: CurrentUser$1 | null;
  lastTokenRefresh?: number;
};
/**
 * Logged-out state from the auth state.
 * @public
 */
type LoggedOutAuthState = {
  type: AuthStateType.LOGGED_OUT;
  isDestroyingSession: boolean;
};
/**
 * Logging-in state from the auth state.
 * @public
 */
type LoggingInAuthState = {
  type: AuthStateType.LOGGING_IN;
  isExchangingToken: boolean;
};
/**
 * Error state from the auth state.
 * @public
 */
type ErrorAuthState = {
  type: AuthStateType.ERROR;
  error: unknown;
};
/**
 * Represents the various states the authentication can be in.
 *
 * @public
 */
interface DashboardContext {
  mode?: string;
  env?: string;
  orgId?: string;
}
type AuthMethodOptions = 'localstorage' | 'cookie' | undefined;
/**
 * @public
 */
interface AuthStoreState {
  authState: AuthState;
  providers?: AuthProvider[];
  options: {
    initialLocationHref: string;
    clientFactory: (config: ClientConfig) => SanityClient;
    customProviders: AuthConfig['providers'];
    storageKey: string;
    storageArea: Storage | undefined;
    apiHost: string | undefined;
    loginUrl: string;
    callbackUrl: string | undefined;
    providedToken: string | undefined;
    authMethod: AuthMethodOptions;
  };
  dashboardContext?: DashboardContext;
}
/**
 * @public
 */
declare const getCurrentUserState: BoundStoreAction<AuthStoreState, [], StateSource<CurrentUser$1 | null>>;
/**
 * @public
 */
declare const getTokenState: BoundStoreAction<AuthStoreState, [], StateSource<string | null>>;
/**
 * @internal
 */

/**
 * @public
 */
declare const getLoginUrlState: BoundStoreAction<AuthStoreState, [], StateSource<string>>;
/**
 * @public
 */
declare const getAuthState: BoundStoreAction<AuthStoreState, [], StateSource<AuthState>>;
/**
 * @public
 */
declare const getDashboardOrganizationId: BoundStoreAction<AuthStoreState, [], StateSource<string | undefined>>;
/**
 * Returns a state source indicating if the SDK is running within a dashboard context.
 * @public
 */
declare const getIsInDashboardState: BoundStoreAction<AuthStoreState, [], StateSource<boolean>>;
/**
 * Action to explicitly set the authentication token.
 * Used internally by the Comlink token refresh.
 * @internal
 */
declare const setAuthToken: BoundStoreAction<AuthStoreState, [token: string | null], void>;
/**
 * Error message returned by the organization verification
 * @public
 */
interface OrgVerificationResult {
  error: string | null;
}
/**
 * Compares a project's actual organization ID with the expected organization ID.
 * @public
 */
/**
 * Creates an observable that emits the organization verification state for a given instance.
 * It combines the dashboard organization ID (from auth context) with the
 * project's actual organization ID (fetched via getProjectState) and compares them.
 * @public
 */
declare function observeOrganizationVerificationState(instance: SanityInstance, projectIds: string[]): Observable<OrgVerificationResult>;
/**
 * @public
 */
declare const handleAuthCallback: BoundStoreAction<AuthStoreState, [locationHref?: string | undefined], Promise<string | false>>;
/**
 * @public
 */
declare const logout: BoundStoreAction<AuthStoreState, [], Promise<void>>;
type AllowedClientConfigKey = 'useCdn' | 'token' | 'perspective' | 'apiHost' | 'proxy' | 'withCredentials' | 'timeout' | 'maxRetries' | 'dataset' | 'projectId' | 'requestTagPrefix' | 'useProjectHostname';
/**
 * States tracked by the client store
 * @public
 */
interface ClientStoreState {
  token: string | null;
  clients: { [TKey in string]?: SanityClient };
  authMethod?: 'localstorage' | 'cookie';
}
/**
 * Options used when retrieving a client instance from the client store.
 *
 * This interface extends the base {@link ClientConfig} and adds:
 *
 * - **apiVersion:** A required string indicating the API version for the client.
 * - **scope:** An optional flag to choose between the project-specific client
 *   ('project') and the global client ('global'). When set to `'global'`, the
 *   global client is used.
 *
 * These options are utilized by `getClient` and `getClientState` to configure and
 * return appropriate client instances that automatically handle authentication
 * updates and configuration changes.
 *
 * @public
 */
interface ClientOptions extends Pick<ClientConfig, AllowedClientConfigKey> {
  /**
   * An optional flag to choose between the default client (typically project-level)
   * and the global client ('global'). When set to `'global'`, the global client
   * is used.
   */
  'scope'?: 'default' | 'global';
  /**
   * A required string indicating the API version for the client.
   */
  'apiVersion': string;
  /**
   * @internal
   */
  '~experimental_resource'?: ClientConfig['~experimental_resource'];
}
/**
 * Retrieves a Sanity client instance configured with the provided options.
 *
 * This function returns a client instance configured for the project or as a
 * global client based on the options provided. It ensures efficient reuse of
 * client instances by returning the same instance for the same options.
 * For automatic handling of authentication token updates, consider using
 * `getClientState`.
 *
 * @public
 */
declare const getClient: BoundStoreAction<ClientStoreState, [options: ClientOptions], SanityClient>;
/**
 * Returns a state source for the Sanity client instance.
 *
 * This function provides a subscribable state source that emits updated client
 * instances whenever relevant configurations change (such as authentication tokens).
 * Use this when you need to react to client configuration changes in your application.
 *
 * @public
 */
declare const getClientState: BoundStoreAction<ClientStoreState, [options: ClientOptions], StateSource<SanityClient>>;
/**
 * Message sent from a containing app to an iframe
 * @public
 */
type FrameMessage = Message;
/**
 * Message sent from an iframe to a containing app
 * @public
 */
type WindowMessage = Message;
/**
 * Message from SDK (iframe) to Parent (dashboard) to request a new token
 * @internal
 */
type RequestNewTokenMessage = {
  type: 'dashboard/v1/auth/tokens/create';
  payload?: undefined;
};
/**
 * Message from Parent (dashboard) to SDK (iframe) with the new token
 * @internal
 */
type NewTokenResponseMessage = {
  type: 'dashboard/v1/auth/tokens/create';
  payload: {
    token: string | null;
    error?: string;
  };
};
/**
 * Individual channel with its relevant options
 * @public
 */
interface ChannelEntry {
  channel: ChannelInstance<FrameMessage, WindowMessage>;
  options: ChannelInput;
  refCount: number;
}
/**
 * Internal state tracking comlink connections
 * @public
 */
interface ComlinkControllerState {
  controller: Controller | null;
  controllerOrigin: string | null;
  channels: Map<string, ChannelEntry>;
}
/**
 * Calls the destroy method on the controller and resets the controller state.
 * @public
 */
declare const destroyController: BoundStoreAction<ComlinkControllerState, [], void>;
/**
 * Retrieve or create a channel to be used for communication between
 * an application and the controller.
 * @public
 */
declare const getOrCreateChannel: BoundStoreAction<ComlinkControllerState, [options: ChannelInput], ChannelInstance<_sanity_comlink3.Message, _sanity_comlink3.Message>>;
/**
 * Initializes or fetches a controller to handle communication
 * between an application and iframes.
 * @public
 */
declare const getOrCreateController: BoundStoreAction<ComlinkControllerState, [targetOrigin: string], Controller>;
/**
 * Signals to the store that the consumer has stopped using the channel
 * @public
 */
declare const releaseChannel: BoundStoreAction<ComlinkControllerState, [name: string], void>;
/**
 * Individual node with its relevant options
 * @public
 */
interface NodeEntry {
  node: Node<WindowMessage, FrameMessage>;
  options: NodeInput;
  status: Status;
  statusUnsub?: () => void;
}
/**
 * Internal state tracking comlink connections
 * @public
 */
interface ComlinkNodeState {
  nodes: Map<string, NodeEntry>;
  subscriptions: Map<string, Set<symbol>>;
}
/**
 * Signals to the store that the consumer has stopped using the node
 * @public
 */
declare const releaseNode: BoundStoreAction<ComlinkNodeState, [name: string], void>;
/**
 * Retrieve or create a node to be used for communication between
 * an application and the controller -- specifically, a node should
 * be created within a frame / window to communicate with the controller.
 * @public
 */
declare const getOrCreateNode: BoundStoreAction<ComlinkNodeState, [options: NodeInput], Node<_sanity_comlink3.Message, _sanity_comlink3.Message>>;
/**
 * @public
 */
interface NodeState {
  node: Node<WindowMessage, FrameMessage>;
  status: Status | undefined;
}
/**
 * Provides a subscribable state source for a node by name
 * @param instance - The Sanity instance to get the node state for
 * @param nodeInput - The configuration for the node to get the state for

 * @returns A subscribable state source for the node
 * @public
 */
declare const getNodeState: BoundStoreAction<ComlinkNodeState, [NodeInput], StateSource<NodeState | undefined>>;
/**
 * Creates or validates a `DocumentHandle` object.
 * Ensures the provided object conforms to the `DocumentHandle` interface.
 * @param handle - The object containing document identification properties.
 * @returns The validated `DocumentHandle` object.
 * @public
 */
declare function createDocumentHandle<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(handle: DocumentHandle<TDocumentType, TDataset, TProjectId>): DocumentHandle<TDocumentType, TDataset, TProjectId>;
/**
 * Creates or validates a `DocumentTypeHandle` object.
 * Ensures the provided object conforms to the `DocumentTypeHandle` interface.
 * @param handle - The object containing document type identification properties.
 * @returns The validated `DocumentTypeHandle` object.
 * @public
 */
declare function createDocumentTypeHandle<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(handle: DocumentTypeHandle<TDocumentType, TDataset, TProjectId>): DocumentTypeHandle<TDocumentType, TDataset, TProjectId>;
/**
 * Creates or validates a `ProjectHandle` object.
 * Ensures the provided object conforms to the `ProjectHandle` interface.
 * @param handle - The object containing project identification properties.
 * @returns The validated `ProjectHandle` object.
 * @public
 */
declare function createProjectHandle<TProjectId extends string = string>(handle: ProjectHandle<TProjectId>): ProjectHandle<TProjectId>;
/**
 * Creates or validates a `DatasetHandle` object.
 * Ensures the provided object conforms to the `DatasetHandle` interface.
 * @param handle - The object containing dataset identification properties.
 * @returns The validated `DatasetHandle` object.
 * @public
 */
declare function createDatasetHandle<TDataset extends string = string, TProjectId extends string = string>(handle: DatasetHandle<TDataset, TProjectId>): DatasetHandle<TDataset, TProjectId>;
/** @public */
declare const getDatasetsState: BoundStoreAction<FetcherStoreState<[options?: ProjectHandle<string> | undefined], _sanity_client12.DatasetsResponse>, [options?: ProjectHandle<string> | undefined], StateSource<_sanity_client12.DatasetsResponse | undefined>>;
/** @public */
declare const resolveDatasets: BoundStoreAction<FetcherStoreState<[options?: ProjectHandle<string> | undefined], _sanity_client12.DatasetsResponse>, [options?: ProjectHandle<string> | undefined], Promise<_sanity_client12.DatasetsResponse>>;
/**
 * Represents an action to create a new document.
 * Specifies the document type and optionally a document ID (which will be treated as the published ID).
 * @beta
 */
interface CreateDocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentTypeHandle<TDocumentType, TDataset, TProjectId> {
  type: 'document.create';
}
/**
 * Represents an action to delete an existing document.
 * Requires the full document handle including the document ID.
 * @beta
 */
interface DeleteDocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  type: 'document.delete';
}
/**
 * Represents an action to edit an existing document using patches.
 * Requires the full document handle and an array of patch operations.
 * @beta
 */
interface EditDocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  type: 'document.edit';
  patches?: PatchOperations[];
}
/**
 * Represents an action to publish the draft version of a document.
 * Requires the full document handle.
 * @beta
 */
interface PublishDocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  type: 'document.publish';
}
/**
 * Represents an action to unpublish a document, moving its published content to a draft.
 * Requires the full document handle.
 * @beta
 */
interface UnpublishDocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  type: 'document.unpublish';
}
/**
 * Represents an action to discard the draft changes of a document.
 * Requires the full document handle.
 * @beta
 */
interface DiscardDocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  type: 'document.discard';
}
/**
 * Union type representing all possible document actions within the SDK.
 * @beta
 */
type DocumentAction<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> = CreateDocumentAction<TDocumentType, TDataset, TProjectId> | DeleteDocumentAction<TDocumentType, TDataset, TProjectId> | EditDocumentAction<TDocumentType, TDataset, TProjectId> | PublishDocumentAction<TDocumentType, TDataset, TProjectId> | UnpublishDocumentAction<TDocumentType, TDataset, TProjectId> | DiscardDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates a `CreateDocumentAction` object.
 * @param doc - A handle identifying the document type, dataset, and project. An optional `documentId` can be provided.
 * @returns A `CreateDocumentAction` object ready for dispatch.
 * @beta
 */
declare function createDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentTypeHandle<TDocumentType, TDataset, TProjectId>): CreateDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates a `DeleteDocumentAction` object.
 * @param doc - A handle uniquely identifying the document to be deleted.
 * @returns A `DeleteDocumentAction` object ready for dispatch.
 * @beta
 */
declare function deleteDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentHandle<TDocumentType, TDataset, TProjectId>): DeleteDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates an `EditDocumentAction` object with patches for modifying a document.
 * Accepts patches in either the standard `PatchOperations` format or as a `SanityMutatePatchMutation` from `@sanity/mutate`.
 *
 * @param doc - A handle uniquely identifying the document to be edited.
 * @param sanityMutatePatch - A patch mutation object from `@sanity/mutate`.
 * @returns An `EditDocumentAction` object ready for dispatch.
 * @beta
 */
declare function editDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentHandle<TDocumentType, TDataset, TProjectId>, sanityMutatePatch: PatchMutation): EditDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates an `EditDocumentAction` object with patches for modifying a document.
 *
 * @param doc - A handle uniquely identifying the document to be edited.
 * @param patches - A single patch operation or an array of patch operations.
 * @returns An `EditDocumentAction` object ready for dispatch.
 * @beta
 */
declare function editDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentHandle<TDocumentType, TDataset, TProjectId>, patches?: PatchOperations | PatchOperations[]): EditDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates a `PublishDocumentAction` object.
 * @param doc - A handle uniquely identifying the document to be published.
 * @returns A `PublishDocumentAction` object ready for dispatch.
 * @beta
 */
declare function publishDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentHandle<TDocumentType, TDataset, TProjectId>): PublishDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates an `UnpublishDocumentAction` object.
 * @param doc - A handle uniquely identifying the document to be unpublished.
 * @returns An `UnpublishDocumentAction` object ready for dispatch.
 * @beta
 */
declare function unpublishDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentHandle<TDocumentType, TDataset, TProjectId>): UnpublishDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Creates a `DiscardDocumentAction` object.
 * @param doc - A handle uniquely identifying the document whose draft changes are to be discarded.
 * @returns A `DiscardDocumentAction` object ready for dispatch.
 * @beta
 */
declare function discardDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(doc: DocumentHandle<TDocumentType, TDataset, TProjectId>): DiscardDocumentAction<TDocumentType, TDataset, TProjectId>;
/**
 * Represents a set of document that will go into `applyMutations`. Before
 * applying a mutation, it's expected that all relevant documents that the
 * mutations affect are included, including those that do not exist yet.
 * Documents that don't exist have a `null` value.
 */
type DocumentSet<TDocument extends SanityDocument$2 = SanityDocument$2> = { [TDocumentId in string]?: TDocument | null };
/**
 * Implements ID generation:
 *
 * A create mutation creates a new document. It takes the literal document
 * content as its argument. The rules for the new document's identifier are as
 * follows:
 *
 * - If the `_id` attribute is missing, then a new, random, unique ID is
 *   generated.
 * - If the `_id` attribute is present but ends with `.`, then it is used as a
 *   prefix for a new, random, unique ID.
 * - If the _id attribute is present, it is used as-is.
 *
 * [- source](https://www.sanity.io/docs/http-mutations#c732f27330a4)
 */
/** @beta */
interface ActionsResult<TDocument extends SanityDocument$3 = SanityDocument$3> {
  transactionId: string;
  documents: DocumentSet<TDocument>;
  previous: DocumentSet<TDocument>;
  previousRevs: {
    [documentId: string]: string | undefined;
  };
  appeared: string[];
  updated: string[];
  disappeared: string[];
  submitted: () => ReturnType<SanityClient['action']>;
}
/** @beta */
interface ApplyDocumentActionsOptions {
  /**
   * Optionally provide an ID to be used as this transaction ID
   */
  transactionId?: string;
  /**
   * Set this to true to prevent this action from being batched with others.
   */
  disableBatching?: boolean;
}
/** @beta */
declare function applyDocumentActions<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, action: DocumentAction<TDocumentType, TDataset, TProjectId> | DocumentAction<TDocumentType, TDataset, TProjectId>[], options?: ApplyDocumentActionsOptions): Promise<ActionsResult<SanityDocument$3<TDocumentType, `${TProjectId}.${TDataset}`>>>;
/** @beta */
declare function applyDocumentActions(instance: SanityInstance, action: DocumentAction | DocumentAction[], options?: ApplyDocumentActionsOptions): Promise<ActionsResult>;
declare interface AccessAttributeNode extends BaseNode {
  type: 'AccessAttribute';
  base?: ExprNode;
  name: string;
}
declare interface AccessElementNode extends BaseNode {
  type: 'AccessElement';
  base: ExprNode;
  index: number;
}
declare interface AndNode extends BaseNode {
  type: 'And';
  left: ExprNode;
  right: ExprNode;
}
declare type AnyStaticValue = StringValue | NumberValue | NullValue | BooleanValue | DateTimeValue | ObjectValue | ArrayValue | PathValue;
declare interface ArrayCoerceNode extends BaseNode {
  type: 'ArrayCoerce';
  base: ExprNode;
}
declare interface ArrayElementNode extends BaseNode {
  type: 'ArrayElement';
  value: ExprNode;
  isSplat: boolean;
}
declare interface ArrayNode extends BaseNode {
  type: 'Array';
  elements: ArrayElementNode[];
}

/** Describes a type node for array values. */

declare type ArrayValue = StaticValue<unknown[], 'array'>;
declare interface AscNode extends BaseNode {
  type: 'Asc';
  base: ExprNode;
}

/** The base interface for SyntaxNode. */
declare interface BaseNode {
  type: string;
}

/** Describes a type node for boolean values, optionally including a value. If a value is provided it will always be the given boolean value. */

declare type BooleanValue = StaticValue<boolean, 'boolean'>;
declare interface Context {
  timestamp: Date;
  identity: string;
  before: Value | null;
  after: Value | null;
  sanity?: {
    projectId: string;
    dataset: string;
  };
  dereference?: DereferenceFunction;
}
declare interface ContextNode extends BaseNode {
  type: 'Context';
  key: string;
}

/**
 * createReferenceTypeNode creates a ObjectTypeNode representing a reference type
 * it adds required attributes for a reference type.
 * @param name - The name of the reference type
 * @param inArray - Whether the reference is in an array
 * @returns A ObjectTypeNode representing a reference type
 * @internal
 */

declare class DateTime {
  date: Date;
  constructor(date: Date);
  static parseToValue(str: string): Value;
  equals(other: DateTime): boolean;
  add(secs: number): DateTime;
  difference(other: DateTime): number;
  compareTo(other: DateTime): number;
  toString(): string;
  toJSON(): string;
}
declare type DateTimeValue = StaticValue<DateTime, 'datetime'>;
declare type DereferenceFunction = (obj: {
  _ref: string;
}) => PromiseLike<Document_2 | null | undefined>;
declare interface DerefNode extends BaseNode {
  type: 'Deref';
  base: ExprNode;
}
declare interface DescNode extends BaseNode {
  type: 'Desc';
  base: ExprNode;
}
declare type Document_2 = {
  _id?: string;
  _type?: string;
  [T: string]: unknown;
};
declare interface EverythingNode extends BaseNode {
  type: 'Everything';
}
declare type Executor<N = ExprNode> = (node: N, scope: Scope) => Value | PromiseLike<Value>;

/**
 * A node which can be evaluated into a value.
 * @public
 */
declare type ExprNode = AccessAttributeNode | AccessElementNode | AndNode | ArrayNode | ArrayCoerceNode | AscNode | ContextNode | DerefNode | DescNode | EverythingNode | FilterNode | FlatMapNode | FuncCallNode | GroupNode | InRangeNode | MapNode | NegNode | NotNode | ObjectNode | OpCallNode | OrNode | ParameterNode | ParentNode_2 | PipeFuncCallNode | PosNode | ProjectionNode | SelectNode | SelectorNode | SliceNode | ThisNode | TupleNode | ValueNode;
declare interface FilterNode extends BaseNode {
  type: 'Filter';
  base: ExprNode;
  expr: ExprNode;
}
declare interface FlatMapNode extends BaseNode {
  type: 'FlatMap';
  base: ExprNode;
  expr: ExprNode;
}
declare interface FuncCallNode extends BaseNode {
  type: 'FuncCall';
  func: GroqFunction;
  namespace: string;
  name: string;
  args: ExprNode[];
}

/** @public */
declare type GroqFunction = (args: GroqFunctionArg[], scope: Scope, execute: Executor) => PromiseLike<Value>;

/** @public */
declare type GroqFunctionArg = ExprNode;
declare type GroqPipeFunction = (base: Value, args: ExprNode[], scope: Scope, execute: Executor) => PromiseLike<Value>;

/**
 * A type of a value in GROQ.
 */
declare type GroqType = 'null' | 'boolean' | 'number' | 'string' | 'array' | 'object' | 'path' | 'datetime';
declare interface GroupNode extends BaseNode {
  type: 'Group';
  base: ExprNode;
}

/** Describes a type node for inline values, including a name that references another type. */

declare interface InRangeNode extends BaseNode {
  type: 'InRange';
  base: ExprNode;
  left: ExprNode;
  right: ExprNode;
  isInclusive: boolean;
}
declare interface MapNode extends BaseNode {
  type: 'Map';
  base: ExprNode;
  expr: ExprNode;
}
declare interface NegNode extends BaseNode {
  type: 'Neg';
  base: ExprNode;
}
declare interface NotNode extends BaseNode {
  type: 'Not';
  base: ExprNode;
}

/** Describes a type node for null values, always being the null value. */

declare type NullValue = StaticValue<null, 'null'>;

/** Describes a type node for number values, optionally including a value. If a value is provided it will always be the given numeric value.*/

declare type NumberValue = StaticValue<number, 'number'>;

/** Describes a type node for object attributes, including a type and an optional flag for being optional. */

declare type ObjectAttributeNode = ObjectAttributeValueNode | ObjectConditionalSplatNode | ObjectSplatNode;
declare interface ObjectAttributeValueNode extends BaseNode {
  type: 'ObjectAttributeValue';
  name: string;
  value: ExprNode;
}
declare interface ObjectConditionalSplatNode extends BaseNode {
  type: 'ObjectConditionalSplat';
  condition: ExprNode;
  value: ExprNode;
}
declare interface ObjectNode extends BaseNode {
  type: 'Object';
  attributes: ObjectAttributeNode[];
}
declare interface ObjectSplatNode extends BaseNode {
  type: 'ObjectSplat';
  value: ExprNode;
}

/**
 * Describes a type node for object values, including a collection of attributes and an optional rest value.
 * The rest value can be another ObjectTypeNode, an UnknownTypeNode, or an InlineTypeNode.
 * If the rest value is an ObjectTypeNode, it means that the object can have additional attributes.
 * If the rest value is an UnknownTypeNode, the entire object is unknown.
 * If the rest value is an InlineTypeNode, it means that the object has additional attributes from the referenced type.
 */

declare type ObjectValue = StaticValue<Record<string, unknown>, 'object'>;
declare type OpCall = '==' | '!=' | '>' | '>=' | '<' | '<=' | '+' | '-' | '*' | '/' | '%' | '**' | 'in' | 'match';
declare interface OpCallNode extends BaseNode {
  type: 'OpCall';
  op: OpCall;
  left: ExprNode;
  right: ExprNode;
}
declare interface OrNode extends BaseNode {
  type: 'Or';
  left: ExprNode;
  right: ExprNode;
}
declare interface ParameterNode extends BaseNode {
  type: 'Parameter';
  name: string;
}
declare interface ParentNode_2 extends BaseNode {
  type: 'Parent';
  n: number;
}
declare class Path {
  private pattern;
  private patternRe;
  constructor(pattern: string);
  matches(str: string): boolean;
  toJSON(): string;
}
declare type PathValue = StaticValue<Path, 'path'>;
declare interface PipeFuncCallNode extends BaseNode {
  type: 'PipeFuncCall';
  func: GroqPipeFunction;
  base: ExprNode;
  name: string;
  args: ExprNode[];
}
declare interface PosNode extends BaseNode {
  type: 'Pos';
  base: ExprNode;
}

/** Union of any primitive type nodes. */

declare interface ProjectionNode extends BaseNode {
  type: 'Projection';
  base: ExprNode;
  expr: ExprNode;
}

/** A schema consisting of a list of Document or TypeDeclaration items, allowing for complex type definitions. */

declare class Scope {
  params: Record<string, unknown>;
  source: Value;
  value: Value;
  parent: Scope | null;
  context: Context;
  isHidden: boolean;
  constructor(params: Record<string, unknown>, source: Value, value: Value, context: Context, parent: Scope | null);
  createNested(value: Value): Scope;
  createHidden(value: Value): Scope;
}
declare interface SelectAlternativeNode extends BaseNode {
  type: 'SelectAlternative';
  condition: ExprNode;
  value: ExprNode;
}
declare interface SelectNode extends BaseNode {
  type: 'Select';
  alternatives: SelectAlternativeNode[];
  fallback?: ExprNode;
}
declare interface SelectorNode extends BaseNode {
  type: 'Selector';
}
declare interface SliceNode extends BaseNode {
  type: 'Slice';
  base: ExprNode;
  left: number;
  right: number;
  isInclusive: boolean;
}
declare class StaticValue<P, T extends GroqType> {
  data: P;
  type: T;
  constructor(data: P, type: T);
  isArray(): boolean;
  get(): Promise<any>;
  [Symbol.asyncIterator](): Generator<Value, void, unknown>;
}
declare class StreamValue {
  type: 'stream';
  private generator;
  private ticker;
  private isDone;
  private data;
  constructor(generator: () => AsyncGenerator<Value, void, unknown>);
  isArray(): boolean;
  get(): Promise<any>;
  [Symbol.asyncIterator](): AsyncGenerator<Value, void, unknown>;
  _nextTick(): Promise<void>;
}

/** Describes a type node for string values, optionally including a value. If a value is provided it will always be the given string value. */

declare type StringValue = StaticValue<string, 'string'>;

/** Any sort of node which appears as syntax */

declare interface ThisNode extends BaseNode {
  type: 'This';
}
declare interface TupleNode extends BaseNode {
  type: 'Tuple';
  members: Array<ExprNode>;
}

/** Defines a type declaration with a specific name and a value that describes the structure of the type using a TypeNode. */

/**
 * The result of an expression.
 */
declare type Value = AnyStaticValue | StreamValue;
declare interface ValueNode<P = any> {
  type: 'Value';
  value: P;
}
/**
 * Represents a reactive state source that provides synchronized access to store data
 *
 * @remarks
 * Designed to work with React's useSyncExternalStore hook. Provides three ways to access data:
 * 1. `getCurrent()` for synchronous current value access
 * 2. `subscribe()` for imperative change notifications
 * 3. `observable` for reactive stream access
 *
 * @public
 */
interface StateSource<T> {
  /**
   * Subscribes to state changes with optional callback
   * @param onStoreChanged - Called whenever relevant state changes occur
   * @returns Unsubscribe function to clean up the subscription
   */
  subscribe: (onStoreChanged?: () => void) => () => void;
  /**
   * Gets the current derived state value
   *
   * @remarks
   * Safe to call without subscription. Will always return the latest value
   * based on the current store state and selector parameters.
   */
  getCurrent: () => T;
  /**
   * Observable stream of state values
   *
   * @remarks
   * Shares a single underlying subscription between all observers. Emits:
   * - Immediately with current value on subscription
   * - On every relevant state change
   * - Errors if selector throws
   */
  observable: Observable<T>;
}
/**
 * Context passed to selectors when deriving state
 *
 * @remarks
 * Provides access to both the current state value and the Sanity instance,
 * allowing selectors to use configuration values when computing derived state.
 * The context is memoized for each state object and instance combination
 * to optimize performance and prevent unnecessary recalculations.
 *
 * @example
 * ```ts
 * // Using both state and instance in a selector (psuedo example)
 * const getUserByProjectId = createStateSourceAction(
 *   ({ state, instance }: SelectorContext<UsersState>, options?: ProjectHandle) => {
 *     const allUsers = state.users
 *     const projectId = options?.projectId ?? instance.config.projectId
 *     return allUsers.filter(user => user.projectId === projectId)
 *   }
 * )
 * ```
 */
interface SelectorContext<TState> {
  /**
   * The current state object from the store
   */
  state: TState;
  /**
   * The Sanity instance associated with this state
   */
  instance: SanityInstance;
}
/**
 * Function type for selecting derived state from store state and parameters
 * @public
 */
type Selector<TState, TParams extends unknown[], TReturn> = (context: SelectorContext<TState>, ...params: TParams) => TReturn;
/**
 * Configuration options for creating a state source action
 */
type ActionMap = {
  create: 'sanity.action.document.version.create';
  discard: 'sanity.action.document.version.discard';
  unpublish: 'sanity.action.document.unpublish';
  delete: 'sanity.action.document.delete';
  edit: 'sanity.action.document.edit';
  publish: 'sanity.action.document.publish';
};
type OptimisticLock = {
  ifDraftRevisionId?: string;
  ifPublishedRevisionId?: string;
};
type HttpAction = {
  actionType: ActionMap['create'];
  publishedId: string;
  attributes: SanityDocumentLike;
} | {
  actionType: ActionMap['discard'];
  versionId: string;
  purge?: boolean;
} | {
  actionType: ActionMap['unpublish'];
  draftId: string;
  publishedId: string;
} | {
  actionType: ActionMap['delete'];
  publishedId: string;
  includeDrafts?: string[];
} | {
  actionType: ActionMap['edit'];
  draftId: string;
  publishedId: string;
  patch: PatchOperations;
} | ({
  actionType: ActionMap['publish'];
  draftId: string;
  publishedId: string;
} & OptimisticLock);
/**
 * Represents a transaction that is queued to be applied but has not yet been
 * applied. A transaction will remain in a queued state until all required
 * documents for the transactions are available locally.
 */
interface QueuedTransaction {
  /**
   * the ID of this transaction. this is generated client-side.
   */
  transactionId: string;
  /**
   * the high-level actions associated with this transaction. note that these
   * actions don't mention draft IDs and is meant to abstract away the draft
   * model from users.
   */
  actions: DocumentAction[];
  /**
   * An optional flag set to disable this transaction from being batched with
   * other transactions.
   */
  disableBatching?: boolean;
}
/**
 * Represents a transaction that has been applied locally but has not been
 * committed/transitioned-to-outgoing. These transactions are visible to the
 * user but may be rebased upon a new working document set. Applied transactions
 * also contain the resulting `outgoingActions` that will be submitted to
 * Content Lake. These `outgoingActions` depend on the state of the working
 * documents so they are recomputed on rebase and are only relevant to applied
 * actions (we cannot compute `outgoingActions` for queued transactions because
 * we haven't resolved the set of documents the actions are dependent on yet).
 *
 * In order to support better conflict resolution, the original `previous` set
 * is saved as the `base` set.
 */
interface AppliedTransaction extends QueuedTransaction {
  /**
   * the resulting set of documents after the actions have been applied
   */
  working: DocumentSet;
  /**
   * the previous set of documents before the action was applied
   */
  previous: DocumentSet;
  /**
   * the original `previous` document set captured when this action was
   * originally applied. this is used as a reference point to do a 3-way merge
   * if this applied transaction ever needs to be reapplied on a different
   * set of documents.
   */
  base: DocumentSet;
  /**
   * the `_rev`s from `previous` document set
   */
  previousRevs: { [TDocumentId in string]?: string };
  /**
   * a timestamp for when this transaction was applied locally
   */
  timestamp: string;
  /**
   * the resulting HTTP actions derived from the state of the `working` document
   * set. these are sent to Content Lake as-is when this transaction is batched
   * and transitioned into an outgoing transaction.
   */
  outgoingActions: HttpAction[];
  /**
   * similar to `outgoingActions` but comprised of mutations instead of action.
   * this left here for debugging purposes but could be used to send mutations
   * to Content Lake instead of actions.
   */
  outgoingMutations: Mutation[];
}
/**
 * Represents a set of applied transactions batched into a single outgoing
 * transaction. An outgoing transaction is the result of batching many applied
 * actions. An outgoing transaction may be reverted locally if the server
 * does not accept it.
 */
interface OutgoingTransaction extends AppliedTransaction {
  disableBatching: boolean;
  batchedTransactionIds: string[];
}
interface UnverifiedDocumentRevision {
  transactionId: string;
  documentId: string;
  previousRev: string | undefined;
  timestamp: string;
}
type Grant = 'read' | 'update' | 'create' | 'history';
/** @beta */
interface PermissionDeniedReason {
  type: 'precondition' | 'access';
  message: string;
  documentId?: string;
}
/** @beta */
type DocumentPermissionsResult = {
  allowed: false;
  message: string;
  reasons: PermissionDeniedReason[];
} | {
  allowed: true;
  message?: undefined;
  reasons?: undefined;
};
/** @beta */
type DocumentEvent = ActionErrorEvent | TransactionRevertedEvent | TransactionAcceptedEvent | DocumentRebaseErrorEvent | DocumentEditedEvent | DocumentCreatedEvent | DocumentDeletedEvent | DocumentPublishedEvent | DocumentUnpublishedEvent | DocumentDiscardedEvent;
/**
 * @beta
 * Event emitted when a precondition to applying an action fails.
 * (For example: when trying to edit a document that no longer exists.)
 */
interface ActionErrorEvent {
  type: 'error';
  documentId: string;
  transactionId: string;
  message: string;
  error: unknown;
}
/**
 * @beta
 * Event emitted when a transaction is accepted.
 */
interface TransactionAcceptedEvent {
  type: 'accepted';
  outgoing: OutgoingTransaction;
  result: Awaited<ReturnType<SanityClient['action']>>;
}
/**
 * @beta
 * Event emitted when a transaction is reverted.
 */
interface TransactionRevertedEvent {
  type: 'reverted';
  message: string;
  error: unknown;
  outgoing: OutgoingTransaction;
}
/**
 * @beta
 * Event emitted when an attempt to apply local changes to a modified remote document fails.
 */
interface DocumentRebaseErrorEvent {
  type: 'rebase-error';
  documentId: string;
  transactionId: string;
  message: string;
  error: unknown;
}
/**
 * @beta
 * Event emitted when a document is edited.
 */
interface DocumentEditedEvent {
  type: 'edited';
  documentId: string;
  outgoing: OutgoingTransaction;
}
/**
 * @beta
 * Event emitted when a document is created.
 */
interface DocumentCreatedEvent {
  type: 'created';
  documentId: string;
  outgoing: OutgoingTransaction;
}
/**
 * @beta
 * Event emitted when a document is deleted.
 */
interface DocumentDeletedEvent {
  type: 'deleted';
  documentId: string;
  outgoing: OutgoingTransaction;
}
/**
 * @beta
 * Event emitted when a document is published.
 */
interface DocumentPublishedEvent {
  type: 'published';
  documentId: string;
  outgoing: OutgoingTransaction;
}
/**
 * @beta
 * Event emitted when a document is unpublished.
 */
interface DocumentUnpublishedEvent {
  type: 'unpublished';
  documentId: string;
  outgoing: OutgoingTransaction;
}
/**
 * @beta
 * Event emitted when a document version is discarded.
 */
interface DocumentDiscardedEvent {
  type: 'discarded';
  documentId: string;
  outgoing: OutgoingTransaction;
}
/**
 * Split the entire path string on dots "outside" of any brackets.
 *
 * For example:
 * ```
 * "friends[0].name"
 * ```
 *
 * becomes:
 *
 * ```
 * [...ParseSegment<"friends[0]">, ...ParseSegment<"name">]
 * ```
 *
 * (We use a simple recursion that splits on the first dot.)
 */
type PathParts<TPath extends string> = TPath extends `${infer Head}.${infer Tail}` ? [Head, ...PathParts<Tail>] : TPath extends '' ? [] : [TPath];
/**
 * Given a type T and an array of "access keys" Parts, recursively index into T.
 *
 * If a part is a key, it looks up that property.
 * If T is an array and the part is a number, it "indexes" into the element type.
 */
type DeepGet<TValue, TPath extends readonly (string | number)[]> = TPath extends [] ? TValue : TPath extends readonly [infer THead, ...infer TTail] ? DeepGet<TValue extends undefined | null ? undefined : THead extends keyof TValue ? TValue[THead] : THead extends number ? TValue extends readonly (infer TElement)[] ? TElement | undefined : undefined : undefined,
// Key/index doesn't exist
TTail extends readonly (string | number)[] ? TTail : []> : never;
/**
 * Given a document type TDocument and a JSON Match path string TPath,
 * compute the type found at that path.
 * @beta
 */
type JsonMatch<TDocument, TPath extends string> = DeepGet<TDocument, PathParts<TPath>>;
/**
 * Recursively traverse a value. When an array is encountered, ensure that
 * each object item has a _key property. Memoized such that sub-objects that
 * have not changed aren't re-computed.
 */
interface SharedListener {
  events: Observable<ListenEvent<SanityDocument$1>>;
  dispose: () => void;
}
interface DocumentStoreState {
  documentStates: { [TDocumentId in string]?: DocumentState };
  queued: QueuedTransaction[];
  applied: AppliedTransaction[];
  outgoing?: OutgoingTransaction;
  grants?: Record<Grant, ExprNode>;
  error?: unknown;
  sharedListener: SharedListener;
  fetchDocument: (documentId: string) => Observable<SanityDocument$3 | null>;
  events: Subject<DocumentEvent>;
}
interface DocumentState {
  id: string;
  /**
   * the "remote" local copy that matches the server. represents the last known
   * server state. this gets updated every time we confirm remote patches
   */
  remote?: SanityDocument$3 | null;
  /**
   * the current ephemeral working copy that includes local optimistic changes
   * that have not yet been confirmed by the server
   */
  local?: SanityDocument$3 | null;
  /**
   * the revision that our remote document is at
   */
  remoteRev?: string | null;
  /**
   * Array of subscription IDs. This document state will be deleted if there are
   * no subscribers.
   */
  subscriptions: string[];
  /**
   * An object keyed by transaction ID of revisions sent out but that have not
   * yet been verified yet. When an applied transaction is transitioned to an
   * outgoing transaction, it also adds unverified revisions for each document
   * that is part of that outgoing transaction. Transactions are submitted to
   * the server with a locally generated transaction ID. This way we can observe
   * when our transaction comes back through the shared listener. Each listener
   * event that comes back contains a `previousRev`. If we see our own
   * transaction with a different `previousRev` than expected, we can rebase our
   * local transactions on top of this new remote.
   */
  unverifiedRevisions?: { [TTransactionId in string]?: UnverifiedDocumentRevision };
}
/**
 * @beta
 * Options for specifying a document and optionally a path within it.
 */
interface DocumentOptions<TPath extends string | undefined = undefined, TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  path?: TPath;
}
/** @beta */
declare function getDocumentState<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, options: DocumentOptions<undefined, TDocumentType, TDataset, TProjectId>): StateSource<SanityDocument$3<TDocumentType, `${TProjectId}.${TDataset}`> | undefined | null>;
/** @beta */
declare function getDocumentState<TPath extends string = string, TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, options: DocumentOptions<TPath, TDocumentType, TDataset, TProjectId>): StateSource<JsonMatch<SanityDocument$3<TDocumentType, `${TProjectId}.${TDataset}`>, TPath> | undefined>;
/** @beta */
declare function getDocumentState<TData>(instance: SanityInstance, options: DocumentOptions<string | undefined>): StateSource<TData | undefined | null>;
/** @beta */
declare function resolveDocument<TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, docHandle: DocumentHandle<TDocumentType, TDataset, TProjectId>): Promise<SanityDocument$3<TDocumentType, `${TProjectId}.${TDataset}`> | null>;
/** @beta */
declare function resolveDocument<TData extends SanityDocument$3>(instance: SanityInstance, docHandle: DocumentHandle<string, string, string>): Promise<TData | null>;
/** @beta */
declare const getDocumentSyncStatus: BoundStoreAction<DocumentStoreState, [doc: DocumentHandle<string, string, string>], StateSource<boolean | undefined>>;
/** @beta */
declare const getPermissionsState: BoundStoreAction<DocumentStoreState, [DocumentAction | DocumentAction[]], StateSource<DocumentPermissionsResult | undefined>>;
/** @beta */
declare const resolvePermissions: BoundStoreAction<DocumentStoreState, [actions: DocumentAction | DocumentAction[]], Promise<DocumentPermissionsResult>>;
/** @beta */
declare const subscribeDocumentEvents: BoundStoreAction<DocumentStoreState, [eventHandler: (e: DocumentEvent) => void], () => void>;
/**
 * @public
 */
interface FavoriteStatusResponse {
  isFavorited: boolean;
}
/**
 * @public
 */
interface FavoriteDocumentContext extends DocumentHandle {
  resourceId: string;
  resourceType: StudioResource['type'] | MediaResource['type'] | CanvasResource['type'];
  schemaName?: string;
}
/**
 * Gets a StateSource for the favorite status of a document.
 * @param instance - The Sanity instance.
 * @param context - The document context including ID, type, and resource information.
 * @returns A StateSource emitting `{ isFavorited: boolean }`.
 * @public
 */
declare const getFavoritesState: BoundStoreAction<FetcherStoreState<[FavoriteDocumentContext], FavoriteStatusResponse>, [FavoriteDocumentContext], StateSource<FavoriteStatusResponse | undefined>>;
/**
 * Resolves the favorite status for a document.
 * @param instance - The Sanity instance.
 * @param context - The document context including ID, type, and resource information.
 * @returns A Promise resolving to `{ isFavorited: boolean }`.
 * @public
 */
declare const resolveFavoritesState: BoundStoreAction<FetcherStoreState<[FavoriteDocumentContext], FavoriteStatusResponse>, [FavoriteDocumentContext], Promise<FavoriteStatusResponse>>;
/**
 * @public
 */
interface SanityUser {
  sanityUserId: string;
  profile: UserProfile;
  memberships: Membership[];
}
/**
 * @public
 */
interface Membership {
  addedAt?: string;
  resourceType: string;
  resourceId: string;
  roleNames: Array<string>;
  lastSeenAt?: string | null;
}
/**
 * @public
 */
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  familyName?: string;
  givenName?: string;
  middleName?: string | null;
  imageUrl?: string;
  provider: string;
  tosAcceptedAt?: string;
  createdAt: string;
  updatedAt?: string;
  isCurrentUser?: boolean;
  providerId?: string;
}
/**
 * @public
 */
interface GetUsersOptions extends ProjectHandle {
  resourceType?: 'organization' | 'project';
  batchSize?: number;
  organizationId?: string;
  userId?: string;
}
/**
 * @public
 */
interface UsersGroupState {
  subscriptions: string[];
  totalCount?: number;
  nextCursor?: string | null;
  lastLoadMoreRequest?: string;
  users?: SanityUser[];
  error?: unknown;
}
/**
 * @public
 */
interface SanityUserResponse {
  data: SanityUser[];
  totalCount: number;
  nextCursor: string | null;
}
/**
 * @public
 */
interface UsersStoreState {
  users: { [TUsersKey in string]?: UsersGroupState };
  error?: unknown;
}
/**
 * @public
 */
interface ResolveUsersOptions extends GetUsersOptions {
  signal?: AbortSignal;
}
/**
 * @public
 */
interface GetUserOptions extends ProjectHandle {
  userId: string;
  resourceType?: 'organization' | 'project';
  organizationId?: string;
}
/**
 * @public
 */
interface ResolveUserOptions extends GetUserOptions {
  signal?: AbortSignal;
}
/** @public */
interface PresenceLocation {
  type: 'document';
  documentId: string;
  path: string[];
  lastActiveAt: string;
}
/** @public */
interface UserPresence {
  user: SanityUser;
  locations: PresenceLocation[];
  sessionId: string;
}
/** @public */

/** @public */
type TransportEvent = RollCallEvent | StateEvent | DisconnectEvent;
/** @public */
interface RollCallEvent {
  type: 'rollCall';
  userId: string;
  sessionId: string;
}
/** @public */
interface StateEvent {
  type: 'state';
  userId: string;
  sessionId: string;
  timestamp: string;
  locations: PresenceLocation[];
}
/** @public */
interface DisconnectEvent {
  type: 'disconnect';
  userId: string;
  sessionId: string;
  timestamp: string;
}
/** @public */
type PresenceStoreState = {
  locations: Map<string, {
    userId: string;
    locations: PresenceLocation[];
  }>;
  users: Record<string, SanityUser | undefined>;
};
/** @public */

/** @public */
declare const getPresence: BoundStoreAction<PresenceStoreState, [], StateSource<UserPresence[]>>;
/**
 * Represents a media asset in a preview.
 *
 * @public
 */
interface PreviewMedia {
  type: 'image-asset';
  _ref: string;
  url: string;
}
/**
 * Represents the set of values displayed as a preview for a given Sanity document.
 * This includes a primary title, a secondary subtitle, an optional piece of media associated
 * with the document, and the document's status.
 *
 * @public
 */
interface PreviewValue {
  /**
   * The primary text displayed for the document preview.
   */
  title: string;
  /**
   * A secondary line of text providing additional context about the document.
   */
  subtitle?: string;
  /**
   * An optional piece of media representing the document within its preview.
   * Currently, only image assets are available.
   */
  media?: PreviewMedia | null;
  /**
   * The status of the document.
   */
  _status?: {
    /** The date of the last published edit */
    lastEditedPublishedAt?: string;
    /** The date of the last draft edit */
    lastEditedDraftAt?: string;
  };
}
/**
 * Represents the current state of a preview value along with a flag indicating whether
 * the preview data is still being fetched or is fully resolved.
 *
 * The tuple contains a preview value or null, and a boolean indicating if the data is
 * pending. A `true` value means a fetch is ongoing; `false` indicates that the
 * currently provided preview value is up-to-date.
 *
 * @public
 */
type ValuePending<T> = {
  data: T | null;
  isPending: boolean;
};
/**
 * @public
 */
interface PreviewStoreState {
  values: { [TDocumentId in string]?: ValuePending<PreviewValue> };
  subscriptions: { [TDocumentId in string]?: { [TSubscriptionId in string]?: true } };
}
/**
 * @beta
 */
type GetPreviewStateOptions = DocumentHandle;
/**
 * @beta
 */
declare function getPreviewState<TResult extends object>(instance: SanityInstance, options: GetPreviewStateOptions): StateSource<ValuePending<TResult>>;
/**
 * @beta
 */
declare function getPreviewState(instance: SanityInstance, options: GetPreviewStateOptions): StateSource<ValuePending<PreviewValue>>;
/**
 * @beta
 */
/**
 * @beta
 */
type ResolvePreviewOptions = DocumentHandle;
/**
 * @beta
 */
declare const resolvePreview: BoundStoreAction<PreviewStoreState, [docHandle: ResolvePreviewOptions], Promise<ValuePending<object>>>;
/** @public */
declare const getProjectState: BoundStoreAction<FetcherStoreState<[options?: ProjectHandle<string> | undefined], _sanity_client12.SanityProject>, [options?: ProjectHandle<string> | undefined], StateSource<_sanity_client12.SanityProject | undefined>>;
/** @public */
declare const resolveProject: BoundStoreAction<FetcherStoreState<[options?: ProjectHandle<string> | undefined], _sanity_client12.SanityProject>, [options?: ProjectHandle<string> | undefined], Promise<_sanity_client12.SanityProject>>;
/**
 * @public
 */
type ValidProjection = `{${string}}`;
/**
 * @public
 * The result of a projection query
 */
interface ProjectionValuePending<TValue extends object> {
  data: TValue | null;
  isPending: boolean;
}
interface ProjectionOptions<TProjection extends ValidProjection = ValidProjection, TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string> extends DocumentHandle<TDocumentType, TDataset, TProjectId> {
  projection: TProjection;
}
/**
 * @beta
 */
declare function getProjectionState<TProjection extends ValidProjection = ValidProjection, TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, options: ProjectionOptions<TProjection, TDocumentType, TDataset, TProjectId>): StateSource<ProjectionValuePending<SanityProjectionResult<TProjection, TDocumentType, `${TProjectId}.${TDataset}`>> | undefined>;
/**
 * @beta
 */
declare function getProjectionState<TData extends object>(instance: SanityInstance, options: ProjectionOptions): StateSource<ProjectionValuePending<TData> | undefined>;
/**
 * @beta
 */
declare function getProjectionState(instance: SanityInstance, options: ProjectionOptions): StateSource<ProjectionValuePending<Record<string, unknown>> | undefined>;
/**
 * @beta
 */
/** @beta */
declare function resolveProjection<TProjection extends ValidProjection = ValidProjection, TDocumentType extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, options: ProjectionOptions<TProjection, TDocumentType, TDataset, TProjectId>): Promise<ProjectionValuePending<SanityProjectionResult<TProjection, TDocumentType, `${TProjectId}.${TDataset}`>>>;
/** @beta */
declare function resolveProjection<TData extends object>(instance: SanityInstance, options: ProjectionOptions): Promise<ProjectionValuePending<TData>>;
/** @public */
declare const getProjectsState: BoundStoreAction<FetcherStoreState<[], Omit<_sanity_client12.SanityProject, "members">[]>, [], StateSource<Omit<_sanity_client12.SanityProject, "members">[] | undefined>>;
/** @public */
declare const resolveProjects: BoundStoreAction<FetcherStoreState<[], Omit<_sanity_client12.SanityProject, "members">[]>, [], Promise<Omit<_sanity_client12.SanityProject, "members">[]>>;
/**
 * @beta
 */
interface QueryOptions<TQuery extends string = string, TDataset extends string = string, TProjectId extends string = string> extends Pick<ResponseQueryOptions, 'useCdn' | 'cache' | 'next' | 'cacheMode' | 'tag'>, DatasetHandle<TDataset, TProjectId> {
  query: TQuery;
  params?: Record<string, unknown>;
}
/**
 * @beta
 */
interface ResolveQueryOptions<TQuery extends string = string, TDataset extends string = string, TProjectId extends string = string> extends QueryOptions<TQuery, TDataset, TProjectId> {
  signal?: AbortSignal;
}
/** @beta */
declare const getQueryKey: (options: QueryOptions) => string;
/** @beta */
declare const parseQueryKey: (key: string) => QueryOptions;
/**
 * Returns the state source for a query.
 *
 * This function returns a state source that represents the current result of a GROQ query.
 * Subscribing to the state source will instruct the SDK to fetch the query (if not already fetched)
 * and will keep the query live using the Live content API (considering sync tags) to provide up-to-date results.
 * When the last subscriber is removed, the query state is automatically cleaned up from the store.
 *
 * Note: This functionality is for advanced users who want to build their own framework integrations.
 * Our SDK also provides a React integration (useQuery hook) for convenient usage.
 *
 * Note: Automatic cleanup can interfere with React Suspense because if a component suspends while being the only subscriber,
 * cleanup might occur unexpectedly. In such cases, consider using `resolveQuery` instead.
 *
 * @beta
 */
declare function getQueryState<TQuery extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, queryOptions: QueryOptions<TQuery, TDataset, TProjectId>): StateSource<SanityQueryResult<TQuery, `${TProjectId}.${TDataset}`> | undefined>;
/** @beta */
declare function getQueryState<TData>(instance: SanityInstance, queryOptions: QueryOptions): StateSource<TData | undefined>;
/** @beta */
declare function getQueryState(instance: SanityInstance, queryOptions: QueryOptions): StateSource<unknown>;
/**
 * Resolves the result of a query without registering a lasting subscriber.
 *
 * This function fetches the result of a GROQ query and returns a promise that resolves with the query result.
 * Unlike `getQueryState`, which registers subscribers to keep the query live and performs automatic cleanup,
 * `resolveQuery` does not track subscribers. This makes it ideal for use with React Suspense, where the returned
 * promise is thrown to delay rendering until the query result becomes available.
 * Once the promise resolves, it is expected that a real subscriber will be added via `getQueryState` to manage ongoing updates.
 *
 * Additionally, an optional AbortSignal can be provided to cancel the query and immediately clear the associated state
 * if there are no active subscribers.
 *
 * @beta
 */
declare function resolveQuery<TQuery extends string = string, TDataset extends string = string, TProjectId extends string = string>(instance: SanityInstance, queryOptions: ResolveQueryOptions<TQuery, TDataset, TProjectId>): Promise<SanityQueryResult<TQuery, `${TProjectId}.${TDataset}`>>;
/** @beta */
declare function resolveQuery<TData>(instance: SanityInstance, queryOptions: ResolveQueryOptions): Promise<TData>;
/**
 * Represents a document in a Sanity dataset that represents release options.
 * @internal
 */
type ReleaseDocument = SanityDocument$2 & {
  name: string;
  publishAt?: string;
  state: 'active' | 'scheduled';
  metadata: {
    title: string;
    releaseType: 'asap' | 'scheduled' | 'undecided';
    intendedPublishAt?: string;
    description?: string;
  };
};
interface ReleasesStoreState {
  activeReleases?: ReleaseDocument[];
  error?: unknown;
}
/**
 * Get the active releases from the store.
 * @internal
 */
declare const getActiveReleasesState: BoundStoreAction<ReleasesStoreState, [], StateSource<ReleaseDocument[] | undefined>>;
/**
 * Provides a subscribable state source for a "perspective" for the Sanity client,
 * which is used to fetch documents as though certain Content Releases are active.
 *
 * @param instance - The Sanity instance to get the perspective for
 * @param options - The options for the perspective -- usually a release name
 *
 * @returns A subscribable perspective value, usually a list of applicable release names,
 * or a single release name / default perspective (such as 'drafts').
 *
 * @public
 */
declare const getPerspectiveState: BoundStoreAction<ReleasesStoreState, [options?: PerspectiveHandle | undefined], StateSource<string[] | "previewDrafts" | "published" | "drafts" | "raw" | undefined>>;
/** @internal */
declare const getUsersKey: (instance: SanityInstance, {
  resourceType,
  organizationId,
  batchSize,
  projectId,
  userId
}?: GetUsersOptions) => string;
/** @internal */
declare const parseUsersKey: (key: string) => {
  batchSize: number;
  resourceType?: "organization" | "project";
  projectId?: string;
  organizationId?: string;
  userId?: string;
};
/**
 * Returns the state source for users associated with a specific resource.
 *
 * This function returns a state source that represents the current list of users for a given
 * resource. Subscribing to the state source will instruct the SDK to fetch the users (if not
 * already fetched) and will load more from this state source as well. When the last subscriber is
 * removed, the users state is automatically cleaned up from the store after a delay.
 *
 * Note: This functionality is for advanced users who want to build their own framework
 * integrations. Our SDK also provides a React integration for convenient usage.
 *
 * @beta
 */
declare const getUsersState: BoundStoreAction<UsersStoreState, [options?: GetUsersOptions], StateSource<{
  data: SanityUser[];
  totalCount: number;
  hasMore: boolean;
} | undefined>>;
/**
 * Resolves the users for a specific resource without registering a lasting subscriber.
 *
 * This function fetches the users for a given resource and returns a promise that resolves with
 * the users result. Unlike `getUsersState`, which registers subscribers to keep the data live and
 * performs automatic cleanup, `resolveUsers` does not track subscribers. This makes it ideal for
 * use with React Suspense, where the returned promise is thrown to delay rendering until the users
 * result becomes available. Once the promise resolves, it is expected that a real subscriber will
 * be added via `getUsersState` to manage ongoing updates.
 *
 * Additionally, an optional AbortSignal can be provided to cancel the request and immediately
 * clear the associated state if there are no active subscribers.
 *
 * @beta
 */
declare const resolveUsers: BoundStoreAction<UsersStoreState, [ResolveUsersOptions], Promise<{
  data: SanityUser[];
  totalCount: number;
  hasMore: boolean;
}>>;
/**
 * Loads more users for a specific resource.
 *
 * This function triggers a request to fetch the next page of users for a given resource. It
 * requires that users have already been loaded for the resource (via `resolveUsers` or
 * `getUsersState`), and that there are more users available to load (as indicated by the `hasMore`
 * property).
 *
 * The function returns a promise that resolves when the next page of users has been loaded.
 *
 * @beta
 */
declare const loadMoreUsers: BoundStoreAction<UsersStoreState, [options?: GetUsersOptions | undefined], Promise<{
  data: SanityUser[];
  totalCount: number;
  hasMore: boolean;
}>>;
/**
 * @beta
 */
declare const getUserState: BoundStoreAction<UsersStoreState, [GetUserOptions], Observable<SanityUser | undefined>>;
/**
 * @beta
 */
declare const resolveUser: BoundStoreAction<UsersStoreState, [ResolveUserOptions], Promise<SanityUser | undefined>>;
interface StoreEntry<TParams extends unknown[], TData> {
  params: TParams;
  instance: SanityInstance;
  key: string;
  data?: TData;
  error?: unknown;
  subscriptions: string[];
  lastFetchInitiatedAt?: string;
}
/**
 * Internal helper type
 * @public
 */
interface FetcherStoreState<TParams extends unknown[], TData> {
  stateByParams: { [TSerializedKey in string]?: StoreEntry<TParams, TData> };
  error?: unknown;
}
/**
 * Internal helper type
 * @public
 */
interface FetcherStore<TParams extends unknown[], TData> {
  getState: BoundStoreAction<FetcherStoreState<TParams, TData>, TParams, StateSource<TData | undefined>>;
  resolveState: BoundStoreAction<FetcherStoreState<TParams, TData>, TParams, Promise<TData>>;
}
/**
 * Creates a store from a function that returns an observable that fetches data
 * that supports parameterized state caching.
 *
 * This function creates a resource store keyed by parameter values (using the
 * provided `getKey` function) and returns a state source (via `getState`)
 * that components can subscribe to. When a new subscription is added, and if
 * enough time has passed since the last fetch (controlled by
 * `fetchThrottleInternal`), it invokes the observable factory (via
 * `getObservable`) to fetch fresh data. The data is stored in state and can be
 * accessed reactively.
 *
 * Additionally, the store provides a `resolveState` function that returns a
 * Promise resolving with the next non-undefined value from the state source.
 *
 * State expiration is implemented: after the last subscription for a key is
 * removed, its state is cleared after `stateExpirationDelay` ms, causing
 * components to suspend until fresh data is fetched.
 */
/**
 * Creates a GROQ search filter string (`[@] match text::query("...")`)
 * from a raw search query string.
 *
 * It applies wildcard ('*') logic to the last eligible token and escapes
 * double quotes within the search term.
 *
 * If the input query is empty or only whitespace, it returns an empty string.
 *
 * @param query - The raw input search string.
 * @returns The GROQ search filter string, or an empty string.
 * @internal
 */
declare function createGroqSearchFilter(query: string): string;
/**
 * Filter criteria for intent matching. Can be combined to create more specific intents.
 *
 * @example
 * ```typescript
 * // matches only geopoints in the travel-project project, production dataset
 * const filter: IntentFilter = {
 *   projectId: 'travel-project',
 *   dataset: 'production',
 *   types: ['geopoint']
 * }
 *
 * // matches all documents in the travel-project project
 * const filter: IntentFilter = {
 *   projectId: 'travel-project',
 *   types: ['*']
 * }
 *
 * // matches geopoints in the travel-project production dataset and map pins in all projects in the org
 * const filters: IntentFilter[] = [
 *  {
 *    projectId: 'travel-project',
 *    dataset: 'production',
 *    types: ['geopoint']
 *  },
 *  {
 *    types: ['map-pin']
 *  }
 * ]
 * ```
 * @public
 */
interface IntentFilter {
  /**
   * Project ID to match against
   * @remarks When specified, the intent will only match for the specified project.
   */
  projectId?: string;
  /**
   * Dataset to match against
   * @remarks When specified, the intent will only match for the specified dataset. Requires projectId to be specified.
   */
  dataset?: string;
  /**
   * Document types that this intent can handle
   * @remarks This is required for all filters. Use ['*'] to match all document types.
   */
  types: string[];
}
/**
 * Intent definition structure for registering user intents
 * @public
 */
interface Intent {
  /**
   * Unique identifier for this intent
   * @remarks Should be unique across all registered intents in an org for proper matching
   */
  id: string;
  /**
   * The action that this intent performs
   * @remarks Examples: "view", "edit", "create", "delete"
   */
  action: 'view' | 'edit' | 'create' | 'delete';
  /**
   * Human-readable title for this intent
   * @remarks Used for display purposes in UI or logs
   */
  title: string;
  /**
   * Detailed description of what this intent does
   * @remarks Helps users understand the purpose and behavior of the intent
   */
  description?: string;
  /**
   * Array of filter criteria for intent matching
   * @remarks At least one filter is required. Use `{types: ['*']}` to match everything
   */
  filters: IntentFilter[];
}
/**
 * Creates a properly typed intent definition for registration with the backend.
 *
 * This utility function provides TypeScript support and validation for intent declarations.
 * It is also used in the CLI if intents are declared as bare objects in an intents file.
 *
 * @param intent - The intent definition object
 * @returns The same intent object with proper typing
 *
 * @example
 * ```typescript
 * // Specific filter for a document type
 * const viewGeopointInMapApp = defineIntent({
 *   id: 'viewGeopointInMapApp',
 *   action: 'view',
 *   title: 'View a geopoint in the map app',
 *   description: 'This lets you view a geopoint in the map app',
 *   filters: [
 *     {
 *       projectId: 'travel-project',
 *       dataset: 'production',
 *       types: ['geopoint']
 *     }
 *   ]
 * })
 *
 * export default viewGeopointInMapApp
 * ```
 *
 * If your intent is asynchronous, resolve the promise before defining / returning the intent
 * ```typescript
 * async function createAsyncIntent() {
 *   const currentProject = await asyncProjectFunction()
 *   const currentDataset = await asyncDatasetFunction()
 *
 *   return defineIntent({
 *     id: 'dynamicIntent',
 *     action: 'view',
 *     title: 'Dynamic Intent',
 *     description: 'Intent with dynamically resolved values',
 *     filters: [
 *       {
 *         projectId: currentProject,  // Resolved value
 *         dataset: currentDataset,    // Resolved value
 *         types: ['document']
 *       }
 *     ]
 *   })
 * }
 *
 * const intent = await createAsyncIntent()
 * export default intent
 * ```
 *
 * @public
 */
declare function defineIntent(intent: Intent): Intent;
/**
 * This version is provided by pkg-utils at build time
 * @internal
 */
declare const CORE_SDK_VERSION: {};
/**
 * @public
 */
type SanityProject = SanityProject$1;
export { type ActionErrorEvent, type ActionsResult, type ApplyDocumentActionsOptions, type AuthConfig, type AuthProvider, type AuthState, AuthStateType, type AuthStoreState, CORE_SDK_VERSION, type ClientOptions, type ClientStoreState as ClientState, type ComlinkControllerState, type ComlinkNodeState, type CreateDocumentAction, type CurrentUser, type DatasetHandle, type DeleteDocumentAction, type DiscardDocumentAction, type DisconnectEvent, type DocumentAction, type DocumentCreatedEvent, type DocumentDeletedEvent, type DocumentDiscardedEvent, type DocumentEditedEvent, type DocumentEvent, type DocumentHandle, type DocumentOptions, type DocumentPermissionsResult, type DocumentPublishedEvent, type DocumentTypeHandle, type DocumentUnpublishedEvent, type EditDocumentAction, type ErrorAuthState, type FavoriteStatusResponse, type FetcherStore, type FetcherStoreState, type FrameMessage, type GetPreviewStateOptions, type GetUserOptions, type GetUsersOptions, type Intent, type IntentFilter, type JsonMatch, type LoggedInAuthState, type LoggedOutAuthState, type LoggingInAuthState, type Membership, type NewTokenResponseMessage, type NodeState, type OrgVerificationResult, type PermissionDeniedReason, type PerspectiveHandle, type PresenceLocation, type PreviewStoreState, type PreviewValue, type ProjectHandle, type ProjectionValuePending, type PublishDocumentAction, type QueryOptions, type ReleaseDocument, type ReleasePerspective, type RequestNewTokenMessage, type ResolvePreviewOptions, type ResolveUserOptions, type ResolveUsersOptions, type Role, type RollCallEvent, type SanityConfig, type SanityDocument, type SanityInstance, SanityProject, type SanityUser, type SanityUserResponse, type Selector, type StateEvent, type StateSource, type TransactionAcceptedEvent, type TransactionRevertedEvent, type TransportEvent, type UnpublishDocumentAction, type UserPresence, type UserProfile, type UsersGroupState, type UsersStoreState, type ValidProjection, type ValuePending, type WindowMessage, applyDocumentActions, createDatasetHandle, createDocument, createDocumentHandle, createDocumentTypeHandle, createGroqSearchFilter, createProjectHandle, createSanityInstance, defineIntent, deleteDocument, destroyController, discardDocument, editDocument, getActiveReleasesState, getAuthState, getClient, getClientState, getCurrentUserState, getDashboardOrganizationId, getDatasetsState, getDocumentState, getDocumentSyncStatus, getFavoritesState, getIndexForKey, getIsInDashboardState, getLoginUrlState, getNodeState, getOrCreateChannel, getOrCreateController, getOrCreateNode, getPathDepth, getPermissionsState, getPerspectiveState, getPresence, getPreviewState, getProjectState, getProjectionState, getProjectsState, getQueryKey, getQueryState, getTokenState, getUserState, getUsersKey, getUsersState, handleAuthCallback, joinPaths, jsonMatch, loadMoreUsers, logout, observeOrganizationVerificationState, parseQueryKey, parseUsersKey, publishDocument, releaseChannel, releaseNode, resolveDatasets, resolveDocument, resolveFavoritesState, resolvePermissions, resolvePreview, resolveProject, resolveProjection, resolveProjects, resolveQuery, resolveUser, resolveUsers, setAuthToken, slicePath, stringifyPath, subscribeDocumentEvents, unpublishDocument };
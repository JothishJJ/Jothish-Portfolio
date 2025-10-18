import * as xstate1332 from "xstate";
import { ActorRefFrom, AnyActorRef, EventObject } from "xstate";
/** @internal */
declare const DOMAIN = "sanity/comlink";
/** @internal */
declare const RESPONSE_TIMEOUT_DEFAULT = 3000;
/** @internal */
declare const FETCH_TIMEOUT_DEFAULT = 10000;
/** @internal */
declare const HEARTBEAT_INTERVAL = 1000;
/** @internal */
declare const HANDSHAKE_INTERVAL = 500;
/**
 * @public
 */
declare const MSG_RESPONSE = "comlink/response";
/**
 * @public
 */
declare const MSG_HEARTBEAT = "comlink/heartbeat";
/** @internal */
declare const MSG_DISCONNECT = "comlink/disconnect";
/** @internal */
declare const MSG_HANDSHAKE_SYN = "comlink/handshake/syn";
/** @internal */
declare const MSG_HANDSHAKE_SYN_ACK = "comlink/handshake/syn-ack";
/** @internal */
declare const MSG_HANDSHAKE_ACK = "comlink/handshake/ack";
/** @internal */
declare const HANDSHAKE_MSG_TYPES: string[];
/** @internal */
declare const INTERNAL_MSG_TYPES: string[];
/**
 * @public
 */
type Status = 'idle' | 'handshaking' | 'connected' | 'disconnected';
/**
 * @public
 */
type StatusEvent = {
  connection: string;
  status: Status;
};
/**
 * @public
 */
type MessageType = string;
/**
 * @public
 */
type MessageData = Record<string, unknown> | undefined;
/**
 * @public
 */
interface Message {
  type: MessageType;
  data?: MessageData;
  response?: MessageData;
}
/**
 * @public
 */
interface RequestData<TSends extends Message> {
  data?: MessageData;
  expectResponse?: boolean;
  responseTo?: string;
  type: MessageType;
  resolvable?: PromiseWithResolvers<TSends['response']>;
  options?: {
    responseTimeout?: number;
    signal?: AbortSignal;
    suppressWarnings?: boolean;
  };
}
/**
 * @public
 */
type WithoutResponse<TMessage extends Message> = Omit<TMessage, 'response'>;
/**
 * @public
 */
interface ListenInput {
  count?: number;
  domain: string;
  exclude: string[];
  from: string;
  include: string[];
  responseType: string;
  target: MessageEventSource | undefined;
  to: string;
}
/**
 * @public
 */
interface BufferAddedEmitEvent<TMessage extends Message> {
  type: 'buffer.added';
  message: TMessage;
}
/**
 * @public
 */
interface BufferFlushedEmitEvent<TMessage extends Message> {
  type: 'buffer.flushed';
  messages: TMessage[];
}
/**
 * @public
 */
interface HeartbeatEmitEvent {
  type: 'heartbeat';
}
/**
 * @public
 */
interface StatusEmitEvent {
  type: 'status';
  status: Status;
}
type MessageEmitEvent<TMessage extends Message> = {
  type: 'message';
  message: ProtocolMessage<TMessage>;
};
/**
 * @public
 */
type InternalEmitEvent<TSends extends Message, TReceives extends Message> = BufferAddedEmitEvent<TSends> | BufferFlushedEmitEvent<TReceives> | MessageEmitEvent<TReceives> | StatusEmitEvent;
/**
 * @public
 */
type ProtocolMessage<TMessage extends Message = Message> = {
  id: string;
  channelId: string;
  data?: TMessage['data'];
  domain: string;
  from: string;
  responseTo?: string;
  to: string;
  type: TMessage['type'];
};
/**
 * @public
 */
interface ResponseMessage {
  type: typeof MSG_RESPONSE;
  data: MessageData;
}
/**
 * @public
 */
interface HeartbeatMessage {
  type: typeof MSG_HEARTBEAT;
  data: undefined;
}
/**
 * @internal
 */
interface DisconnectMessage {
  type: typeof MSG_DISCONNECT;
  data: undefined;
}
/**
 * @internal
 */
type HandshakeMessageType = typeof MSG_HANDSHAKE_ACK | typeof MSG_HANDSHAKE_SYN | typeof MSG_HANDSHAKE_SYN_ACK;
/**
 * @internal
 */
type InternalMessageType = typeof MSG_DISCONNECT | typeof MSG_HANDSHAKE_ACK | typeof MSG_HANDSHAKE_SYN | typeof MSG_HANDSHAKE_SYN_ACK | typeof MSG_HEARTBEAT | typeof MSG_RESPONSE;
/**
 * @public
 */
interface RequestMachineContext<TSends extends Message> {
  channelId: string;
  data: MessageData | undefined;
  domain: string;
  expectResponse: boolean;
  from: string;
  id: string;
  parentRef: AnyActorRef;
  resolvable: PromiseWithResolvers<TSends['response']> | undefined;
  response: TSends['response'] | null;
  responseTimeout: number | undefined;
  responseTo: string | undefined;
  signal: AbortSignal | undefined;
  suppressWarnings: boolean | undefined;
  sources: Set<MessageEventSource>;
  targetOrigin: string;
  to: string;
  type: MessageType;
}
/**
 * @public
 */
type RequestActorRef<TSends extends Message> = ActorRefFrom<ReturnType<typeof createRequestMachine<TSends>>>;
/**
 * @public
 */
declare const createRequestMachine: <TSends extends Message>() => xstate1332.StateMachine<RequestMachineContext<TSends>, {
  type: "message";
  data: ProtocolMessage<ResponseMessage>;
} | {
  type: "abort";
}, {
  "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
    requestId: string;
    sources: Set<MessageEventSource>;
    signal?: AbortSignal;
  }, xstate1332.EventObject>> | undefined;
}, {
  src: "listen";
  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
    requestId: string;
    sources: Set<MessageEventSource>;
    signal?: AbortSignal;
  }, xstate1332.EventObject>;
  id: "listen for response";
}, xstate1332.Values<{
  "send message": {
    type: "send message";
    params: {
      message: ProtocolMessage;
    };
  };
  "on success": {
    type: "on success";
    params: xstate1332.NonReducibleUnknown;
  };
  "on fail": {
    type: "on fail";
    params: xstate1332.NonReducibleUnknown;
  };
  "on abort": {
    type: "on abort";
    params: xstate1332.NonReducibleUnknown;
  };
}>, {
  type: "expectsResponse";
  params: unknown;
}, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
  channelId: string;
  data?: TSends["data"];
  domain: string;
  expectResponse?: boolean;
  from: string;
  parentRef: AnyActorRef;
  resolvable?: PromiseWithResolvers<TSends["response"]>;
  responseTimeout?: number;
  responseTo?: string;
  signal?: AbortSignal;
  sources: Set<MessageEventSource> | MessageEventSource;
  suppressWarnings?: boolean;
  targetOrigin: string;
  to: string;
  type: TSends["type"];
}, {
  requestId: string;
  response: TSends["response"] | null;
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
  response: MessageData | null;
  responseTo: string | undefined;
}, xstate1332.MetaObject, {
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAD1gBd0GwT0AzFgJ2QNwdzoKAFVyowAewCuDItTRY8hUuSoBtAAwBdRKAAOE2P1wT8ukLUQBGAEwBWEgBYAnK+eOAzB7sB2DzY8rABoQAE9rDQc3V0cNTw8fAA4NHwBfVJCFHAJiElgwfAgCKGpNHSQQAyMBU3NLBDsrDxI7DTaAjQA2OOcNDxDwhHsNJx9Ou0TOq2cJxP9HdMyMbOU8gqL8ErUrcv1DY1qK+sbm1vaPLp6+gcRnGydo9wDGycWQLKVc9AB3dGNN6jiWCwdAwMrmKoHMxHRCJRKOEiJHwuZKBZwXKzBMKIGyYkhtAkXOweTqOHw2RJvD45Ug-P4CAH0JgsNicMA8LhwAz4fKicTSWTyZafWm-f5QcEVSE1aGgepwhFIlF9aYYrGDC4+JzEppjGzOUkeGbpDIgfASCBwczU5QQ-YyuqIAC0nRuCBd+IJXu9KSpwppZEoYDt1RMsosiEcNjdVjiJEeGisiSTHkcVgWpptuXyhWKIahjqGzi1BqRJINnVcdkcbuTLS9VYC8ISfsUAbp4vzDphCHJIyjBvJNlxNmRNexQ3sJGH43GPj8jWJrZWuXYfyoEC7YcLsbrgRsjkcvkmdgNbopVhIPhVfnsh8ClMz-tWsCkmEwcHgUvt257u8v+6Hse4xnhOdZnImVidPqCRNB4JqpEAA */
  readonly context: ({
    input
  }: {
    spawn: {
      <TSrc extends "listen">(logic: TSrc, ...[options]: {
        src: "listen";
        logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
          requestId: string;
          sources: Set<MessageEventSource>;
          signal?: AbortSignal;
        }, xstate1332.EventObject>;
        id: "listen for response";
      } extends infer T ? T extends {
        src: "listen";
        logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
          requestId: string;
          sources: Set<MessageEventSource>;
          signal?: AbortSignal;
        }, xstate1332.EventObject>;
        id: "listen for response";
      } ? T extends {
        src: TSrc;
      } ? xstate1332.ConditionalRequired<[options?: ({
        id?: T["id"] | undefined;
        systemId?: string;
        input?: xstate1332.InputFrom<T["logic"]> | undefined;
        syncSnapshot?: boolean;
      } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
        src: "listen";
        logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
          requestId: string;
          sources: Set<MessageEventSource>;
          signal?: AbortSignal;
        }, xstate1332.EventObject>;
        id: "listen for response";
      }, "src", TSrc>["logic"]>;
      <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
        id?: never;
        systemId?: string;
        input?: xstate1332.InputFrom<TLogic> | undefined;
        syncSnapshot?: boolean;
      } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
    };
    input: {
      channelId: string;
      data?: TSends["data"];
      domain: string;
      expectResponse?: boolean;
      from: string;
      parentRef: AnyActorRef;
      resolvable?: PromiseWithResolvers<TSends["response"]>;
      responseTimeout?: number;
      responseTo?: string;
      signal?: AbortSignal;
      sources: Set<MessageEventSource> | MessageEventSource;
      suppressWarnings?: boolean;
      targetOrigin: string;
      to: string;
      type: TSends["type"];
    };
    self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
      type: "message";
      data: ProtocolMessage<ResponseMessage>;
    } | {
      type: "abort";
    }, Record<string, AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
      type: "message";
      data: ProtocolMessage<ResponseMessage>;
    } | {
      type: "abort";
    }, xstate1332.AnyEventObject>;
  }) => {
    channelId: string;
    data: TSends["data"] | undefined;
    domain: string;
    expectResponse: boolean;
    from: string;
    id: string;
    parentRef: AnyActorRef;
    resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
    response: null;
    responseTimeout: number | undefined;
    responseTo: string | undefined;
    signal: AbortSignal | undefined;
    sources: Set<MessageEventSource>;
    suppressWarnings: boolean | undefined;
    targetOrigin: string;
    to: string;
    type: TSends["type"];
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
          context: RequestMachineContext<TSends>;
          event: {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          };
        }) => {
          message: {
            channelId: string;
            data: MessageData;
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
          context: RequestMachineContext<TSends>;
          event: {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          };
          self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          }, Record<string, AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          }, xstate1332.AnyEventObject>;
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
          readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          }, {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          }, undefined, {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, xstate1332.EventObject>;
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
    context: RequestMachineContext<TSends>;
    event: xstate1332.DoneStateEvent<unknown>;
    self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
      type: "message";
      data: ProtocolMessage<ResponseMessage>;
    } | {
      type: "abort";
    }, Record<string, AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
      type: "message";
      data: ProtocolMessage<ResponseMessage>;
    } | {
      type: "abort";
    }, xstate1332.AnyEventObject>;
  }) => {
    requestId: string;
    response: TSends["response"] | null;
    responseTo: string | undefined;
  };
}>;
/**
 * @public
 */
type ConnectionActorLogic<TSends extends Message, TReceives extends Message> = ReturnType<typeof createConnectionMachine<TSends, TReceives>>;
/**
 * @public
 */
type ConnectionActor<TSends extends Message, TReceives extends Message> = ActorRefFrom<ReturnType<typeof createConnectionMachine<TSends, TReceives>>>;
/**
 * @public
 */
type Connection<TSends extends Message = Message, TReceives extends Message = Message> = {
  actor: ConnectionActor<TSends, TReceives>;
  connect: () => void;
  disconnect: () => void;
  id: string;
  name: string;
  machine: ReturnType<typeof createConnectionMachine<TSends, TReceives>>;
  on: <TType extends TReceives['type'], TMessage extends Extract<TReceives, {
    type: TType;
  }>>(type: TType, handler: (data: TMessage['data']) => Promise<TMessage['response']> | TMessage['response']) => () => void;
  onStatus: (handler: (status: Status) => void, filter?: Status) => () => void;
  post: <TType extends TSends['type'], TMessage extends Extract<TSends, {
    type: TType;
  }>>(...params: (TMessage['data'] extends undefined ? [TType] : never) | [TType, TMessage['data']]) => void;
  setTarget: (target: MessageEventSource) => void;
  start: () => () => void;
  stop: () => void;
  target: MessageEventSource | undefined;
};
/**
 * @public
 */
interface ConnectionInput {
  connectTo: string;
  domain?: string;
  heartbeat?: boolean;
  name: string;
  id?: string;
  target?: MessageEventSource;
  targetOrigin: string;
}
/**
 * @public
 */
declare const createConnectionMachine: <TSends extends Message,
// Sends
TReceives extends Message,
// Receives
TSendsWithoutResponse extends WithoutResponse<TSends> = WithoutResponse<TSends>>() => xstate1332.StateMachine<{
  buffer: Array<TSendsWithoutResponse>;
  channelId: string;
  connectTo: string;
  domain: string;
  heartbeat: boolean;
  id: string;
  name: string;
  requests: Array<RequestActorRef<TSends>>;
  target: MessageEventSource | undefined;
  targetOrigin: string;
}, {
  type: "connect";
} | {
  type: "disconnect";
} | {
  type: "message.received";
  message: MessageEvent<ProtocolMessage<TReceives>>;
} | {
  type: "post";
  data: TSendsWithoutResponse;
} | {
  type: "response";
  respondTo: string;
  data: Pick<TSends, "response">;
} | {
  type: "request.aborted";
  requestId: string;
} | {
  type: "request.failed";
  requestId: string;
} | {
  type: "request.success";
  requestId: string;
  response: TSends["response"] | null;
  responseTo: string | undefined;
} | {
  type: "request";
  data: RequestData<TSends> | RequestData<TSends>[];
} | {
  type: "syn";
} | {
  type: "target.set";
  target: MessageEventSource;
}, {
  [x: string]: xstate1332.ActorRefFromLogic<xstate1332.StateMachine<RequestMachineContext<TSends>, {
    type: "message";
    data: ProtocolMessage<ResponseMessage>;
  } | {
    type: "abort";
  }, {
    "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
      requestId: string;
      sources: Set<MessageEventSource>;
      signal?: AbortSignal;
    }, EventObject>> | undefined;
  }, {
    src: "listen";
    logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
      requestId: string;
      sources: Set<MessageEventSource>;
      signal?: AbortSignal;
    }, EventObject>;
    id: "listen for response";
  }, xstate1332.Values<{
    "send message": {
      type: "send message";
      params: {
        message: ProtocolMessage;
      };
    };
    "on success": {
      type: "on success";
      params: xstate1332.NonReducibleUnknown;
    };
    "on fail": {
      type: "on fail";
      params: xstate1332.NonReducibleUnknown;
    };
    "on abort": {
      type: "on abort";
      params: xstate1332.NonReducibleUnknown;
    };
  }>, {
    type: "expectsResponse";
    params: unknown;
  }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
    channelId: string;
    data?: TSends["data"] | undefined;
    domain: string;
    expectResponse?: boolean;
    from: string;
    parentRef: xstate1332.AnyActorRef;
    resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
    responseTimeout?: number;
    responseTo?: string;
    signal?: AbortSignal;
    sources: Set<MessageEventSource> | MessageEventSource;
    suppressWarnings?: boolean;
    targetOrigin: string;
    to: string;
    type: TSends["type"];
  }, {
    requestId: string;
    response: TSends["response"] | null;
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
    response: MessageData | null;
    responseTo: string | undefined;
  }, xstate1332.MetaObject, {
    readonly context: ({
      input
    }: {
      spawn: {
        <TSrc extends "listen">(logic: TSrc, ...[options]: {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>;
          id: "listen for response";
        } extends infer T ? T extends {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>;
          id: "listen for response";
        } ? T extends {
          src: TSrc;
        } ? xstate1332.ConditionalRequired<[options?: ({
          id?: T["id"] | undefined;
          systemId?: string;
          input?: xstate1332.InputFrom<T["logic"]> | undefined;
          syncSnapshot?: boolean;
        } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>;
          id: "listen for response";
        }, "src", TSrc>["logic"]>;
        <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
          id?: never;
          systemId?: string;
          input?: xstate1332.InputFrom<TLogic> | undefined;
          syncSnapshot?: boolean;
        } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
      };
      input: {
        channelId: string;
        data?: TSends["data"] | undefined;
        domain: string;
        expectResponse?: boolean;
        from: string;
        parentRef: xstate1332.AnyActorRef;
        resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
        responseTimeout?: number;
        responseTo?: string;
        signal?: AbortSignal;
        sources: Set<MessageEventSource> | MessageEventSource;
        suppressWarnings?: boolean;
        targetOrigin: string;
        to: string;
        type: TSends["type"];
      };
      self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, xstate1332.AnyEventObject>;
    }) => {
      channelId: string;
      data: TSends["data"] | undefined;
      domain: string;
      expectResponse: boolean;
      from: string;
      id: string;
      parentRef: xstate1332.AnyActorRef;
      resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
      response: null;
      responseTimeout: number | undefined;
      responseTo: string | undefined;
      signal: AbortSignal | undefined;
      sources: Set<MessageEventSource>;
      suppressWarnings: boolean | undefined;
      targetOrigin: string;
      to: string;
      type: TSends["type"];
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
            context: RequestMachineContext<TSends>;
            event: {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            };
          }) => {
            message: {
              channelId: string;
              data: MessageData;
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
            context: RequestMachineContext<TSends>;
            event: {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            };
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
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
            readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            }, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, undefined, {
              src: "listen";
              logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                requestId: string;
                sources: Set<MessageEventSource>;
                signal?: AbortSignal;
              }, EventObject>;
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
      context: RequestMachineContext<TSends>;
      event: xstate1332.DoneStateEvent<unknown>;
      self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, xstate1332.AnyEventObject>;
    }) => {
      requestId: string;
      response: TSends["response"] | null;
      responseTo: string | undefined;
    };
  }>> | xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, EventObject>> | xstate1332.ActorRefFromLogic<xstate1332.CallbackActorLogic<EventObject, {
    event: EventObject;
    immediate?: boolean;
    interval: number;
  }, EventObject>> | undefined;
  "listen for handshake"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, EventObject>> | undefined;
  "listen for messages"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, EventObject>> | undefined;
  "send heartbeat"?: xstate1332.ActorRefFromLogic<xstate1332.CallbackActorLogic<EventObject, {
    event: EventObject;
    immediate?: boolean;
    interval: number;
  }, EventObject>> | undefined;
  "send syn"?: xstate1332.ActorRefFromLogic<xstate1332.CallbackActorLogic<EventObject, {
    event: EventObject;
    immediate?: boolean;
    interval: number;
  }, EventObject>> | undefined;
}, xstate1332.Values<{
  listen: {
    src: "listen";
    logic: xstate1332.ObservableActorLogic<{
      type: string;
      message: MessageEvent<ProtocolMessage>;
    }, ListenInput, EventObject>;
    id: "listen for handshake" | "listen for messages";
  };
  sendBackAtInterval: {
    src: "sendBackAtInterval";
    logic: xstate1332.CallbackActorLogic<EventObject, {
      event: EventObject;
      immediate?: boolean;
      interval: number;
    }, EventObject>;
    id: "send heartbeat" | "send syn";
  };
  requestMachine: {
    src: "requestMachine";
    logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
      type: "message";
      data: ProtocolMessage<ResponseMessage>;
    } | {
      type: "abort";
    }, {
      "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
        requestId: string;
        sources: Set<MessageEventSource>;
        signal?: AbortSignal;
      }, EventObject>> | undefined;
    }, {
      src: "listen";
      logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
        requestId: string;
        sources: Set<MessageEventSource>;
        signal?: AbortSignal;
      }, EventObject>;
      id: "listen for response";
    }, xstate1332.Values<{
      "send message": {
        type: "send message";
        params: {
          message: ProtocolMessage;
        };
      };
      "on success": {
        type: "on success";
        params: xstate1332.NonReducibleUnknown;
      };
      "on fail": {
        type: "on fail";
        params: xstate1332.NonReducibleUnknown;
      };
      "on abort": {
        type: "on abort";
        params: xstate1332.NonReducibleUnknown;
      };
    }>, {
      type: "expectsResponse";
      params: unknown;
    }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
      channelId: string;
      data?: TSends["data"] | undefined;
      domain: string;
      expectResponse?: boolean;
      from: string;
      parentRef: xstate1332.AnyActorRef;
      resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
      responseTimeout?: number;
      responseTo?: string;
      signal?: AbortSignal;
      sources: Set<MessageEventSource> | MessageEventSource;
      suppressWarnings?: boolean;
      targetOrigin: string;
      to: string;
      type: TSends["type"];
    }, {
      requestId: string;
      response: TSends["response"] | null;
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
      response: MessageData | null;
      responseTo: string | undefined;
    }, xstate1332.MetaObject, {
      readonly context: ({
        input
      }: {
        spawn: {
          <TSrc extends "listen">(logic: TSrc, ...[options]: {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, EventObject>;
            id: "listen for response";
          } extends infer T ? T extends {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, EventObject>;
            id: "listen for response";
          } ? T extends {
            src: TSrc;
          } ? xstate1332.ConditionalRequired<[options?: ({
            id?: T["id"] | undefined;
            systemId?: string;
            input?: xstate1332.InputFrom<T["logic"]> | undefined;
            syncSnapshot?: boolean;
          } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, EventObject>;
            id: "listen for response";
          }, "src", TSrc>["logic"]>;
          <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
            id?: never;
            systemId?: string;
            input?: xstate1332.InputFrom<TLogic> | undefined;
            syncSnapshot?: boolean;
          } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
        };
        input: {
          channelId: string;
          data?: TSends["data"] | undefined;
          domain: string;
          expectResponse?: boolean;
          from: string;
          parentRef: xstate1332.AnyActorRef;
          resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
          responseTimeout?: number;
          responseTo?: string;
          signal?: AbortSignal;
          sources: Set<MessageEventSource> | MessageEventSource;
          suppressWarnings?: boolean;
          targetOrigin: string;
          to: string;
          type: TSends["type"];
        };
        self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, xstate1332.AnyEventObject>;
      }) => {
        channelId: string;
        data: TSends["data"] | undefined;
        domain: string;
        expectResponse: boolean;
        from: string;
        id: string;
        parentRef: xstate1332.AnyActorRef;
        resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
        response: null;
        responseTimeout: number | undefined;
        responseTo: string | undefined;
        signal: AbortSignal | undefined;
        sources: Set<MessageEventSource>;
        suppressWarnings: boolean | undefined;
        targetOrigin: string;
        to: string;
        type: TSends["type"];
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
              context: RequestMachineContext<TSends>;
              event: {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              };
            }) => {
              message: {
                channelId: string;
                data: MessageData;
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
              context: RequestMachineContext<TSends>;
              event: {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              };
              self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, xstate1332.AnyEventObject>;
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
              readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              }, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, undefined, {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
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
        context: RequestMachineContext<TSends>;
        event: xstate1332.DoneStateEvent<unknown>;
        self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, xstate1332.AnyEventObject>;
      }) => {
        requestId: string;
        response: TSends["response"] | null;
        responseTo: string | undefined;
      };
    }>;
    id: string | undefined;
  };
}>, xstate1332.Values<{
  "buffer message": {
    type: "buffer message";
    params: xstate1332.NonReducibleUnknown;
  };
  "create request": {
    type: "create request";
    params: xstate1332.NonReducibleUnknown;
  };
  "emit received message": {
    type: "emit received message";
    params: xstate1332.NonReducibleUnknown;
  };
  "emit status": {
    type: "emit status";
    params: {
      status: Status;
    };
  };
  "post message": {
    type: "post message";
    params: xstate1332.NonReducibleUnknown;
  };
  "remove request": {
    type: "remove request";
    params: xstate1332.NonReducibleUnknown;
  };
  respond: {
    type: "respond";
    params: xstate1332.NonReducibleUnknown;
  };
  "send handshake ack": {
    type: "send handshake ack";
    params: xstate1332.NonReducibleUnknown;
  };
  "send disconnect": {
    type: "send disconnect";
    params: xstate1332.NonReducibleUnknown;
  };
  "send handshake syn": {
    type: "send handshake syn";
    params: xstate1332.NonReducibleUnknown;
  };
  "send pending messages": {
    type: "send pending messages";
    params: xstate1332.NonReducibleUnknown;
  };
  "set target": {
    type: "set target";
    params: xstate1332.NonReducibleUnknown;
  };
}>, xstate1332.Values<{
  "has target": {
    type: "has target";
    params: unknown;
  };
  "should send heartbeats": {
    type: "should send heartbeats";
    params: unknown;
  };
}>, never, "idle" | "handshaking" | "disconnected" | {
  connected: {
    heartbeat: "sending" | "checking";
  };
}, string, ConnectionInput, xstate1332.NonReducibleUnknown, BufferAddedEmitEvent<TSendsWithoutResponse> | BufferFlushedEmitEvent<TSendsWithoutResponse> | MessageEmitEvent<TReceives> | StatusEmitEvent, xstate1332.MetaObject, {
  /** @xstate-layout N4IgpgJg5mDOIC5QGMAWBDAdpsAbAxAC7oBOMhAdLGIQNoAMAuoqAA4D2sAloV+5ixAAPRAHZRAJgoAWABz0ArHICMy2QGZZCgJwAaEAE9EE+tIrb6ANgkLl46fTuj1AXxf60WHARJgAjgCucJSwAcjIcLAMzEggHNy8-IIiCKLS2hQS6qb2yurisrL6RgjK9LIyCuqq0g7WstZuHhjYePi+gcEUAGboXLiQ0YLxPHwCsSmiCgoykpayDtqS6trqxYjKEk0gnq24FFwQA-jI-DjIdEzDnKNJExuOZpZ12eq29OrSCuupypYUojUaTKCnm5Wk2123gORzA+HilxibBuiXGoBSGnUAIU4gU9FWamUtR+lmUM1EllBEkslMUEnpkJa0JaEFgGAA1lxMFB8LADJghrERqjkhtshk3mTtNo5OpqpYfqCKhTptoqpY1WUtu4dky8BQWWz0Jzue1-EFYIjrgkxqLSupqRRPpoPqJtLI0hIioZENJJE7NnJ8ZYHVk1YyvPrDRyuTyEYLkTa7uixVlMh81KGFhS1j6EPkZlpVjTphr8mkI3sDVhWTHTQBbSLoGAUXwRLgAN0GVyFKNt91KimUFEKXvKC2s9R+6X+jipnzJeSqEJ1UKjNaNJp5EC4sFOrQuCbifeTwg2cgoym0RPxDtqkj0eaB9Ao8zSolMEivZVcq71+33c5CEgeFOCtXskzRM8EDxKRpmkSw3QJbQsmpH5tHmV8JHSbJpDsakV2aSMALOMALhAjoLXAxNbiglI-SxWw1Vw0QNDw0Qfg9KQ7EJSxHHxApK2hQCyOAiAzVgDhMGoI9hX7FMEHSF8cWkelpHURCbBsb481xAEgT9BQJCmWQsiE-URPI8TG1gWBmzAVsyLATtuyRY9ILtWoKmlL82Kqd0tAVJ91LMHFZDKIkVlkNVZHMkiDzE-Adz3UjDx7GiRQHCKnheD53k+HSSkDDIwpBVTqQwuKKEssSDTAUhCAAI3qyg0DIrd8Fkk86MQUMnVM+RynoegTDJH48hGp0vR-FDRqqKqasgOqGua9AQjATAd1NSiul6fpXOtWi7Wy19cslD4vnG7IX3oVjVDUVYEJQqrksW8SdstLqPKy0wKgG1RhtMWogqKhoMjkWp6XxUyFBe3c3tAz70vco6fq+V8PTkGUFzdQqNnELEM2yClrwwzQ4ZShKQJqr7UYU98AS0W9pT4z5pHG0yXwMkNNTyGk3B1TB2AgOBBDXXBDsyhSFG9EovQqN5i1JeRcKqw4Bkl+ToMx8x0j+EaqQ9XMSkBURMgMkEwQWKro2NWNNdPFJAzN0lJGM4slDxhBEJfXyplBd03wW1KxIdnrBxBh4JAyW75C8rJpmDqmIGWkgmpasPjqUcaHooMLHA0uU1UkJOgKW1B6rT1bWor5At0zgcTAkK7hrz1irB0D8cW0UvRPLyv07WqgNq2qAG+l9SnXUz0UOXD5xuMs3Y4+DVJBX7UiKrV6Q8gcfoJO54rFefLLqfJYX1WKYNLxL4NO1NwgA */
  readonly id: "connection";
  readonly context: ({
    input
  }: {
    spawn: {
      <TSrc extends "listen" | "sendBackAtInterval" | "requestMachine">(logic: TSrc, ...[options]: ({
        src: "listen";
        logic: xstate1332.ObservableActorLogic<{
          type: string;
          message: MessageEvent<ProtocolMessage>;
        }, ListenInput, EventObject>;
        id: "listen for handshake" | "listen for messages";
      } extends infer T ? T extends {
        src: "listen";
        logic: xstate1332.ObservableActorLogic<{
          type: string;
          message: MessageEvent<ProtocolMessage>;
        }, ListenInput, EventObject>;
        id: "listen for handshake" | "listen for messages";
      } ? T extends {
        src: TSrc;
      } ? xstate1332.ConditionalRequired<[options?: ({
        id?: T["id"] | undefined;
        systemId?: string;
        input?: xstate1332.InputFrom<T["logic"]> | undefined;
        syncSnapshot?: boolean;
      } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never) | ({
        src: "sendBackAtInterval";
        logic: xstate1332.CallbackActorLogic<EventObject, {
          event: EventObject;
          immediate?: boolean;
          interval: number;
        }, EventObject>;
        id: "send heartbeat" | "send syn";
      } extends infer T_1 ? T_1 extends {
        src: "sendBackAtInterval";
        logic: xstate1332.CallbackActorLogic<EventObject, {
          event: EventObject;
          immediate?: boolean;
          interval: number;
        }, EventObject>;
        id: "send heartbeat" | "send syn";
      } ? T_1 extends {
        src: TSrc;
      } ? xstate1332.ConditionalRequired<[options?: ({
        id?: T_1["id"] | undefined;
        systemId?: string;
        input?: xstate1332.InputFrom<T_1["logic"]> | undefined;
        syncSnapshot?: boolean;
      } & { [K_1 in xstate1332.RequiredActorOptions<T_1>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_1>>> : never : never : never) | ({
        src: "requestMachine";
        logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, {
          "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>> | undefined;
        }, {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>;
          id: "listen for response";
        }, xstate1332.Values<{
          "send message": {
            type: "send message";
            params: {
              message: ProtocolMessage;
            };
          };
          "on success": {
            type: "on success";
            params: xstate1332.NonReducibleUnknown;
          };
          "on fail": {
            type: "on fail";
            params: xstate1332.NonReducibleUnknown;
          };
          "on abort": {
            type: "on abort";
            params: xstate1332.NonReducibleUnknown;
          };
        }>, {
          type: "expectsResponse";
          params: unknown;
        }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
          channelId: string;
          data?: TSends["data"] | undefined;
          domain: string;
          expectResponse?: boolean;
          from: string;
          parentRef: xstate1332.AnyActorRef;
          resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
          responseTimeout?: number;
          responseTo?: string;
          signal?: AbortSignal;
          sources: Set<MessageEventSource> | MessageEventSource;
          suppressWarnings?: boolean;
          targetOrigin: string;
          to: string;
          type: TSends["type"];
        }, {
          requestId: string;
          response: TSends["response"] | null;
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
          response: MessageData | null;
          responseTo: string | undefined;
        }, xstate1332.MetaObject, {
          readonly context: ({
            input
          }: {
            spawn: {
              <TSrc_1 extends "listen">(logic: TSrc_1, ...[options]: {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
                id: "listen for response";
              } extends infer T_2 ? T_2 extends {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
                id: "listen for response";
              } ? T_2 extends {
                src: TSrc_1;
              } ? xstate1332.ConditionalRequired<[options?: ({
                id?: T_2["id"] | undefined;
                systemId?: string;
                input?: xstate1332.InputFrom<T_2["logic"]> | undefined;
                syncSnapshot?: boolean;
              } & { [K_2 in xstate1332.RequiredActorOptions<T_2>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_2>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
                id: "listen for response";
              }, "src", TSrc_1>["logic"]>;
              <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
                id?: never;
                systemId?: string;
                input?: xstate1332.InputFrom<TLogic> | undefined;
                syncSnapshot?: boolean;
              } & { [K_2 in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
            };
            input: {
              channelId: string;
              data?: TSends["data"] | undefined;
              domain: string;
              expectResponse?: boolean;
              from: string;
              parentRef: xstate1332.AnyActorRef;
              resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
              responseTimeout?: number;
              responseTo?: string;
              signal?: AbortSignal;
              sources: Set<MessageEventSource> | MessageEventSource;
              suppressWarnings?: boolean;
              targetOrigin: string;
              to: string;
              type: TSends["type"];
            };
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            channelId: string;
            data: TSends["data"] | undefined;
            domain: string;
            expectResponse: boolean;
            from: string;
            id: string;
            parentRef: xstate1332.AnyActorRef;
            resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
            response: null;
            responseTimeout: number | undefined;
            responseTo: string | undefined;
            signal: AbortSignal | undefined;
            sources: Set<MessageEventSource>;
            suppressWarnings: boolean | undefined;
            targetOrigin: string;
            to: string;
            type: TSends["type"];
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                }) => {
                  message: {
                    channelId: string;
                    data: MessageData;
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                  self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, xstate1332.AnyEventObject>;
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
                  readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  }, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, undefined, {
                    src: "listen";
                    logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                      requestId: string;
                      sources: Set<MessageEventSource>;
                      signal?: AbortSignal;
                    }, EventObject>;
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
            context: RequestMachineContext<TSends>;
            event: xstate1332.DoneStateEvent<unknown>;
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          };
        }>;
        id: string | undefined;
      } extends infer T_2 ? T_2 extends {
        src: "requestMachine";
        logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, {
          "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>> | undefined;
        }, {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, EventObject>;
          id: "listen for response";
        }, xstate1332.Values<{
          "send message": {
            type: "send message";
            params: {
              message: ProtocolMessage;
            };
          };
          "on success": {
            type: "on success";
            params: xstate1332.NonReducibleUnknown;
          };
          "on fail": {
            type: "on fail";
            params: xstate1332.NonReducibleUnknown;
          };
          "on abort": {
            type: "on abort";
            params: xstate1332.NonReducibleUnknown;
          };
        }>, {
          type: "expectsResponse";
          params: unknown;
        }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
          channelId: string;
          data?: TSends["data"] | undefined;
          domain: string;
          expectResponse?: boolean;
          from: string;
          parentRef: xstate1332.AnyActorRef;
          resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
          responseTimeout?: number;
          responseTo?: string;
          signal?: AbortSignal;
          sources: Set<MessageEventSource> | MessageEventSource;
          suppressWarnings?: boolean;
          targetOrigin: string;
          to: string;
          type: TSends["type"];
        }, {
          requestId: string;
          response: TSends["response"] | null;
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
          response: MessageData | null;
          responseTo: string | undefined;
        }, xstate1332.MetaObject, {
          readonly context: ({
            input
          }: {
            spawn: {
              <TSrc_1 extends "listen">(logic: TSrc_1, ...[options]: {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
                id: "listen for response";
              } extends infer T_3 ? T_3 extends {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
                id: "listen for response";
              } ? T_3 extends {
                src: TSrc_1;
              } ? xstate1332.ConditionalRequired<[options?: ({
                id?: T_3["id"] | undefined;
                systemId?: string;
                input?: xstate1332.InputFrom<T_3["logic"]> | undefined;
                syncSnapshot?: boolean;
              } & { [K_3 in xstate1332.RequiredActorOptions<T_3>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_3>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, EventObject>;
                id: "listen for response";
              }, "src", TSrc_1>["logic"]>;
              <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
                id?: never;
                systemId?: string;
                input?: xstate1332.InputFrom<TLogic> | undefined;
                syncSnapshot?: boolean;
              } & { [K_3 in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
            };
            input: {
              channelId: string;
              data?: TSends["data"] | undefined;
              domain: string;
              expectResponse?: boolean;
              from: string;
              parentRef: xstate1332.AnyActorRef;
              resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
              responseTimeout?: number;
              responseTo?: string;
              signal?: AbortSignal;
              sources: Set<MessageEventSource> | MessageEventSource;
              suppressWarnings?: boolean;
              targetOrigin: string;
              to: string;
              type: TSends["type"];
            };
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            channelId: string;
            data: TSends["data"] | undefined;
            domain: string;
            expectResponse: boolean;
            from: string;
            id: string;
            parentRef: xstate1332.AnyActorRef;
            resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
            response: null;
            responseTimeout: number | undefined;
            responseTo: string | undefined;
            signal: AbortSignal | undefined;
            sources: Set<MessageEventSource>;
            suppressWarnings: boolean | undefined;
            targetOrigin: string;
            to: string;
            type: TSends["type"];
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                }) => {
                  message: {
                    channelId: string;
                    data: MessageData;
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                  self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, xstate1332.AnyEventObject>;
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
                  readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  }, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, undefined, {
                    src: "listen";
                    logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                      requestId: string;
                      sources: Set<MessageEventSource>;
                      signal?: AbortSignal;
                    }, EventObject>;
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
            context: RequestMachineContext<TSends>;
            event: xstate1332.DoneStateEvent<unknown>;
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          };
        }>;
        id: string | undefined;
      } ? T_2 extends {
        src: TSrc;
      } ? xstate1332.ConditionalRequired<[options?: ({
        id?: T_2["id"] | undefined;
        systemId?: string;
        input?: xstate1332.InputFrom<T_2["logic"]> | undefined;
        syncSnapshot?: boolean;
      } & { [K_2 in xstate1332.RequiredActorOptions<T_2>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_2>>> : never : never : never)): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<xstate1332.Values<{
        listen: {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<{
            type: string;
            message: MessageEvent<ProtocolMessage>;
          }, ListenInput, EventObject>;
          id: "listen for handshake" | "listen for messages";
        };
        sendBackAtInterval: {
          src: "sendBackAtInterval";
          logic: xstate1332.CallbackActorLogic<EventObject, {
            event: EventObject;
            immediate?: boolean;
            interval: number;
          }, EventObject>;
          id: "send heartbeat" | "send syn";
        };
        requestMachine: {
          src: "requestMachine";
          logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          }, {
            "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, EventObject>> | undefined;
          }, {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, EventObject>;
            id: "listen for response";
          }, xstate1332.Values<{
            "send message": {
              type: "send message";
              params: {
                message: ProtocolMessage;
              };
            };
            "on success": {
              type: "on success";
              params: xstate1332.NonReducibleUnknown;
            };
            "on fail": {
              type: "on fail";
              params: xstate1332.NonReducibleUnknown;
            };
            "on abort": {
              type: "on abort";
              params: xstate1332.NonReducibleUnknown;
            };
          }>, {
            type: "expectsResponse";
            params: unknown;
          }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
            channelId: string;
            data?: TSends["data"] | undefined;
            domain: string;
            expectResponse?: boolean;
            from: string;
            parentRef: xstate1332.AnyActorRef;
            resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
            responseTimeout?: number;
            responseTo?: string;
            signal?: AbortSignal;
            sources: Set<MessageEventSource> | MessageEventSource;
            suppressWarnings?: boolean;
            targetOrigin: string;
            to: string;
            type: TSends["type"];
          }, {
            requestId: string;
            response: TSends["response"] | null;
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
            response: MessageData | null;
            responseTo: string | undefined;
          }, xstate1332.MetaObject, {
            readonly context: ({
              input
            }: {
              spawn: {
                <TSrc_1 extends "listen">(logic: TSrc_1, ...[options]: {
                  src: "listen";
                  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                    requestId: string;
                    sources: Set<MessageEventSource>;
                    signal?: AbortSignal;
                  }, EventObject>;
                  id: "listen for response";
                } extends infer T_3 ? T_3 extends {
                  src: "listen";
                  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                    requestId: string;
                    sources: Set<MessageEventSource>;
                    signal?: AbortSignal;
                  }, EventObject>;
                  id: "listen for response";
                } ? T_3 extends {
                  src: TSrc_1;
                } ? xstate1332.ConditionalRequired<[options?: ({
                  id?: T_3["id"] | undefined;
                  systemId?: string;
                  input?: xstate1332.InputFrom<T_3["logic"]> | undefined;
                  syncSnapshot?: boolean;
                } & { [K_3 in xstate1332.RequiredActorOptions<T_3>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_3>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
                  src: "listen";
                  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                    requestId: string;
                    sources: Set<MessageEventSource>;
                    signal?: AbortSignal;
                  }, EventObject>;
                  id: "listen for response";
                }, "src", TSrc_1>["logic"]>;
                <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
                  id?: never;
                  systemId?: string;
                  input?: xstate1332.InputFrom<TLogic> | undefined;
                  syncSnapshot?: boolean;
                } & { [K_3 in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
              };
              input: {
                channelId: string;
                data?: TSends["data"] | undefined;
                domain: string;
                expectResponse?: boolean;
                from: string;
                parentRef: xstate1332.AnyActorRef;
                resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
                responseTimeout?: number;
                responseTo?: string;
                signal?: AbortSignal;
                sources: Set<MessageEventSource> | MessageEventSource;
                suppressWarnings?: boolean;
                targetOrigin: string;
                to: string;
                type: TSends["type"];
              };
              self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, xstate1332.AnyEventObject>;
            }) => {
              channelId: string;
              data: TSends["data"] | undefined;
              domain: string;
              expectResponse: boolean;
              from: string;
              id: string;
              parentRef: xstate1332.AnyActorRef;
              resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
              response: null;
              responseTimeout: number | undefined;
              responseTo: string | undefined;
              signal: AbortSignal | undefined;
              sources: Set<MessageEventSource>;
              suppressWarnings: boolean | undefined;
              targetOrigin: string;
              to: string;
              type: TSends["type"];
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
                    context: RequestMachineContext<TSends>;
                    event: {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    };
                  }) => {
                    message: {
                      channelId: string;
                      data: MessageData;
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
                    context: RequestMachineContext<TSends>;
                    event: {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    };
                    self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    }, xstate1332.AnyEventObject>;
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
                    readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    }, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    }, undefined, {
                      src: "listen";
                      logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                        requestId: string;
                        sources: Set<MessageEventSource>;
                        signal?: AbortSignal;
                      }, EventObject>;
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
              context: RequestMachineContext<TSends>;
              event: xstate1332.DoneStateEvent<unknown>;
              self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, xstate1332.AnyEventObject>;
            }) => {
              requestId: string;
              response: TSends["response"] | null;
              responseTo: string | undefined;
            };
          }>;
          id: string | undefined;
        };
      }>, "src", TSrc>["logic"]>;
      <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
        id?: never;
        systemId?: string;
        input?: xstate1332.InputFrom<TLogic> | undefined;
        syncSnapshot?: boolean;
      } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
    };
    input: ConnectionInput;
    self: xstate1332.ActorRef<xstate1332.MachineSnapshot<{
      buffer: Array<TSendsWithoutResponse>;
      channelId: string;
      connectTo: string;
      domain: string;
      heartbeat: boolean;
      id: string;
      name: string;
      requests: Array<RequestActorRef<TSends>>;
      target: MessageEventSource | undefined;
      targetOrigin: string;
    }, {
      type: "connect";
    } | {
      type: "disconnect";
    } | {
      type: "message.received";
      message: MessageEvent<ProtocolMessage<TReceives>>;
    } | {
      type: "post";
      data: TSendsWithoutResponse;
    } | {
      type: "response";
      respondTo: string;
      data: Pick<TSends, "response">;
    } | {
      type: "request.aborted";
      requestId: string;
    } | {
      type: "request.failed";
      requestId: string;
    } | {
      type: "request.success";
      requestId: string;
      response: TSends["response"] | null;
      responseTo: string | undefined;
    } | {
      type: "request";
      data: RequestData<TSends> | RequestData<TSends>[];
    } | {
      type: "syn";
    } | {
      type: "target.set";
      target: MessageEventSource;
    }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
      type: "connect";
    } | {
      type: "disconnect";
    } | {
      type: "message.received";
      message: MessageEvent<ProtocolMessage<TReceives>>;
    } | {
      type: "post";
      data: TSendsWithoutResponse;
    } | {
      type: "response";
      respondTo: string;
      data: Pick<TSends, "response">;
    } | {
      type: "request.aborted";
      requestId: string;
    } | {
      type: "request.failed";
      requestId: string;
    } | {
      type: "request.success";
      requestId: string;
      response: TSends["response"] | null;
      responseTo: string | undefined;
    } | {
      type: "request";
      data: RequestData<TSends> | RequestData<TSends>[];
    } | {
      type: "syn";
    } | {
      type: "target.set";
      target: MessageEventSource;
    }, xstate1332.AnyEventObject>;
  }) => {
    id: string;
    buffer: never[];
    channelId: string;
    connectTo: string;
    domain: string;
    heartbeat: boolean;
    name: string;
    requests: never[];
    target: MessageEventSource | undefined;
    targetOrigin: string;
  };
  readonly on: {
    readonly 'target.set': {
      readonly actions: "set target";
    };
    readonly 'request.success': {
      readonly actions: "remove request";
    };
    readonly 'request.failed': {
      readonly actions: "remove request";
    };
  };
  readonly initial: "idle";
  readonly states: {
    readonly idle: {
      readonly entry: readonly [{
        readonly type: "emit status";
        readonly params: {
          readonly status: "idle";
        };
      }];
      readonly on: {
        readonly connect: {
          readonly target: "handshaking";
          readonly guard: "has target";
        };
        readonly post: {
          readonly actions: "buffer message";
        };
      };
    };
    readonly handshaking: {
      readonly id: "handshaking";
      readonly entry: readonly [{
        readonly type: "emit status";
        readonly params: {
          readonly status: "handshaking";
        };
      }];
      readonly invoke: readonly [{
        readonly id: "send syn";
        readonly src: "sendBackAtInterval";
        readonly input: () => {
          event: {
            type: string;
          };
          interval: number;
          immediate: true;
        };
      }, {
        readonly id: "listen for handshake";
        readonly src: "listen";
        readonly input: (input: {
          context: {
            buffer: Array<TSendsWithoutResponse>;
            channelId: string;
            connectTo: string;
            domain: string;
            heartbeat: boolean;
            id: string;
            name: string;
            requests: Array<RequestActorRef<TSends>>;
            target: MessageEventSource | undefined;
            targetOrigin: string;
          };
          event: {
            type: "connect";
          } | {
            type: "disconnect";
          } | {
            type: "message.received";
            message: MessageEvent<ProtocolMessage<TReceives>>;
          } | {
            type: "post";
            data: TSendsWithoutResponse;
          } | {
            type: "response";
            respondTo: string;
            data: Pick<TSends, "response">;
          } | {
            type: "request.aborted";
            requestId: string;
          } | {
            type: "request.failed";
            requestId: string;
          } | {
            type: "request.success";
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          } | {
            type: "request";
            data: RequestData<TSends> | RequestData<TSends>[];
          } | {
            type: "syn";
          } | {
            type: "target.set";
            target: MessageEventSource;
          };
          self: xstate1332.ActorRef<xstate1332.MachineSnapshot<{
            buffer: Array<TSendsWithoutResponse>;
            channelId: string;
            connectTo: string;
            domain: string;
            heartbeat: boolean;
            id: string;
            name: string;
            requests: Array<RequestActorRef<TSends>>;
            target: MessageEventSource | undefined;
            targetOrigin: string;
          }, {
            type: "connect";
          } | {
            type: "disconnect";
          } | {
            type: "message.received";
            message: MessageEvent<ProtocolMessage<TReceives>>;
          } | {
            type: "post";
            data: TSendsWithoutResponse;
          } | {
            type: "response";
            respondTo: string;
            data: Pick<TSends, "response">;
          } | {
            type: "request.aborted";
            requestId: string;
          } | {
            type: "request.failed";
            requestId: string;
          } | {
            type: "request.success";
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          } | {
            type: "request";
            data: RequestData<TSends> | RequestData<TSends>[];
          } | {
            type: "syn";
          } | {
            type: "target.set";
            target: MessageEventSource;
          }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
            type: "connect";
          } | {
            type: "disconnect";
          } | {
            type: "message.received";
            message: MessageEvent<ProtocolMessage<TReceives>>;
          } | {
            type: "post";
            data: TSendsWithoutResponse;
          } | {
            type: "response";
            respondTo: string;
            data: Pick<TSends, "response">;
          } | {
            type: "request.aborted";
            requestId: string;
          } | {
            type: "request.failed";
            requestId: string;
          } | {
            type: "request.success";
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          } | {
            type: "request";
            data: RequestData<TSends> | RequestData<TSends>[];
          } | {
            type: "syn";
          } | {
            type: "target.set";
            target: MessageEventSource;
          }, xstate1332.AnyEventObject>;
        }) => ListenInput;
      }];
      readonly on: {
        readonly syn: {
          readonly actions: "send handshake syn";
        };
        readonly request: {
          readonly actions: "create request";
        };
        readonly post: {
          readonly actions: "buffer message";
        };
        readonly 'message.received': {
          readonly target: "connected";
        };
        readonly disconnect: {
          readonly target: "disconnected";
        };
      };
      readonly exit: "send handshake ack";
    };
    readonly connected: {
      readonly entry: readonly ["send pending messages", {
        readonly type: "emit status";
        readonly params: {
          readonly status: "connected";
        };
      }];
      readonly invoke: {
        readonly id: "listen for messages";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
      };
      readonly on: {
        readonly post: {
          readonly actions: "post message";
        };
        readonly request: {
          readonly actions: "create request";
        };
        readonly response: {
          readonly actions: "respond";
        };
        readonly 'message.received': {
          readonly actions: "emit received message";
        };
        readonly disconnect: {
          readonly target: "disconnected";
        };
      };
      readonly initial: "heartbeat";
      readonly states: {
        readonly heartbeat: {
          readonly initial: "checking";
          readonly states: {
            readonly checking: {
              readonly always: {
                readonly guard: "should send heartbeats";
                readonly target: "sending";
              };
            };
            readonly sending: {
              readonly on: {
                readonly 'request.failed': {
                  readonly target: "#handshaking";
                };
              };
              readonly invoke: {
                readonly id: "send heartbeat";
                readonly src: "sendBackAtInterval";
                readonly input: () => {
                  event: {
                    type: string;
                    data: {
                      type: string;
                      data: undefined;
                    };
                  };
                  interval: number;
                  immediate: false;
                };
              };
            };
          };
        };
      };
    };
    readonly disconnected: {
      readonly id: "disconnected";
      readonly entry: readonly ["send disconnect", {
        readonly type: "emit status";
        readonly params: {
          readonly status: "disconnected";
        };
      }];
      readonly on: {
        readonly request: {
          readonly actions: "create request";
        };
        readonly post: {
          readonly actions: "buffer message";
        };
        readonly connect: {
          readonly target: "handshaking";
          readonly guard: "has target";
        };
      };
    };
  };
}>;
/**
 * @public
 */
declare const createConnection: <TSends extends Message, TReceives extends Message>(input: ConnectionInput, machine?: ConnectionActorLogic<TSends, TReceives>) => Connection<TSends, TReceives>;
/**
 * @public
 */
declare const createListenLogic: (compatMap?: (event: MessageEvent<ProtocolMessage>) => MessageEvent<ProtocolMessage>) => xstate1332.ObservableActorLogic<{
  type: string;
  message: MessageEvent<ProtocolMessage>;
}, ListenInput, xstate1332.EventObject>;
/**
 * @public
 */
type ChannelInput = Omit<ConnectionInput, 'target' | 'targetOrigin'>;
/**
 * @public
 */
interface ChannelInstance<TSends extends Message, TReceives extends Message> {
  on: <TType extends TReceives['type'], TMessage extends Extract<TReceives, {
    type: TType;
  }>>(type: TType, handler: (data: TMessage['data']) => Promise<TMessage['response']> | TMessage['response']) => () => void;
  onInternalEvent: <TType extends InternalEmitEvent<TSends, TReceives>['type'], TEvent extends Extract<InternalEmitEvent<TSends, TReceives>, {
    type: TType;
  }>>(type: TType, handler: (event: TEvent) => void) => () => void;
  onStatus: (handler: (event: StatusEvent) => void) => void;
  post: <TType extends TSends['type'], TMessage extends Extract<TSends, {
    type: TType;
  }>>(...params: (TMessage['data'] extends undefined ? [TType] : never) | [TType, TMessage['data']]) => void;
  start: () => () => void;
  stop: () => void;
}
/**
 * @public
 */
interface Controller {
  addTarget: (target: MessageEventSource) => () => void;
  createChannel: <TSends extends Message, TReceives extends Message>(input: ChannelInput, machine?: ConnectionActorLogic<TSends, TReceives>) => ChannelInstance<TSends, TReceives>;
  destroy: () => void;
}
/**
 * @public
 */
declare const createController: (input: {
  targetOrigin: string;
}) => Controller;
/**
 * @public
 */
interface NodeInput {
  name: string;
  connectTo: string;
  domain?: string;
}
/**
 * @public
 */
type NodeActorLogic<TSends extends Message, TReceives extends Message> = ReturnType<typeof createNodeMachine<TSends, TReceives>>;
/**
 * @public
 */
type NodeActor<TSends extends Message, TReceives extends Message> = ActorRefFrom<NodeActorLogic<TSends, TReceives>>;
/**
 * @public
 */
type Node<TSends extends Message, TReceives extends Message> = {
  actor: NodeActor<TSends, TReceives>;
  fetch: <TType extends TSends['type'], TMessage extends Extract<TSends, {
    type: TType;
  }>>(...params: (TMessage['data'] extends undefined ? [TType] : never) | [TType, TMessage['data']] | [TType, TMessage['data'], {
    signal?: AbortSignal;
    suppressWarnings?: boolean;
  }]) => TSends extends TMessage ? TSends['type'] extends TType ? Promise<TSends['response']> : never : never;
  machine: NodeActorLogic<TSends, TReceives>;
  on: <TType extends TReceives['type'], TMessage extends Extract<TReceives, {
    type: TType;
  }>>(type: TType, handler: (event: TMessage['data']) => TMessage['response']) => () => void;
  onStatus: (handler: (status: Exclude<Status, 'disconnected'>) => void, filter?: Exclude<Status, 'disconnected'>) => () => void;
  post: <TType extends TSends['type'], TMessage extends Extract<TSends, {
    type: TType;
  }>>(...params: (TMessage['data'] extends undefined ? [TType] : never) | [TType, TMessage['data']]) => void;
  start: () => () => void;
  stop: () => void;
};
/**
 * @public
 */
declare const createNodeMachine: <TSends extends Message,
// Sends
TReceives extends Message,
// Receives
TSendsWithoutResponse extends WithoutResponse<TSends> = WithoutResponse<TSends>>() => xstate1332.StateMachine<{
  buffer: Array<{
    data: TSendsWithoutResponse;
    resolvable?: PromiseWithResolvers<TSends["response"]>;
    options?: {
      signal?: AbortSignal;
      suppressWarnings?: boolean;
    };
  }>;
  channelId: string | null;
  connectTo: string;
  domain: string;
  handshakeBuffer: Array<{
    type: "message.received";
    message: MessageEvent<ProtocolMessage<TReceives>>;
  }>;
  name: string;
  requests: Array<RequestActorRef<TSends>>;
  target: MessageEventSource | undefined;
  targetOrigin: string | null;
}, {
  type: "heartbeat.received";
  message: MessageEvent<ProtocolMessage<HeartbeatMessage>>;
} | {
  type: "message.received";
  message: MessageEvent<ProtocolMessage<TReceives>>;
} | {
  type: "handshake.syn";
  message: MessageEvent<ProtocolMessage<TReceives>>;
} | {
  type: "post";
  data: TSendsWithoutResponse;
  resolvable?: PromiseWithResolvers<TSends["response"]>;
  options?: {
    responseTimeout?: number;
    signal?: AbortSignal;
    suppressWarnings?: boolean;
  };
} | {
  type: "request.aborted";
  requestId: string;
} | {
  type: "request.failed";
  requestId: string;
} | {
  type: "request.success";
  requestId: string;
  response: TSends["response"] | null;
  responseTo: string | undefined;
} | {
  type: "request";
  data: RequestData<TSends> | RequestData<TSends>[];
}, {
  [x: string]: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, xstate1332.EventObject>> | xstate1332.ActorRefFromLogic<xstate1332.StateMachine<RequestMachineContext<TSends>, {
    type: "message";
    data: ProtocolMessage<ResponseMessage>;
  } | {
    type: "abort";
  }, {
    "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
      requestId: string;
      sources: Set<MessageEventSource>;
      signal?: AbortSignal;
    }, xstate1332.EventObject>> | undefined;
  }, {
    src: "listen";
    logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
      requestId: string;
      sources: Set<MessageEventSource>;
      signal?: AbortSignal;
    }, xstate1332.EventObject>;
    id: "listen for response";
  }, xstate1332.Values<{
    "send message": {
      type: "send message";
      params: {
        message: ProtocolMessage;
      };
    };
    "on success": {
      type: "on success";
      params: xstate1332.NonReducibleUnknown;
    };
    "on fail": {
      type: "on fail";
      params: xstate1332.NonReducibleUnknown;
    };
    "on abort": {
      type: "on abort";
      params: xstate1332.NonReducibleUnknown;
    };
  }>, {
    type: "expectsResponse";
    params: unknown;
  }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
    channelId: string;
    data?: TSends["data"] | undefined;
    domain: string;
    expectResponse?: boolean;
    from: string;
    parentRef: xstate1332.AnyActorRef;
    resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
    responseTimeout?: number;
    responseTo?: string;
    signal?: AbortSignal;
    sources: Set<MessageEventSource> | MessageEventSource;
    suppressWarnings?: boolean;
    targetOrigin: string;
    to: string;
    type: TSends["type"];
  }, {
    requestId: string;
    response: TSends["response"] | null;
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
    response: MessageData | null;
    responseTo: string | undefined;
  }, xstate1332.MetaObject, {
    readonly context: ({
      input
    }: {
      spawn: {
        <TSrc extends "listen">(logic: TSrc, ...[options]: {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>;
          id: "listen for response";
        } extends infer T ? T extends {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>;
          id: "listen for response";
        } ? T extends {
          src: TSrc;
        } ? xstate1332.ConditionalRequired<[options?: ({
          id?: T["id"] | undefined;
          systemId?: string;
          input?: xstate1332.InputFrom<T["logic"]> | undefined;
          syncSnapshot?: boolean;
        } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>;
          id: "listen for response";
        }, "src", TSrc>["logic"]>;
        <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
          id?: never;
          systemId?: string;
          input?: xstate1332.InputFrom<TLogic> | undefined;
          syncSnapshot?: boolean;
        } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
      };
      input: {
        channelId: string;
        data?: TSends["data"] | undefined;
        domain: string;
        expectResponse?: boolean;
        from: string;
        parentRef: xstate1332.AnyActorRef;
        resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
        responseTimeout?: number;
        responseTo?: string;
        signal?: AbortSignal;
        sources: Set<MessageEventSource> | MessageEventSource;
        suppressWarnings?: boolean;
        targetOrigin: string;
        to: string;
        type: TSends["type"];
      };
      self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, xstate1332.AnyEventObject>;
    }) => {
      channelId: string;
      data: TSends["data"] | undefined;
      domain: string;
      expectResponse: boolean;
      from: string;
      id: string;
      parentRef: xstate1332.AnyActorRef;
      resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
      response: null;
      responseTimeout: number | undefined;
      responseTo: string | undefined;
      signal: AbortSignal | undefined;
      sources: Set<MessageEventSource>;
      suppressWarnings: boolean | undefined;
      targetOrigin: string;
      to: string;
      type: TSends["type"];
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
            context: RequestMachineContext<TSends>;
            event: {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            };
          }) => {
            message: {
              channelId: string;
              data: MessageData;
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
            context: RequestMachineContext<TSends>;
            event: {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            };
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
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
            readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            }, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, undefined, {
              src: "listen";
              logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                requestId: string;
                sources: Set<MessageEventSource>;
                signal?: AbortSignal;
              }, xstate1332.EventObject>;
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
      context: RequestMachineContext<TSends>;
      event: xstate1332.DoneStateEvent<unknown>;
      self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
        type: "message";
        data: ProtocolMessage<ResponseMessage>;
      } | {
        type: "abort";
      }, xstate1332.AnyEventObject>;
    }) => {
      requestId: string;
      response: TSends["response"] | null;
      responseTo: string | undefined;
    };
  }>> | undefined;
  "listen for messages"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, xstate1332.EventObject>> | undefined;
  "listen for disconnect"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, xstate1332.EventObject>> | undefined;
  "listen for handshake ack"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, xstate1332.EventObject>> | undefined;
  "listen for handshake syn"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, xstate1332.EventObject>> | undefined;
  "listen for heartbeat"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<{
    type: string;
    message: MessageEvent<ProtocolMessage>;
  }, ListenInput, xstate1332.EventObject>> | undefined;
}, xstate1332.Values<{
  listen: {
    src: "listen";
    logic: xstate1332.ObservableActorLogic<{
      type: string;
      message: MessageEvent<ProtocolMessage>;
    }, ListenInput, xstate1332.EventObject>;
    id: "listen for messages" | "listen for disconnect" | "listen for handshake ack" | "listen for handshake syn" | "listen for heartbeat";
  };
  requestMachine: {
    src: "requestMachine";
    logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
      type: "message";
      data: ProtocolMessage<ResponseMessage>;
    } | {
      type: "abort";
    }, {
      "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
        requestId: string;
        sources: Set<MessageEventSource>;
        signal?: AbortSignal;
      }, xstate1332.EventObject>> | undefined;
    }, {
      src: "listen";
      logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
        requestId: string;
        sources: Set<MessageEventSource>;
        signal?: AbortSignal;
      }, xstate1332.EventObject>;
      id: "listen for response";
    }, xstate1332.Values<{
      "send message": {
        type: "send message";
        params: {
          message: ProtocolMessage;
        };
      };
      "on success": {
        type: "on success";
        params: xstate1332.NonReducibleUnknown;
      };
      "on fail": {
        type: "on fail";
        params: xstate1332.NonReducibleUnknown;
      };
      "on abort": {
        type: "on abort";
        params: xstate1332.NonReducibleUnknown;
      };
    }>, {
      type: "expectsResponse";
      params: unknown;
    }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
      channelId: string;
      data?: TSends["data"] | undefined;
      domain: string;
      expectResponse?: boolean;
      from: string;
      parentRef: xstate1332.AnyActorRef;
      resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
      responseTimeout?: number;
      responseTo?: string;
      signal?: AbortSignal;
      sources: Set<MessageEventSource> | MessageEventSource;
      suppressWarnings?: boolean;
      targetOrigin: string;
      to: string;
      type: TSends["type"];
    }, {
      requestId: string;
      response: TSends["response"] | null;
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
      response: MessageData | null;
      responseTo: string | undefined;
    }, xstate1332.MetaObject, {
      readonly context: ({
        input
      }: {
        spawn: {
          <TSrc extends "listen">(logic: TSrc, ...[options]: {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, xstate1332.EventObject>;
            id: "listen for response";
          } extends infer T ? T extends {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, xstate1332.EventObject>;
            id: "listen for response";
          } ? T extends {
            src: TSrc;
          } ? xstate1332.ConditionalRequired<[options?: ({
            id?: T["id"] | undefined;
            systemId?: string;
            input?: xstate1332.InputFrom<T["logic"]> | undefined;
            syncSnapshot?: boolean;
          } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, xstate1332.EventObject>;
            id: "listen for response";
          }, "src", TSrc>["logic"]>;
          <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
            id?: never;
            systemId?: string;
            input?: xstate1332.InputFrom<TLogic> | undefined;
            syncSnapshot?: boolean;
          } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
        };
        input: {
          channelId: string;
          data?: TSends["data"] | undefined;
          domain: string;
          expectResponse?: boolean;
          from: string;
          parentRef: xstate1332.AnyActorRef;
          resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
          responseTimeout?: number;
          responseTo?: string;
          signal?: AbortSignal;
          sources: Set<MessageEventSource> | MessageEventSource;
          suppressWarnings?: boolean;
          targetOrigin: string;
          to: string;
          type: TSends["type"];
        };
        self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, xstate1332.AnyEventObject>;
      }) => {
        channelId: string;
        data: TSends["data"] | undefined;
        domain: string;
        expectResponse: boolean;
        from: string;
        id: string;
        parentRef: xstate1332.AnyActorRef;
        resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
        response: null;
        responseTimeout: number | undefined;
        responseTo: string | undefined;
        signal: AbortSignal | undefined;
        sources: Set<MessageEventSource>;
        suppressWarnings: boolean | undefined;
        targetOrigin: string;
        to: string;
        type: TSends["type"];
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
              context: RequestMachineContext<TSends>;
              event: {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              };
            }) => {
              message: {
                channelId: string;
                data: MessageData;
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
              context: RequestMachineContext<TSends>;
              event: {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              };
              self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, xstate1332.AnyEventObject>;
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
              readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              }, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, undefined, {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
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
        context: RequestMachineContext<TSends>;
        event: xstate1332.DoneStateEvent<unknown>;
        self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, xstate1332.AnyEventObject>;
      }) => {
        requestId: string;
        response: TSends["response"] | null;
        responseTo: string | undefined;
      };
    }>;
    id: string | undefined;
  };
}>, xstate1332.Values<{
  "buffer message": {
    type: "buffer message";
    params: xstate1332.NonReducibleUnknown;
  };
  "create request": {
    type: "create request";
    params: xstate1332.NonReducibleUnknown;
  };
  "emit received message": {
    type: "emit received message";
    params: xstate1332.NonReducibleUnknown;
  };
  "emit status": {
    type: "emit status";
    params: {
      status: Exclude<Status, "disconnected">;
    };
  };
  "post message": {
    type: "post message";
    params: xstate1332.NonReducibleUnknown;
  };
  "remove request": {
    type: "remove request";
    params: xstate1332.NonReducibleUnknown;
  };
  "send pending messages": {
    type: "send pending messages";
    params: xstate1332.NonReducibleUnknown;
  };
  "buffer handshake": {
    type: "buffer handshake";
    params: xstate1332.NonReducibleUnknown;
  };
  "emit heartbeat": {
    type: "emit heartbeat";
    params: xstate1332.NonReducibleUnknown;
  };
  "process pending handshakes": {
    type: "process pending handshakes";
    params: xstate1332.NonReducibleUnknown;
  };
  "send response": {
    type: "send response";
    params: xstate1332.NonReducibleUnknown;
  };
  "send handshake syn ack": {
    type: "send handshake syn ack";
    params: xstate1332.NonReducibleUnknown;
  };
  "set connection config": {
    type: "set connection config";
    params: xstate1332.NonReducibleUnknown;
  };
}>, {
  type: "hasSource";
  params: unknown;
}, never, "idle" | "handshaking" | "connected", string, NodeInput, xstate1332.NonReducibleUnknown, BufferAddedEmitEvent<TSendsWithoutResponse> | BufferFlushedEmitEvent<TSendsWithoutResponse> | HeartbeatEmitEvent | MessageEmitEvent<TReceives> | (StatusEmitEvent & {
  status: Exclude<Status, "disconnected">;
}), xstate1332.MetaObject, {
  /** @xstate-layout N4IgpgJg5mDOIC5QDsD2EwGIBOYCOArnAC4B0sBAxpXLANoAMAuoqAA6qwCWxXqyrEAA9EAVgYAWUgEYJDUQA4JAZmUSJC0coDsAGhABPRNIYLSErdOkBOAGzbx227YUBfV-rQYc+IrDIAZgCGXAA2kIwsSCAc3Lz8giIIoiakqgBMDKbp2tYS0srp+kYI0ununuhgpFwQ4ZgQ-NVcyABuqADW1V7NdWAILe2UQfHIkZGCsTx8AtFJ6aKipAzWOtrpC7Z5BUWGiNoK6aS26RLW2tLaqkqqFSA9NX2YALa0QTCkuDRcrRHMk5xpgk5ogJLZSNZIVDoVCFLZiohbIVSLkXLZRHZDgxbHcHrV6rFiBNolNRolEVJbCsdGUzsoyhiEcllOC1DowelVmVrOUPPcqqQABZBZAQWDCjotKANJo1NqdboC4Wi8VBSXIKADeXDUbjf4kwFkkEILbg8RZMHKOzWKzKJkHJa086Xa4qZS4pUisUSqU+QgkYnsQ0zcnJaRLDbpZwKNQSBYspm2MEyC5KTnaDSSd18h7K71q32EwMxYPA0BJFLKY5yZxIrKSURM0RnFHSBTrQqQ9babQejBCr2q9XSiBcWCUfjIMCUIn6oNxEPGtTWFFR0RUy7iGzt+3Ip0XURXVZKPvVCfIKczyB+vyzqLzoGzcuIG0MGTyCztjRtjaJjbHVMNAUTdu1PUhz0vYhryLOcSwXMthBfK0ZGsLQGBZekCi0Jso1IdI23WG04zOE4wIg6coIgBox3Imdi1JRdnxNOxSHNSQkWtW0mTjMxMQ7fDzgcbNKn7WjKJeN4Pi+MAfj+e84MfUMFHbZZwxOHZNDyO09gQOQjmAhZJCM9IMjIycKOvQUwCCbBiAAI2sshpNkiB6NLJ9EIQBQbWOdJlMhYCUjbJkchXGsFmsJQMVsWl3BzKp4GiHoAXgjykgAWmkZZ6xy3LZF2EobCy6xsQWJQ42kE4FjA-EwBSxTjSRUhDgqkzgO2BxdykU4AvXFQ-KjMC8yHKV6qNJi6WOdcypcZsXGxe0JG0XySKjM5lKsMyLwsiAxsYzylDfONznUEqrmi+1ThkHqXDONbULi1wgA */
  readonly id: "node";
  readonly context: ({
    input
  }: {
    spawn: {
      <TSrc extends "listen" | "requestMachine">(logic: TSrc, ...[options]: ({
        src: "listen";
        logic: xstate1332.ObservableActorLogic<{
          type: string;
          message: MessageEvent<ProtocolMessage>;
        }, ListenInput, xstate1332.EventObject>;
        id: "listen for messages" | "listen for disconnect" | "listen for handshake ack" | "listen for handshake syn" | "listen for heartbeat";
      } extends infer T ? T extends {
        src: "listen";
        logic: xstate1332.ObservableActorLogic<{
          type: string;
          message: MessageEvent<ProtocolMessage>;
        }, ListenInput, xstate1332.EventObject>;
        id: "listen for messages" | "listen for disconnect" | "listen for handshake ack" | "listen for handshake syn" | "listen for heartbeat";
      } ? T extends {
        src: TSrc;
      } ? xstate1332.ConditionalRequired<[options?: ({
        id?: T["id"] | undefined;
        systemId?: string;
        input?: xstate1332.InputFrom<T["logic"]> | undefined;
        syncSnapshot?: boolean;
      } & { [K in xstate1332.RequiredActorOptions<T>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T>>> : never : never : never) | ({
        src: "requestMachine";
        logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, {
          "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>> | undefined;
        }, {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>;
          id: "listen for response";
        }, xstate1332.Values<{
          "send message": {
            type: "send message";
            params: {
              message: ProtocolMessage;
            };
          };
          "on success": {
            type: "on success";
            params: xstate1332.NonReducibleUnknown;
          };
          "on fail": {
            type: "on fail";
            params: xstate1332.NonReducibleUnknown;
          };
          "on abort": {
            type: "on abort";
            params: xstate1332.NonReducibleUnknown;
          };
        }>, {
          type: "expectsResponse";
          params: unknown;
        }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
          channelId: string;
          data?: TSends["data"] | undefined;
          domain: string;
          expectResponse?: boolean;
          from: string;
          parentRef: xstate1332.AnyActorRef;
          resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
          responseTimeout?: number;
          responseTo?: string;
          signal?: AbortSignal;
          sources: Set<MessageEventSource> | MessageEventSource;
          suppressWarnings?: boolean;
          targetOrigin: string;
          to: string;
          type: TSends["type"];
        }, {
          requestId: string;
          response: TSends["response"] | null;
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
          response: MessageData | null;
          responseTo: string | undefined;
        }, xstate1332.MetaObject, {
          readonly context: ({
            input
          }: {
            spawn: {
              <TSrc_1 extends "listen">(logic: TSrc_1, ...[options]: {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
                id: "listen for response";
              } extends infer T_1 ? T_1 extends {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
                id: "listen for response";
              } ? T_1 extends {
                src: TSrc_1;
              } ? xstate1332.ConditionalRequired<[options?: ({
                id?: T_1["id"] | undefined;
                systemId?: string;
                input?: xstate1332.InputFrom<T_1["logic"]> | undefined;
                syncSnapshot?: boolean;
              } & { [K_1 in xstate1332.RequiredActorOptions<T_1>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_1>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
                id: "listen for response";
              }, "src", TSrc_1>["logic"]>;
              <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
                id?: never;
                systemId?: string;
                input?: xstate1332.InputFrom<TLogic> | undefined;
                syncSnapshot?: boolean;
              } & { [K_1 in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
            };
            input: {
              channelId: string;
              data?: TSends["data"] | undefined;
              domain: string;
              expectResponse?: boolean;
              from: string;
              parentRef: xstate1332.AnyActorRef;
              resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
              responseTimeout?: number;
              responseTo?: string;
              signal?: AbortSignal;
              sources: Set<MessageEventSource> | MessageEventSource;
              suppressWarnings?: boolean;
              targetOrigin: string;
              to: string;
              type: TSends["type"];
            };
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            channelId: string;
            data: TSends["data"] | undefined;
            domain: string;
            expectResponse: boolean;
            from: string;
            id: string;
            parentRef: xstate1332.AnyActorRef;
            resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
            response: null;
            responseTimeout: number | undefined;
            responseTo: string | undefined;
            signal: AbortSignal | undefined;
            sources: Set<MessageEventSource>;
            suppressWarnings: boolean | undefined;
            targetOrigin: string;
            to: string;
            type: TSends["type"];
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                }) => {
                  message: {
                    channelId: string;
                    data: MessageData;
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                  self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, xstate1332.AnyEventObject>;
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
                  readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  }, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, undefined, {
                    src: "listen";
                    logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                      requestId: string;
                      sources: Set<MessageEventSource>;
                      signal?: AbortSignal;
                    }, xstate1332.EventObject>;
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
            context: RequestMachineContext<TSends>;
            event: xstate1332.DoneStateEvent<unknown>;
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          };
        }>;
        id: string | undefined;
      } extends infer T_1 ? T_1 extends {
        src: "requestMachine";
        logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
          type: "message";
          data: ProtocolMessage<ResponseMessage>;
        } | {
          type: "abort";
        }, {
          "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>> | undefined;
        }, {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
            requestId: string;
            sources: Set<MessageEventSource>;
            signal?: AbortSignal;
          }, xstate1332.EventObject>;
          id: "listen for response";
        }, xstate1332.Values<{
          "send message": {
            type: "send message";
            params: {
              message: ProtocolMessage;
            };
          };
          "on success": {
            type: "on success";
            params: xstate1332.NonReducibleUnknown;
          };
          "on fail": {
            type: "on fail";
            params: xstate1332.NonReducibleUnknown;
          };
          "on abort": {
            type: "on abort";
            params: xstate1332.NonReducibleUnknown;
          };
        }>, {
          type: "expectsResponse";
          params: unknown;
        }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
          channelId: string;
          data?: TSends["data"] | undefined;
          domain: string;
          expectResponse?: boolean;
          from: string;
          parentRef: xstate1332.AnyActorRef;
          resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
          responseTimeout?: number;
          responseTo?: string;
          signal?: AbortSignal;
          sources: Set<MessageEventSource> | MessageEventSource;
          suppressWarnings?: boolean;
          targetOrigin: string;
          to: string;
          type: TSends["type"];
        }, {
          requestId: string;
          response: TSends["response"] | null;
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
          response: MessageData | null;
          responseTo: string | undefined;
        }, xstate1332.MetaObject, {
          readonly context: ({
            input
          }: {
            spawn: {
              <TSrc_1 extends "listen">(logic: TSrc_1, ...[options]: {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
                id: "listen for response";
              } extends infer T_2 ? T_2 extends {
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
                id: "listen for response";
              } ? T_2 extends {
                src: TSrc_1;
              } ? xstate1332.ConditionalRequired<[options?: ({
                id?: T_2["id"] | undefined;
                systemId?: string;
                input?: xstate1332.InputFrom<T_2["logic"]> | undefined;
                syncSnapshot?: boolean;
              } & { [K_2 in xstate1332.RequiredActorOptions<T_2>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_2>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
                src: "listen";
                logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                  requestId: string;
                  sources: Set<MessageEventSource>;
                  signal?: AbortSignal;
                }, xstate1332.EventObject>;
                id: "listen for response";
              }, "src", TSrc_1>["logic"]>;
              <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
                id?: never;
                systemId?: string;
                input?: xstate1332.InputFrom<TLogic> | undefined;
                syncSnapshot?: boolean;
              } & { [K_2 in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
            };
            input: {
              channelId: string;
              data?: TSends["data"] | undefined;
              domain: string;
              expectResponse?: boolean;
              from: string;
              parentRef: xstate1332.AnyActorRef;
              resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
              responseTimeout?: number;
              responseTo?: string;
              signal?: AbortSignal;
              sources: Set<MessageEventSource> | MessageEventSource;
              suppressWarnings?: boolean;
              targetOrigin: string;
              to: string;
              type: TSends["type"];
            };
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            channelId: string;
            data: TSends["data"] | undefined;
            domain: string;
            expectResponse: boolean;
            from: string;
            id: string;
            parentRef: xstate1332.AnyActorRef;
            resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
            response: null;
            responseTimeout: number | undefined;
            responseTo: string | undefined;
            signal: AbortSignal | undefined;
            sources: Set<MessageEventSource>;
            suppressWarnings: boolean | undefined;
            targetOrigin: string;
            to: string;
            type: TSends["type"];
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                }) => {
                  message: {
                    channelId: string;
                    data: MessageData;
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
                  context: RequestMachineContext<TSends>;
                  event: {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  };
                  self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, xstate1332.AnyEventObject>;
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
                  readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  }, {
                    type: "message";
                    data: ProtocolMessage<ResponseMessage>;
                  } | {
                    type: "abort";
                  }, undefined, {
                    src: "listen";
                    logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                      requestId: string;
                      sources: Set<MessageEventSource>;
                      signal?: AbortSignal;
                    }, xstate1332.EventObject>;
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
            context: RequestMachineContext<TSends>;
            event: xstate1332.DoneStateEvent<unknown>;
            self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
              type: "message";
              data: ProtocolMessage<ResponseMessage>;
            } | {
              type: "abort";
            }, xstate1332.AnyEventObject>;
          }) => {
            requestId: string;
            response: TSends["response"] | null;
            responseTo: string | undefined;
          };
        }>;
        id: string | undefined;
      } ? T_1 extends {
        src: TSrc;
      } ? xstate1332.ConditionalRequired<[options?: ({
        id?: T_1["id"] | undefined;
        systemId?: string;
        input?: xstate1332.InputFrom<T_1["logic"]> | undefined;
        syncSnapshot?: boolean;
      } & { [K_1 in xstate1332.RequiredActorOptions<T_1>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_1>>> : never : never : never)): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<xstate1332.Values<{
        listen: {
          src: "listen";
          logic: xstate1332.ObservableActorLogic<{
            type: string;
            message: MessageEvent<ProtocolMessage>;
          }, ListenInput, xstate1332.EventObject>;
          id: "listen for messages" | "listen for disconnect" | "listen for handshake ack" | "listen for handshake syn" | "listen for heartbeat";
        };
        requestMachine: {
          src: "requestMachine";
          logic: xstate1332.StateMachine<RequestMachineContext<TSends>, {
            type: "message";
            data: ProtocolMessage<ResponseMessage>;
          } | {
            type: "abort";
          }, {
            "listen for response"?: xstate1332.ActorRefFromLogic<xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, xstate1332.EventObject>> | undefined;
          }, {
            src: "listen";
            logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
              requestId: string;
              sources: Set<MessageEventSource>;
              signal?: AbortSignal;
            }, xstate1332.EventObject>;
            id: "listen for response";
          }, xstate1332.Values<{
            "send message": {
              type: "send message";
              params: {
                message: ProtocolMessage;
              };
            };
            "on success": {
              type: "on success";
              params: xstate1332.NonReducibleUnknown;
            };
            "on fail": {
              type: "on fail";
              params: xstate1332.NonReducibleUnknown;
            };
            "on abort": {
              type: "on abort";
              params: xstate1332.NonReducibleUnknown;
            };
          }>, {
            type: "expectsResponse";
            params: unknown;
          }, "initialTimeout" | "responseTimeout", "idle" | "sending" | "awaiting" | "success" | "aborted" | "failed", string, {
            channelId: string;
            data?: TSends["data"] | undefined;
            domain: string;
            expectResponse?: boolean;
            from: string;
            parentRef: xstate1332.AnyActorRef;
            resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
            responseTimeout?: number;
            responseTo?: string;
            signal?: AbortSignal;
            sources: Set<MessageEventSource> | MessageEventSource;
            suppressWarnings?: boolean;
            targetOrigin: string;
            to: string;
            type: TSends["type"];
          }, {
            requestId: string;
            response: TSends["response"] | null;
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
            response: MessageData | null;
            responseTo: string | undefined;
          }, xstate1332.MetaObject, {
            readonly context: ({
              input
            }: {
              spawn: {
                <TSrc_1 extends "listen">(logic: TSrc_1, ...[options]: {
                  src: "listen";
                  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                    requestId: string;
                    sources: Set<MessageEventSource>;
                    signal?: AbortSignal;
                  }, xstate1332.EventObject>;
                  id: "listen for response";
                } extends infer T_2 ? T_2 extends {
                  src: "listen";
                  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                    requestId: string;
                    sources: Set<MessageEventSource>;
                    signal?: AbortSignal;
                  }, xstate1332.EventObject>;
                  id: "listen for response";
                } ? T_2 extends {
                  src: TSrc_1;
                } ? xstate1332.ConditionalRequired<[options?: ({
                  id?: T_2["id"] | undefined;
                  systemId?: string;
                  input?: xstate1332.InputFrom<T_2["logic"]> | undefined;
                  syncSnapshot?: boolean;
                } & { [K_2 in xstate1332.RequiredActorOptions<T_2>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredActorOptions<T_2>>> : never : never : never): xstate1332.ActorRefFromLogic<xstate1332.GetConcreteByKey<{
                  src: "listen";
                  logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                    requestId: string;
                    sources: Set<MessageEventSource>;
                    signal?: AbortSignal;
                  }, xstate1332.EventObject>;
                  id: "listen for response";
                }, "src", TSrc_1>["logic"]>;
                <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
                  id?: never;
                  systemId?: string;
                  input?: xstate1332.InputFrom<TLogic> | undefined;
                  syncSnapshot?: boolean;
                } & { [K_2 in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
              };
              input: {
                channelId: string;
                data?: TSends["data"] | undefined;
                domain: string;
                expectResponse?: boolean;
                from: string;
                parentRef: xstate1332.AnyActorRef;
                resolvable?: PromiseWithResolvers<TSends["response"]> | undefined;
                responseTimeout?: number;
                responseTo?: string;
                signal?: AbortSignal;
                sources: Set<MessageEventSource> | MessageEventSource;
                suppressWarnings?: boolean;
                targetOrigin: string;
                to: string;
                type: TSends["type"];
              };
              self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, xstate1332.AnyEventObject>;
            }) => {
              channelId: string;
              data: TSends["data"] | undefined;
              domain: string;
              expectResponse: boolean;
              from: string;
              id: string;
              parentRef: xstate1332.AnyActorRef;
              resolvable: PromiseWithResolvers<TSends["response"]> | undefined;
              response: null;
              responseTimeout: number | undefined;
              responseTo: string | undefined;
              signal: AbortSignal | undefined;
              sources: Set<MessageEventSource>;
              suppressWarnings: boolean | undefined;
              targetOrigin: string;
              to: string;
              type: TSends["type"];
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
                    context: RequestMachineContext<TSends>;
                    event: {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    };
                  }) => {
                    message: {
                      channelId: string;
                      data: MessageData;
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
                    context: RequestMachineContext<TSends>;
                    event: {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    };
                    self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    }, xstate1332.AnyEventObject>;
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
                    readonly actions: xstate1332.ActionFunction<RequestMachineContext<TSends>, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    }, {
                      type: "message";
                      data: ProtocolMessage<ResponseMessage>;
                    } | {
                      type: "abort";
                    }, undefined, {
                      src: "listen";
                      logic: xstate1332.ObservableActorLogic<MessageEvent<ProtocolMessage<ResponseMessage>>, {
                        requestId: string;
                        sources: Set<MessageEventSource>;
                        signal?: AbortSignal;
                      }, xstate1332.EventObject>;
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
              context: RequestMachineContext<TSends>;
              event: xstate1332.DoneStateEvent<unknown>;
              self: xstate1332.ActorRef<xstate1332.MachineSnapshot<RequestMachineContext<TSends>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, Record<string, xstate1332.AnyActorRef>, xstate1332.StateValue, string, unknown, any, any>, {
                type: "message";
                data: ProtocolMessage<ResponseMessage>;
              } | {
                type: "abort";
              }, xstate1332.AnyEventObject>;
            }) => {
              requestId: string;
              response: TSends["response"] | null;
              responseTo: string | undefined;
            };
          }>;
          id: string | undefined;
        };
      }>, "src", TSrc>["logic"]>;
      <TLogic extends xstate1332.AnyActorLogic>(src: TLogic, ...[options]: xstate1332.ConditionalRequired<[options?: ({
        id?: never;
        systemId?: string;
        input?: xstate1332.InputFrom<TLogic> | undefined;
        syncSnapshot?: boolean;
      } & { [K in xstate1332.RequiredLogicInput<TLogic>]: unknown }) | undefined], xstate1332.IsNotNever<xstate1332.RequiredLogicInput<TLogic>>>): xstate1332.ActorRefFromLogic<TLogic>;
    };
    input: NodeInput;
    self: xstate1332.ActorRef<xstate1332.MachineSnapshot<{
      buffer: Array<{
        data: TSendsWithoutResponse;
        resolvable?: PromiseWithResolvers<TSends["response"]>;
        options?: {
          signal?: AbortSignal;
          suppressWarnings?: boolean;
        };
      }>;
      channelId: string | null;
      connectTo: string;
      domain: string;
      handshakeBuffer: Array<{
        type: "message.received";
        message: MessageEvent<ProtocolMessage<TReceives>>;
      }>;
      name: string;
      requests: Array<RequestActorRef<TSends>>;
      target: MessageEventSource | undefined;
      targetOrigin: string | null;
    }, {
      type: "heartbeat.received";
      message: MessageEvent<ProtocolMessage<HeartbeatMessage>>;
    } | {
      type: "message.received";
      message: MessageEvent<ProtocolMessage<TReceives>>;
    } | {
      type: "handshake.syn";
      message: MessageEvent<ProtocolMessage<TReceives>>;
    } | {
      type: "post";
      data: TSendsWithoutResponse;
      resolvable?: PromiseWithResolvers<TSends["response"]>;
      options?: {
        responseTimeout?: number;
        signal?: AbortSignal;
        suppressWarnings?: boolean;
      };
    } | {
      type: "request.aborted";
      requestId: string;
    } | {
      type: "request.failed";
      requestId: string;
    } | {
      type: "request.success";
      requestId: string;
      response: TSends["response"] | null;
      responseTo: string | undefined;
    } | {
      type: "request";
      data: RequestData<TSends> | RequestData<TSends>[];
    }, Record<string, xstate1332.AnyActorRef | undefined>, xstate1332.StateValue, string, unknown, any, any>, {
      type: "heartbeat.received";
      message: MessageEvent<ProtocolMessage<HeartbeatMessage>>;
    } | {
      type: "message.received";
      message: MessageEvent<ProtocolMessage<TReceives>>;
    } | {
      type: "handshake.syn";
      message: MessageEvent<ProtocolMessage<TReceives>>;
    } | {
      type: "post";
      data: TSendsWithoutResponse;
      resolvable?: PromiseWithResolvers<TSends["response"]>;
      options?: {
        responseTimeout?: number;
        signal?: AbortSignal;
        suppressWarnings?: boolean;
      };
    } | {
      type: "request.aborted";
      requestId: string;
    } | {
      type: "request.failed";
      requestId: string;
    } | {
      type: "request.success";
      requestId: string;
      response: TSends["response"] | null;
      responseTo: string | undefined;
    } | {
      type: "request";
      data: RequestData<TSends> | RequestData<TSends>[];
    }, xstate1332.AnyEventObject>;
  }) => {
    buffer: never[];
    channelId: null;
    connectTo: string;
    domain: string;
    handshakeBuffer: never[];
    name: string;
    requests: never[];
    target: undefined;
    targetOrigin: null;
  };
  readonly invoke: {
    readonly id: "listen for handshake syn";
    readonly src: "listen";
    readonly input: <TContext extends {
      domain: string;
      connectTo: string;
      name: string;
      target: MessageEventSource | undefined;
    }>({
      context
    }: {
      context: TContext;
    }) => ListenInput;
  };
  readonly on: {
    readonly 'request.success': {
      readonly actions: "remove request";
    };
    readonly 'request.failed': {
      readonly actions: "remove request";
    };
    readonly 'request.aborted': {
      readonly actions: "remove request";
    };
    readonly 'handshake.syn': {
      readonly actions: "set connection config";
      readonly target: ".handshaking";
    };
  };
  readonly initial: "idle";
  readonly states: {
    readonly idle: {
      readonly entry: readonly [{
        readonly type: "emit status";
        readonly params: {
          readonly status: "idle";
        };
      }];
      readonly on: {
        readonly post: {
          readonly actions: "buffer message";
        };
      };
    };
    readonly handshaking: {
      readonly guard: "hasSource";
      readonly entry: readonly ["send handshake syn ack", {
        readonly type: "emit status";
        readonly params: {
          readonly status: "handshaking";
        };
      }];
      readonly invoke: readonly [{
        readonly id: "listen for handshake ack";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
        readonly onDone: "connected";
      }, {
        readonly id: "listen for disconnect";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
      }, {
        readonly id: "listen for messages";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
      }];
      readonly on: {
        readonly request: {
          readonly actions: "create request";
        };
        readonly post: {
          readonly actions: "buffer message";
        };
        readonly 'message.received': {
          readonly actions: "buffer handshake";
        };
        readonly disconnect: {
          readonly target: "idle";
        };
      };
    };
    readonly connected: {
      readonly entry: readonly ["process pending handshakes", "send pending messages", {
        readonly type: "emit status";
        readonly params: {
          readonly status: "connected";
        };
      }];
      readonly invoke: readonly [{
        readonly id: "listen for messages";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
      }, {
        readonly id: "listen for heartbeat";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
      }, {
        readonly id: "listen for disconnect";
        readonly src: "listen";
        readonly input: <TContext extends {
          domain: string;
          connectTo: string;
          name: string;
          target: MessageEventSource | undefined;
        }>({
          context
        }: {
          context: TContext;
        }) => ListenInput;
      }];
      readonly on: {
        readonly request: {
          readonly actions: "create request";
        };
        readonly post: {
          readonly actions: "post message";
        };
        readonly disconnect: {
          readonly target: "idle";
        };
        readonly 'message.received': {
          readonly actions: readonly ["send response", "emit received message"];
        };
        readonly 'heartbeat.received': {
          readonly actions: readonly ["send response", "emit heartbeat"];
        };
      };
    };
  };
}>;
/**
 * @public
 */
declare const createNode: <TSends extends Message, TReceives extends Message>(input: NodeInput, machine?: NodeActorLogic<TSends, TReceives>) => Node<TSends, TReceives>;
export { type BufferAddedEmitEvent, type BufferFlushedEmitEvent, type ChannelInput, type ChannelInstance, type Connection, type ConnectionActor, type ConnectionActorLogic, type ConnectionInput, type Controller, DOMAIN, type DisconnectMessage, FETCH_TIMEOUT_DEFAULT, HANDSHAKE_INTERVAL, HANDSHAKE_MSG_TYPES, HEARTBEAT_INTERVAL, type HandshakeMessageType, type HeartbeatEmitEvent, type HeartbeatMessage, INTERNAL_MSG_TYPES, type InternalEmitEvent, type InternalMessageType, type ListenInput, MSG_DISCONNECT, MSG_HANDSHAKE_ACK, MSG_HANDSHAKE_SYN, MSG_HANDSHAKE_SYN_ACK, MSG_HEARTBEAT, MSG_RESPONSE, type Message, type MessageData, type MessageEmitEvent, type MessageType, type Node, type NodeActor, type NodeActorLogic, type NodeInput, type ProtocolMessage, RESPONSE_TIMEOUT_DEFAULT, type RequestActorRef, type RequestData, type RequestMachineContext, type ResponseMessage, type Status, type StatusEmitEvent, type StatusEvent, type WithoutResponse, createConnection, createConnectionMachine, createController, createListenLogic, createNode, createNodeMachine, createRequestMachine };
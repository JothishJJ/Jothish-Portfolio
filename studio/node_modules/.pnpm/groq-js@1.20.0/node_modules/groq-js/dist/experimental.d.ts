declare interface AccessAttributeNode<T = ExprNode> extends BaseNode {
  type: 'AccessAttribute'
  base?: T
  name: string
}

declare interface AccessElementNode extends BaseNode {
  type: 'AccessElement'
  base: ExprNode
  index: number
}

declare interface AndNode extends BaseNode {
  type: 'And'
  left: ExprNode
  right: ExprNode
}

declare type AnyStaticValue =
  | StringValue
  | NumberValue
  | NullValue
  | BooleanValue
  | DateTimeValue
  | ObjectValue
  | ArrayValue
  | PathValue

declare interface ArrayCoerceNode<Base = ExprNode> extends BaseNode {
  type: 'ArrayCoerce'
  base: Base
}

declare interface ArrayElementNode extends BaseNode {
  type: 'ArrayElement'
  value: ExprNode
  isSplat: boolean
}

declare interface ArrayNode extends BaseNode {
  type: 'Array'
  elements: ArrayElementNode[]
}

declare type ArrayValue = StaticValue<unknown[], 'array'>

declare interface AscNode extends BaseNode {
  type: 'Asc'
  base: ExprNode
}

/** The base interface for SyntaxNode. */
declare interface BaseNode {
  type: string
}

declare type BooleanValue = StaticValue<boolean, 'boolean'>

declare interface Context {
  timestamp: Date
  identity: string
  before: Value | null
  after: Value | null
  sanity?: {
    projectId: string
    dataset: string
  }
  dereference?: DereferenceFunction
}

declare interface ContextNode extends BaseNode {
  type: 'Context'
  key: string
}

declare class DateTime {
  date: Date
  constructor(date: Date)
  static parseToValue(str: string): DateTimeValue | NullValue
  equals(other: DateTime): boolean
  add(secs: number): DateTime
  difference(other: DateTime): number
  compareTo(other: DateTime): number
  toString(): string
  toJSON(): string
}

declare type DateTimeValue = StaticValue<DateTime, 'datetime'>

declare type DereferenceFunction = (obj: {
  _ref: string
}) => PromiseLike<Document_2 | null | undefined> | Document_2 | null | undefined

declare interface DerefNode extends BaseNode {
  type: 'Deref'
  base: ExprNode
}

declare interface DescNode extends BaseNode {
  type: 'Desc'
  base: ExprNode
}

declare type Document_2 = {
  _id?: string
  _type?: string
  [T: string]: unknown
}

declare interface EverythingNode extends BaseNode {
  type: 'Everything'
}

declare type Executor<N = ExprNode, Sync = N> = {
  executeSync(node: Sync, scope: Scope): AnyStaticValue
  executeAsync(node: N, scope: Scope): Promise<Value>
}

/**
 * A node which can be evaluated into a value.
 * @public
 */
declare type ExprNode =
  | AccessAttributeNode
  | AccessElementNode
  | AndNode
  | ArrayNode
  | ArrayCoerceNode
  | AscNode
  | ContextNode
  | DerefNode
  | DescNode
  | EverythingNode
  | FilterNode
  | FlatMapNode
  | FuncCallNode
  | GroupNode
  | InRangeNode
  | MapNode
  | NegNode
  | NotNode
  | ObjectNode
  | OpCallNode
  | OrNode
  | ParameterNode
  | ParentNode_2
  | PipeFuncCallNode
  | PosNode
  | ProjectionNode
  | SelectNode
  | SelectorNode
  | SliceNode
  | ThisNode
  | TupleNode
  | ValueNode

declare interface FilterNode<Base = ExprNode> extends BaseNode {
  type: 'Filter'
  base: Base
  expr: ExprNode
}

declare interface FlatMapNode extends BaseNode {
  type: 'FlatMap'
  base: ExprNode
  expr: ExprNode
}

declare interface FuncCallNode extends BaseNode {
  type: 'FuncCall'
  func: GroqFunction
  namespace: string
  name: string
  args: ExprNode[]
}

/** @public */
declare type GroqFunction = Executor<GroqFunctionArg[]>

/** @public */
declare type GroqFunctionArg = ExprNode

declare type GroqPipeFunction = Executor<
  {
    base: ArrayValue | StreamValue
    args: ExprNode[]
  },
  {
    base: ArrayValue
    args: ExprNode[]
  }
>

/**
 * A type of a value in GROQ.
 */
declare type GroqType =
  | 'null'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  | 'path'
  | 'datetime'

declare interface GroupNode<Base = ExprNode> extends BaseNode {
  type: 'Group'
  base: Base
}

declare interface InRangeNode extends BaseNode {
  type: 'InRange'
  base: ExprNode
  left: ExprNode
  right: ExprNode
  isInclusive: boolean
}

declare interface MapNode extends BaseNode {
  type: 'Map'
  base: ExprNode
  expr: ExprNode
}

declare interface NegNode extends BaseNode {
  type: 'Neg'
  base: ExprNode
}

declare interface NotNode extends BaseNode {
  type: 'Not'
  base: ExprNode
}

declare type NullValue = StaticValue<null, 'null'>

declare type NumberValue = StaticValue<number, 'number'>

declare type ObjectAttributeNode =
  | ObjectAttributeValueNode
  | ObjectConditionalSplatNode
  | ObjectSplatNode

declare interface ObjectAttributeValueNode extends BaseNode {
  type: 'ObjectAttributeValue'
  name: string
  value: ExprNode
}

declare interface ObjectConditionalSplatNode extends BaseNode {
  type: 'ObjectConditionalSplat'
  condition: ExprNode
  value: ExprNode
}

declare interface ObjectNode extends BaseNode {
  type: 'Object'
  attributes: ObjectAttributeNode[]
}

declare interface ObjectSplatNode extends BaseNode {
  type: 'ObjectSplat'
  value: ExprNode
}

declare type ObjectValue = StaticValue<Record<string, unknown>, 'object'>

declare type OpCall =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | 'in'
  | 'match'

declare interface OpCallNode extends BaseNode {
  type: 'OpCall'
  op: OpCall
  left: ExprNode
  right: ExprNode
}

declare interface OrNode extends BaseNode {
  type: 'Or'
  left: ExprNode
  right: ExprNode
}

declare interface ParameterNode extends BaseNode {
  type: 'Parameter'
  name: string
}

declare interface ParentNode_2 extends BaseNode {
  type: 'Parent'
  n: number
}

declare class Path {
  private pattern
  private patternRe
  constructor(pattern: string)
  matches(str: string): boolean
  toJSON(): string
}

declare type PathValue = StaticValue<Path, 'path'>

declare interface PipeFuncCallNode extends BaseNode {
  type: 'PipeFuncCall'
  func: GroqPipeFunction
  base: ExprNode
  name: string
  args: ExprNode[]
}

declare interface PosNode extends BaseNode {
  type: 'Pos'
  base: ExprNode
}

declare interface ProjectionNode extends BaseNode {
  type: 'Projection'
  base: ExprNode
  expr: ExprNode
}

declare class Scope {
  params: Record<string, unknown>
  source: Value
  value: Value
  parent: Scope | null
  context: Context
  isHidden: boolean
  constructor(
    params: Record<string, unknown>,
    source: Value,
    value: Value,
    context: Context,
    parent: Scope | null,
  )
  createNested(value: Value): Scope
  createHidden(value: Value): Scope
}

declare interface SelectAlternativeNode extends BaseNode {
  type: 'SelectAlternative'
  condition: ExprNode
  value: ExprNode
}

declare interface SelectNode extends BaseNode {
  type: 'Select'
  alternatives: SelectAlternativeNode[]
  fallback?: ExprNode
}

declare interface SelectorFuncCallNode extends BaseNode {
  type: 'SelectorFuncCall'
  name: 'anywhere'
  arg: ExprNode
}

declare type SelectorNested =
  | AccessAttributeNode<SelectorNode>
  | ArrayCoerceNode<SelectorNode>
  | FilterNode<SelectorNode>
  | GroupNode<SelectorNode>
  | TupleNode<SelectorNode>

declare interface SelectorNestedNode extends BaseNode {
  type: 'SelectorNested'
  base: SelectorNode
  nested: SelectorNested
}

declare type SelectorNode =
  | AccessAttributeNode<SelectorNode>
  | SelectorFuncCallNode
  | GroupNode<SelectorNode>
  | TupleNode<SelectorNode>
  | ArrayCoerceNode<SelectorNode>
  | FilterNode<SelectorNode>
  | SelectorNestedNode

declare interface SliceNode extends BaseNode {
  type: 'Slice'
  base: ExprNode
  left: number
  right: number
  isInclusive: boolean
}

declare class StaticValue<P, T extends GroqType> {
  data: P
  type: T
  constructor(data: P, type: T)
  isArray(): boolean
  get(): Promise<any>
  asStatic(): this
  [Symbol.asyncIterator](): Generator<Value, void, unknown>
}

declare class StreamValue {
  type: 'stream'
  private generator
  private ticker
  private isDone
  private data
  constructor(generator: () => AsyncGenerator<Value, void, unknown>)
  isArray(): boolean
  get(): Promise<any[]>
  asStatic(): Promise<ArrayValue>
  [Symbol.asyncIterator](): AsyncGenerator<Value, void, unknown>
  _nextTick(): Promise<void>
}

declare type StringValue = StaticValue<string, 'string'>

declare interface ThisNode extends BaseNode {
  type: 'This'
}

declare interface TupleNode<Base = ExprNode> extends BaseNode {
  type: 'Tuple'
  members: Array<Base>
}

/**
 * Converts a GROQ AST node back into a GROQ query string.
 *
 * **Limitation**: This function cannot preserve parameter references. When a query
 * is parsed with parameters (e.g., `parse(query, {params: {name: "value"}})`),
 * the parameters are resolved to their values in the AST. Unparsing such a tree
 * will produce literals instead of parameter references (e.g., `"value"` instead
 * of `$name`). This means `parse(unparse(tree))` will produce a different AST
 * when the original tree contained resolved parameters.
 */
export declare function unparse(node: ExprNode): string

/**
 * The result of an expression.
 */
declare type Value = AnyStaticValue | StreamValue

declare interface ValueNode<P = any> {
  type: 'Value'
  value: P
}

export {}

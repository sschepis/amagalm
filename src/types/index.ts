export type Constructor<T = any> = new (...args: any[]) => T;
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;
export type FunctionType = (...args: any[]) => any;
export type GenericType<T> = T;

export interface NamedFunction {
  name: string;
  f: FunctionType;
}

export type ComposableElement = 
  | Constructor 
  | AbstractConstructor
  | FunctionType 
  | NamedFunction 
  | string
  | symbol;

export type Decorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export interface TypeDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'function' | 'any';
  isArray?: boolean;
  validate?: (value: any) => boolean;
}

export interface DependencyDefinition {
  token: string | symbol;
  useClass?: Constructor;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  deps?: Array<string | symbol>;
}

export type ConflictResolutionStrategy = 'error' | 'override' | 'rename';

export interface CompositionOptions<T> {
  implements?: Array<Constructor | AbstractConstructor>;
  decorators?: Record<string, Decorator>;
  typeChecking?: Record<string, TypeDefinition>;
  dependencies?: DependencyDefinition[];
  conflictResolution?: ConflictResolutionStrategy;
  generics?: Record<string, any>;
  mixins?: Array<Constructor | AbstractConstructor>;
  metadata?: Record<string, any>;
}

export interface PluginHooks {
  beforeCompose?: (elements: ComposableElement[]) => ComposableElement[];
  afterCompose?: <T>(composedClass: Constructor<T>) => Constructor<T>;
  beforeMethodCall?: (methodName: string, args: any[]) => any[];
  afterMethodCall?: (methodName: string, result: any) => any;
  onError?: (error: Error) => void;
}

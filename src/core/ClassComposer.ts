import {
  Constructor,
  ComposableElement,
  CompositionOptions,
  DependencyDefinition,
  GenericType,
  FunctionType
} from '../types';
import { DependencyContainer } from './DependencyContainer';
import { PluginManager } from './PluginManager';
import { PropertyManager } from './PropertyManager';
import { MethodManager } from './MethodManager';

export class ClassComposer {
  private static dependencyContainer = new DependencyContainer();

  static create<T extends object>(
    className: string, 
    elements: ComposableElement[], 
    options: CompositionOptions<T> = {}
  ): Constructor<T> {
    console.log('Creating class:', className);
    console.log('Elements:', elements);
    elements = PluginManager.applyPlugins('beforeCompose', elements);

    const prototype: Record<string, any> = {};
    const properties: PropertyDescriptorMap = {};
    const implementedInterfaces = options.implements || [];
    const mixins = options.mixins || [];

    // Apply mixins
    mixins.forEach(mixin => {
      Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
        if (name !== 'constructor') {
          MethodManager.addMethod(prototype, name, mixin.prototype[name], options);
        }
      });
    });

    elements.forEach((element, index) => {
      console.log('Processing element:', element);
      if (typeof element === 'function') {
        if (element.prototype && Object.getOwnPropertyNames(element.prototype).length > 1) {
          // Class
          console.log('Element is a class');
          Object.getOwnPropertyNames(element.prototype).forEach(key => {
            if (key !== 'constructor') {
              MethodManager.addMethod(prototype, key, element.prototype[key], options);
            }
          });
        } else {
          // Standalone function
          console.log('Element is a standalone function');
          const name = element.name || `function${index + 1}`;
          MethodManager.addMethod(prototype, name, element as FunctionType, options);
        }
      } else if (typeof element === 'object' && 'name' in element && 'f' in element) {
        // Named function
        console.log('Element is a named function');
        MethodManager.addMethod(prototype, element.name, element.f, options);
      } else if (typeof element === 'string') {
        if (element.startsWith('function')) {
          // Function from string
          console.log('Element is a function from string');
          const func = new Function(`return ${element}`)() as FunctionType;
          MethodManager.addMethod(prototype, func.name, func, options);
        } else {
          // Property
          console.log('Element is a property');
          PropertyManager.defineProperty(properties, element, options);
        }
      } else if (typeof element === 'symbol') {
        // Symbol (e.g., Symbol.asyncIterator)
        console.log('Element is a symbol');
        prototype[element as any] = function() {
          return this;
        };
      }
    });

    console.log('Prototype after adding methods:', prototype);

    const composedClass = class {
      constructor() {
        Object.defineProperties(this, properties);
        // Inject dependencies
        if (options.dependencies) {
          options.dependencies.forEach(dep => {
            (this as any)[dep.token] = ClassComposer.dependencyContainer.get(dep.token);
          });
        }
      }
    } as Constructor<T>;

    Object.assign(composedClass.prototype, prototype);
    Object.defineProperty(composedClass, 'name', { value: className });

    // Implement interfaces
    implementedInterfaces.forEach(iface => {
      Object.getOwnPropertyNames(iface.prototype).forEach(key => {
        if (!(key in composedClass.prototype)) {
          throw new Error(`Class ${className} does not implement ${key} from interface`);
        }
      });
    });

    // Add metadata
    if (options.metadata) {
      Object.defineProperty(composedClass, 'metadata', {
        value: options.metadata,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }

    console.log('Composed class prototype:', composedClass.prototype);

    return PluginManager.applyPlugins('afterCompose', composedClass);
  }

  static compose<T extends object>(...classes: Constructor[]): Constructor<T> {
    const composedElements: ComposableElement[] = classes.flatMap(cls => 
      Object.getOwnPropertyNames(cls.prototype)
        .filter(name => name !== 'constructor')
        .map(name => ({
          name,
          f: cls.prototype[name]
        }))
    );

    return ClassComposer.create<T>(
      'ComposedClass',
      composedElements,
      { implements: classes, conflictResolution: 'override' }
    );
  }

  static mixin<T extends object>(...mixins: Constructor[]): Constructor<T> {
    return ClassComposer.create<T>(
      'MixedClass',
      mixins,
      { mixins, conflictResolution: 'override' }
    );
  }

  static registerDependency(def: DependencyDefinition): void {
    ClassComposer.dependencyContainer.register(def);
  }

  static createGeneric<T>(): GenericType<T> {
    return Symbol('GenericType') as any;
  }

  static addPlugin = PluginManager.addPlugin;
}

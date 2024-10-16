# Amalgam.js

Amalgam.js is a powerful and flexible TypeScript framework for advanced class composition and dynamic object creation. It provides a robust set of tools for combining classes, interfaces, and functions into new, composite structures with enhanced capabilities.

[![npm version](https://badge.fury.io/js/amalgam-js.svg)](https://badge.fury.io/js/amalgam-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Plugins](#plugins)
- [Dependency Injection](#dependency-injection)
- [Generic Types](#generic-types)
- [Mixins](#mixins)
- [Error Handling](#error-handling)
- [Metadata](#metadata)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🧬 Advanced class composition
- 🧩 Interface and abstract class implementation
- 🎛 Flexible method conflict resolution
- 💉 Sophisticated dependency injection system
- 🔌 Extensible plugin architecture
- 🏷 Runtime type checking
- 🧪 Generic type support
- 🍹 Mixin capabilities
- 🚦 Comprehensive error handling
- 📊 Metadata attachment
- 🔧 Highly customizable and extensible

## Installation

```bash
npm install amalgam-js
```

or

```bash
yarn add amalgam-js
```

## Quick Start

Here's a simple example to get you started:

```typescript
import { ClassComposer } from 'amalgam-js';

class A {
  methodA() { console.log('Method A'); }
}

class B {
  methodB() { console.log('Method B'); }
}

const ComposedClass = ClassComposer.compose<A & B>(A, B);
const instance = new ComposedClass();

instance.methodA(); // Output: Method A
instance.methodB(); // Output: Method B
```

## API Reference

### ClassComposer

The main class providing composition functionality.

#### Static Methods

- `create<T>(className: string, elements: ComposableElement[], options?: CompositionOptions<T>): Constructor<T>`
- `compose<T>(...classes: Constructor[]): Constructor<T>`
- `mixin<T>(...mixins: Constructor[]): Constructor<T>`
- `addPlugin(plugin: Partial<PluginHooks>): void`
- `registerDependency(def: DependencyDefinition): void`
- `createGeneric<T>(): GenericType<T>`

### CompositionOptions

Options for customizing the composition process.

```typescript
interface CompositionOptions<T> {
  implements?: Array<Constructor | AbstractConstructor>;
  decorators?: Record<string, Decorator>;
  typeChecking?: Record<string, TypeDefinition>;
  dependencies?: DependencyDefinition[];
  conflictResolution?: ConflictResolutionStrategy;
  generics?: Record<string, any>;
  mixins?: Array<Constructor | AbstractConstructor>;
  metadata?: Record<string, any>;
}
```

## Advanced Usage

### Implementing Interfaces and Abstract Classes

```typescript
interface Loggable {
  log(message: string): void;
}

abstract class Base {
  abstract baseMethod(): void;
}

const CustomClass = ClassComposer.create<Loggable & Base>('CustomClass', [
  function log(message: string) { console.log(message); },
  function baseMethod() { console.log('Base method'); }
], {
  implements: [Loggable, Base]
});
```

### Using Decorators

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}`);
    return original.apply(this, args);
  };
  return descriptor;
}

const DecoratedClass = ClassComposer.create('DecoratedClass', [
  function method() { console.log('Method called'); }
], {
  decorators: { method: log }
});
```

## Plugins

Plugins allow you to extend the functionality of Amalgam.js.

```typescript
const loggingPlugin: Partial<PluginHooks> = {
  beforeMethodCall: (methodName, args) => {
    console.log(`Calling method: ${methodName}`);
    return args;
  },
  afterMethodCall: (methodName, result) => {
    console.log(`Method ${methodName} called`);
    return result;
  }
};

ClassComposer.addPlugin(loggingPlugin);
```

## Dependency Injection

Amalgam.js provides a powerful dependency injection system.

```typescript
ClassComposer.registerDependency({
  token: 'logger',
  useValue: console
});

const InjectedClass = ClassComposer.create('InjectedClass', [
  function log(message: string) { this.logger.log(message); }
], {
  dependencies: [{ token: 'logger' }]
});
```

## Generic Types

You can work with generic types in your composed classes.

```typescript
const GenericNumber = ClassComposer.createGeneric<number>();

const GenericClass = ClassComposer.create('GenericClass', [
  function genericMethod<T>(value: T): T { return value; }
], {
  generics: { T: GenericNumber }
});
```

## Mixins

Easily add mixins to your composed classes.

```typescript
class TimestampMixin {
  getTimestamp() {
    return new Date().toISOString();
  }
}

const MixedClass = ClassComposer.mixin<TimestampMixin>(TimestampMixin);
```

## Error Handling

Amalgam.js provides comprehensive error handling capabilities.

```typescript
ClassComposer.addPlugin({
  onError: (error) => {
    console.error('An error occurred:', error);
  }
});
```

## Metadata

Attach metadata to your composed classes for enhanced introspection.

```typescript
const MetadataClass = ClassComposer.create('MetadataClass', [], {
  metadata: {
    version: '1.0.0',
    author: 'Amalgam.js User'
  }
});

console.log(MetadataClass.metadata);
```

## Contributing

We welcome contributions to Amalgam.js! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

Amalgam.js is [MIT licensed](LICENSE).
```

This README provides a comprehensive overview of your library, including its features, installation instructions, quick start guide, API reference, and examples of advanced usage. It also covers important topics like plugins, dependency injection, generic types, mixins, error handling, and metadata.

Remember to create the mentioned CONTRIBUTING.md and LICENSE files, and to replace any placeholder information (like the npm badge URL) with actual information once you publish your library.

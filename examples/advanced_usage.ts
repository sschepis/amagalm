import { ClassComposer } from '../src/index';

// Define a Logger interface and implementation
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

// Register the logger as a dependency
ClassComposer.registerDependency({
  token: 'logger',
  useClass: ConsoleLogger
});

// Create a mixin for adding timestamp functionality
class TimestampMixin {
  getTimestamp() {
    return new Date().toISOString();
  }
}

// Create a plugin for logging method calls
const loggingPlugin = {
  beforeMethodCall: (methodName: string, args: any[]) => {
    console.log(`Calling method: ${methodName} with args:`, args);
    return args;
  },
  afterMethodCall: (methodName: string, result: any) => {
    console.log(`Method ${methodName} returned:`, result);
    return result;
  }
};

// Add the plugin to ClassComposer
ClassComposer.addPlugin(loggingPlugin);

// Create a complex class using ClassComposer
const AdvancedClass = ClassComposer.create<{
  performTask: (task: string) => string;
  logTimestamp: () => void;
  logger: Logger;
}>('AdvancedClass', [
  function performTask(task: string) {
    return `Performed task: ${task}`;
  },
  function logTimestamp() {
    this.logger.log(`Current timestamp: ${this.getTimestamp()}`);
  }
], {
  mixins: [TimestampMixin],
  dependencies: [{ token: 'logger' }]
});

// Create an instance of the advanced class
const advancedInstance = new AdvancedClass();

// Use the composed class
const result = advancedInstance.performTask('Example Task');
console.log(result);

advancedInstance.logTimestamp();

// Demonstrate generic types
const GenericNumber = ClassComposer.createGeneric<number>();

interface GenericMath<T> {
  add(a: T, b: T): T;
}

const GenericMathClass = ClassComposer.create<GenericMath<number>>('GenericMathClass', [
  function add(a: number, b: number): number {
    return a + b;
  }
], {
  generics: { T: GenericNumber }
});

const mathInstance = new GenericMathClass();
console.log(mathInstance.add(5, 3)); // Output: 8

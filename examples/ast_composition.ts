import { ClassComposer } from '../src/index';
import * as acorn from 'acorn';
import { generate } from 'astring';

// Define a simple class as a string
const classDefinition = `
class SimpleClass {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return \`Hello, \${this.name}!\`;
  }
}
`;

// Parse the class definition into an AST
const ast = acorn.parse(classDefinition, { ecmaVersion: 2020 });

// Function to add a new method to the class AST
function addMethodToAST(ast: any, methodName: string, methodBody: string) {
  const classBody = (ast.body[0] as any).body;
  const newMethod = (acorn.parse(`
    ${methodName}() {
      ${methodBody}
    }
  `, { ecmaVersion: 2020 }).body[0] as any).body.body[0];

  classBody.body.push(newMethod);
}

// Add a new method to the AST
addMethodToAST(ast, 'sayGoodbye', 'return `Goodbye, ${this.name}!`;');

// Generate code from the modified AST
const modifiedClassCode = generate(ast);

// Define the interface for our modified class
interface IModifiedClass {
  name: string;
  sayHello(): string;
  sayGoodbye(): string;
}

// Use ClassComposer to create a new class based on the modified code
const ModifiedClass = ClassComposer.create<IModifiedClass>('ModifiedClass', [
  new Function(`return ${modifiedClassCode}`)()
]);

// Create an instance of the modified class
const instance = new ModifiedClass('Alice');

// Demonstrate the usage of the modified class
console.log(instance.sayHello()); // Output: Hello, Alice!
console.log(instance.sayGoodbye()); // Output: Goodbye, Alice!

// Example of dynamic method addition using AST and ClassComposer
function addMethodDynamically<T extends object>(className: string, methodName: string, methodBody: string): new () => T {
  const methodAST = acorn.parse(`
    class TempClass {
      ${methodName}() {
        ${methodBody}
      }
    }
  `, { ecmaVersion: 2020 });

  const methodCode = generate((methodAST.body[0] as any).body.body[0]);

  return ClassComposer.create<T>(className, [
    new Function(`return ${methodCode}`)()
  ]);
}

// Define the interface for our dynamic class
interface IDynamicClass {
  greet(): string;
}

// Add a new method dynamically
const DynamicClass = addMethodDynamically<IDynamicClass>('DynamicClass', 'greet', 'return `Greetings from ${this.constructor.name}!`;');

// Create an instance of the dynamic class
const dynamicInstance = new DynamicClass();

// Demonstrate the usage of the dynamically created method
console.log(dynamicInstance.greet()); // Output: Greetings from DynamicClass!

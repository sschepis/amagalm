import { ClassComposer } from '../src/index';
import * as acorn from 'acorn';
import * as astring from 'astring';
import * as walk from 'acorn-walk';

// Simulated AI model interface
interface AIModel {
  generateCode(prompt: string): string;
  analyzeCode(code: string): string;
}

// Mock AI model for demonstration purposes
const mockAI: AIModel = {
  generateCode: (prompt: string) => `function ${prompt}() { return "AI generated function"; }`,
  analyzeCode: (code: string) => `This code defines a function.`
};

class AICodeTransformer {
  private ai: AIModel;

  constructor(ai: AIModel) {
    this.ai = ai;
  }

  // Add a new method to an existing class
  addMethodToClass(classCode: string, methodName: string): string {
    const ast = acorn.parse(classCode, { ecmaVersion: 2020 });
    const newMethodCode = this.ai.generateCode(methodName);
    const newMethodAst = acorn.parse(newMethodCode, { ecmaVersion: 2020 });

    walk.simple(ast, {
      ClassBody(node: any) {
        node.body.push((newMethodAst as any).body[0]);
      }
    });

    return astring.generate(ast);
  }

  // Rename a method in a class
  renameMethod(classCode: string, oldName: string, newName: string): string {
    const ast = acorn.parse(classCode, { ecmaVersion: 2020 });

    walk.simple(ast, {
      MethodDefinition(node: any) {
        if (node.key.name === oldName) {
          node.key.name = newName;
        }
      }
    });

    return astring.generate(ast);
  }

  // Add a new property to a class
  addPropertyToClass(classCode: string, propertyName: string, propertyType: string): string {
    const ast = acorn.parse(classCode, { ecmaVersion: 2020 });
    const propertyDeclaration = `${propertyName}: ${propertyType};`;
    const propertyAst = acorn.parse(propertyDeclaration, { ecmaVersion: 2020 });

    walk.simple(ast, {
      ClassBody(node: any) {
        node.body.unshift((propertyAst as any).body[0]);
      }
    });

    return astring.generate(ast);
  }

  // Create a new class using ClassComposer
  createNewClass(className: string, methods: string[]): string {
    const methodsCode = methods.map(method => this.ai.generateCode(method)).join('\n');
    const classCode = `
      class ${className} {
        ${methodsCode}
      }
    `;

    const ComposedClass = ClassComposer.create(className, [
      new Function(`return ${classCode}`)()
    ]);

    return `const ${className} = ${ComposedClass.toString()}`;
  }
}

// Example usage
const transformer = new AICodeTransformer(mockAI);

// Initial class code
let classCode = `
class ExampleClass {
  constructor(private name: string) {}

  greet() {
    return \`Hello, \${this.name}!\`;
  }
}
`;

console.log("Initial class:");
console.log(classCode);

// Add a new method
classCode = transformer.addMethodToClass(classCode, "sayGoodbye");
console.log("\nAfter adding new method:");
console.log(classCode);

// Rename a method
classCode = transformer.renameMethod(classCode, "greet", "sayHello");
console.log("\nAfter renaming method:");
console.log(classCode);

// Add a new property
classCode = transformer.addPropertyToClass(classCode, "age", "number");
console.log("\nAfter adding new property:");
console.log(classCode);

// Create a new class
const newClassCode = transformer.createNewClass("AIGeneratedClass", ["method1", "method2"]);
console.log("\nNewly generated class:");
console.log(newClassCode);

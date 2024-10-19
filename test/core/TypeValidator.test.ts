import { TypeValidator } from '../../src/core/TypeValidator';
import { TypeDefinition } from '../../src/types';

describe('TypeValidator', () => {
  test('validateTypes should pass for correct types', () => {
    const typeChecking: Record<string, TypeDefinition> = {
      testMethod: { type: 'string' }
    };

    expect(() => TypeValidator.validateTypes('testMethod', ['test string'], typeChecking)).not.toThrow();
  });

  test('validateTypes should throw for incorrect types', () => {
    const typeChecking: Record<string, TypeDefinition> = {
      testMethod: { type: 'number' }
    };

    expect(() => TypeValidator.validateTypes('testMethod', ['test string'], typeChecking)).toThrow(TypeError);
  });

  test('validateTypes should handle array types', () => {
    const typeChecking: Record<string, TypeDefinition> = {
      testMethod: { type: 'string', isArray: true }
    };

    expect(() => TypeValidator.validateTypes('testMethod', [['test1', 'test2']], typeChecking)).not.toThrow();
    expect(() => TypeValidator.validateTypes('testMethod', ['test string'], typeChecking)).toThrow(TypeError);
    expect(() => TypeValidator.validateTypes('testMethod', [[1, 2]], typeChecking)).toThrow(TypeError);
  });

  test('validateTypes should use custom validate function if provided', () => {
    const typeChecking: Record<string, TypeDefinition> = {
      testMethod: { 
        type: 'string',
        validate: (value: any) => typeof value === 'string' && value.length > 3
      }
    };

    expect(() => TypeValidator.validateTypes('testMethod', ['valid'], typeChecking)).not.toThrow();
    expect(() => TypeValidator.validateTypes('testMethod', ['inv'], typeChecking)).toThrow(TypeError);
  });

  test('validateTypes should handle multiple arguments', () => {
    const typeChecking: Record<string, TypeDefinition> = {
      testMethod: { type: 'string' }
    };

    expect(() => TypeValidator.validateTypes('testMethod', ['test1', 'test2'], typeChecking)).not.toThrow();
    expect(() => TypeValidator.validateTypes('testMethod', ['test1', 2], typeChecking)).toThrow(TypeError);
  });

  test('validateTypes should do nothing if no type checking is defined for the method', () => {
    const typeChecking: Record<string, TypeDefinition> = {};

    expect(() => TypeValidator.validateTypes('testMethod', ['test', 2, true, {}], typeChecking)).not.toThrow();
  });
});

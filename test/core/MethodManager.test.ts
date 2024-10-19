import { MethodManager } from '../../src/core/MethodManager';
import { CompositionOptions } from '../../src/types';

describe('MethodManager', () => {
  let prototype: Record<string, any>;
  let options: CompositionOptions<any>;

  beforeEach(() => {
    prototype = {};
    options = {};
  });

  test('addMethod should add a method to the prototype', () => {
    const method = jest.fn();
    MethodManager.addMethod(prototype, 'testMethod', method, options);

    expect(prototype.testMethod).toBeDefined();
    expect(typeof prototype.testMethod).toBe('function');
  });

  test('addMethod should handle conflict resolution', () => {
    const method1 = jest.fn();
    const method2 = jest.fn();

    MethodManager.addMethod(prototype, 'testMethod', method1, options);
    
    options.conflictResolution = 'error';
    expect(() => MethodManager.addMethod(prototype, 'testMethod', method2, options))
      .toThrow('Method testMethod already exists');

    options.conflictResolution = 'rename';
    MethodManager.addMethod(prototype, 'testMethod', method2, options);
    expect(prototype.testMethod).toBeDefined();
    expect(Object.keys(prototype).find(key => key.startsWith('testMethod_'))).toBeDefined();

    options.conflictResolution = 'override';
    MethodManager.addMethod(prototype, 'testMethod', method2, options);
    expect(prototype.testMethod).toBeDefined();
  });

  test('wrapped method should apply plugins', () => {
    const method = jest.fn().mockReturnValue('result');
    MethodManager.addMethod(prototype, 'testMethod', method, options);

    const result = prototype.testMethod('arg1', 'arg2');

    expect(method).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result).toBe(prototype);
  });

  test('wrapped method should handle async methods', async () => {
    const asyncMethod = jest.fn().mockResolvedValue('asyncResult');
    MethodManager.addMethod(prototype, 'asyncTestMethod', asyncMethod, options);

    const result = await prototype.asyncTestMethod('arg1', 'arg2');

    expect(asyncMethod).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result).toBe(prototype);
  });
});

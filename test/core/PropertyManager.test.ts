import { PropertyManager } from '../../src/core/PropertyManager';
import { CompositionOptions } from '../../src/types';

describe('PropertyManager', () => {
  let properties: PropertyDescriptorMap;
  let options: CompositionOptions<any>;

  beforeEach(() => {
    properties = {};
    options = {};
  });

  test('defineProperty should create a property with getter and setter', () => {
    PropertyManager.defineProperty(properties, 'testProp', options);

    expect(properties.testProp).toBeDefined();
    expect(properties.testProp.get).toBeDefined();
    expect(properties.testProp.set).toBeDefined();
    expect(properties.testProp.enumerable).toBe(true);
    expect(properties.testProp.configurable).toBe(true);
  });

  test('property getter and setter should work correctly', () => {
    PropertyManager.defineProperty(properties, 'testProp', options);

    const obj = {};
    Object.defineProperties(obj, properties);

    (obj as any).testProp = 'test value';
    expect((obj as any).testProp).toBe('test value');
  });

  test('property setter should validate types if typeChecking is provided', () => {
    options.typeChecking = {
      testProp: { type: 'string' }
    };

    PropertyManager.defineProperty(properties, 'testProp', options);

    const obj = {};
    Object.defineProperties(obj, properties);

    expect(() => ((obj as any).testProp = 'valid string')).not.toThrow();
    expect(() => ((obj as any).testProp = 123)).toThrow(TypeError);
  });

  test('property setter should use custom validate function if provided', () => {
    options.typeChecking = {
      testProp: { 
        type: 'string',
        validate: (value: any) => typeof value === 'string' && value.length > 3
      }
    };

    PropertyManager.defineProperty(properties, 'testProp', options);

    const obj = {};
    Object.defineProperties(obj, properties);

    expect(() => ((obj as any).testProp = 'valid')).not.toThrow();
    expect(() => ((obj as any).testProp = 'inv')).toThrow(TypeError);
  });
});

import { DependencyContainer } from '../../src/core/DependencyContainer';
import { DependencyDefinition } from '../../src/types';

describe('DependencyContainer', () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  test('register and get with useClass', () => {
    class TestClass {}
    const def: DependencyDefinition = {
      token: 'test',
      useClass: TestClass
    };

    container.register(def);
    const result = container.get('test');

    expect(result).toBeInstanceOf(TestClass);
  });

  test('register and get with useValue', () => {
    const testValue = { key: 'value' };
    const def: DependencyDefinition = {
      token: 'test',
      useValue: testValue
    };

    container.register(def);
    const result = container.get('test');

    expect(result).toBe(testValue);
  });

  test('register and get with useFactory', () => {
    const factoryFn = jest.fn(() => 'factoryResult');
    const def: DependencyDefinition = {
      token: 'test',
      useFactory: factoryFn
    };

    container.register(def);
    const result = container.get('test');

    expect(result).toBe('factoryResult');
    expect(factoryFn).toHaveBeenCalled();
  });

  test('get throws error for unregistered dependency', () => {
    expect(() => container.get('nonexistent')).toThrow('Dependency nonexistent not found');
  });
});

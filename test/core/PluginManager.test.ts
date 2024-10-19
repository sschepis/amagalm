import { PluginManager } from '../../src/core/PluginManager';
import { ComposableElement, Constructor } from '../../src/types';

describe('PluginManager', () => {
  beforeEach(() => {
    // Reset plugins before each test
    (PluginManager as any).plugins = [];
  });

  test('addPlugin should add a plugin', () => {
    const plugin = {
      beforeCompose: (elements: ComposableElement[]) => elements,
    };

    PluginManager.addPlugin(plugin);

    expect((PluginManager as any).plugins).toHaveLength(1);
    expect((PluginManager as any).plugins[0]).toBe(plugin);
  });

  test('applyPlugins should call the correct hook', () => {
    const mockBeforeCompose = jest.fn((elements: ComposableElement[]) => elements);
    const mockAfterCompose = jest.fn(<T>(composedClass: Constructor<T>): Constructor<T> => composedClass) as <T>(composedClass: Constructor<T>) => Constructor<T>;

    PluginManager.addPlugin({
      beforeCompose: mockBeforeCompose,
      afterCompose: mockAfterCompose,
    });

    const elements: ComposableElement[] = [];
    PluginManager.applyPlugins('beforeCompose', elements);
    expect(mockBeforeCompose).toHaveBeenCalledWith(elements);

    class TestClass {}
    const result = PluginManager.applyPlugins<Constructor<TestClass>>('afterCompose', TestClass);
    expect(mockAfterCompose).toHaveBeenCalledWith(TestClass);
    expect(result).toBe(TestClass);
  });

  test('applyPlugins should handle multiple plugins', () => {
    const plugin1 = {
      beforeMethodCall: jest.fn((methodName: string, args: any[]) => args),
    };
    const plugin2 = {
      beforeMethodCall: jest.fn((methodName: string, args: any[]) => args),
    };

    PluginManager.addPlugin(plugin1);
    PluginManager.addPlugin(plugin2);

    const methodName = 'testMethod';
    const args = ['arg1', 'arg2'];
    PluginManager.applyPlugins('beforeMethodCall', methodName, args);

    expect(plugin1.beforeMethodCall).toHaveBeenCalledWith(methodName, args);
    expect(plugin2.beforeMethodCall).toHaveBeenCalledWith(methodName, args);
  });
});

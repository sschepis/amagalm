import { PluginHooks, ComposableElement, Constructor } from '../types';

export class PluginManager {
  private static plugins: PluginHooks[] = [];

  static addPlugin(plugin: Partial<PluginHooks>) {
    PluginManager.plugins.push(plugin as PluginHooks);
  }

  static applyPlugins<T>(hook: keyof PluginHooks, ...args: any[]): T {
    return PluginManager.plugins.reduce((acc: T, plugin) => {
      const hookFn = plugin[hook];
      if (hookFn) {
        switch (hook) {
          case 'beforeCompose':
            return (hookFn as (elements: ComposableElement[]) => ComposableElement[])(acc as any) as T;
          case 'afterCompose':
            return (hookFn as <U>(composedClass: Constructor<U>) => Constructor<U>)(acc as any) as T;
          case 'beforeMethodCall':
          case 'afterMethodCall':
            return (hookFn as (methodName: string, args: any[]) => any)(args[0], args[1]) as T;
          case 'onError':
            (hookFn as (error: Error) => void)(args[0] as Error);
            return acc;
          default:
            return acc;
        }
      }
      return acc;
    }, args[0] as T);
  }
}

import { CompositionOptions, FunctionType } from '../types';
import { PluginManager } from './PluginManager';
import { TypeValidator } from './TypeValidator';

export class MethodManager {
  static addMethod(
    prototype: Record<string, any>,
    name: string,
    method: FunctionType,
    options: CompositionOptions<any>
  ) {
    if (name in prototype) {
      switch (options.conflictResolution) {
        case 'error':
          throw new Error(`Method ${name} already exists`);
        case 'rename':
          let newName = `${name}_${Date.now()}`;
          prototype[newName] = MethodManager.wrapMethod(method, newName, options);
          return;
        case 'override':
        default:
          break;
      }
    }
    prototype[name] = MethodManager.wrapMethod(method, name, options);
  }

  private static wrapMethod(
    method: FunctionType, 
    name: string, 
    options: CompositionOptions<any>
  ): FunctionType {
    return function(this: any, ...args: any[]) {
      try {
        // Apply beforeMethodCall plugin
        const modifiedArgs = PluginManager.applyPlugins<any[]>('beforeMethodCall', args, name);

        // Ensure modifiedArgs is an array
        const argsArray = Array.isArray(modifiedArgs) ? modifiedArgs : [modifiedArgs];

        // Validate types
        TypeValidator.validateTypes(name, argsArray, options.typeChecking);

        // Call the original method
        const result = method.apply(this, argsArray);

        // Apply afterMethodCall plugin
        const processedResult = PluginManager.applyPlugins('afterMethodCall', result, name);

        // Store the actual result on the instance
        this[`__${name}Result__`] = processedResult !== undefined ? processedResult : result;

        // Return 'this' for method chaining
        return this;
      } catch (error) {
        console.error(`Error in wrapped method ${name}:`, error);
        PluginManager.applyPlugins('onError', error);
        throw error;
      }
    };
  }

  static getMethodResult(instance: any, methodName: string): any {
    return instance[`__${methodName}Result__`];
  }
}

import { CompositionOptions } from '../types';
import { TypeValidator } from './TypeValidator';

export class PropertyManager {
  static defineProperty(
    properties: PropertyDescriptorMap, 
    name: string, 
    options: CompositionOptions<any>
  ) {
    let value: any;
    properties[name] = {
      get: function() { return value; },
      set: function(newValue: any) {
        TypeValidator.validateTypes(name, [newValue], options.typeChecking);
        value = newValue;
        return this;
      },
      enumerable: true,
      configurable: true
    };
  }
}

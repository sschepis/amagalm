import { TypeDefinition } from '../types';

export class TypeValidator {
  static validateTypes(
    name: string, 
    args: any[], 
    typeChecking?: Record<string, TypeDefinition>
  ) {
    if (typeChecking && typeChecking[name]) {
      const def = typeChecking[name];
      args.forEach((arg, index) => {
        const isValid = def.isArray 
          ? Array.isArray(arg) && arg.every(item => typeof item === def.type)
          : typeof arg === def.type;

        if (!isValid || (def.validate && !def.validate(arg))) {
          throw new TypeError(`Invalid type for argument ${index} of ${name}`);
        }
      });
    }
  }
}

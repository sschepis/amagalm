import { DependencyDefinition, Constructor } from '../types';

export class DependencyContainer {
  private container: Map<string | symbol, any> = new Map();

  register(def: DependencyDefinition): void {
    if (def.useClass) {
      this.container.set(def.token, new def.useClass());
    } else if (def.useValue) {
      this.container.set(def.token, def.useValue);
    } else if (def.useFactory) {
      const deps = (def.deps || []).map(dep => this.get(dep));
      this.container.set(def.token, def.useFactory(...deps));
    }
  }

  get(token: string | symbol): any {
    if (!this.container.has(token)) {
      throw new Error(`Dependency ${String(token)} not found`);
    }
    return this.container.get(token);
  }
}

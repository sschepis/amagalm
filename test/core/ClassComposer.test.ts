import { ClassComposer } from '../../src/core/ClassComposer';
import { MethodManager } from '../../src/core/MethodManager';

describe('ClassComposer', () => {
  test('compose should combine two classes', () => {
    class A {
      methodA() { return 'A'; }
    }
    class B {
      methodB() { return 'B'; }
    }

    const ComposedClass = ClassComposer.compose<A & B>(A, B);
    const instance = new ComposedClass();

    instance.methodA();
    expect(MethodManager.getMethodResult(instance, 'methodA')).toBe('A');
    instance.methodB();
    expect(MethodManager.getMethodResult(instance, 'methodB')).toBe('B');
  });

  test('mixin should add methods from mixins', () => {
    class Mixin1 {
      method1() { return 'Mixin1'; }
    }
    class Mixin2 {
      method2() { return 'Mixin2'; }
    }

    const MixedClass = ClassComposer.mixin<Mixin1 & Mixin2>(Mixin1, Mixin2);
    const instance = new MixedClass();

    instance.method1();
    expect(MethodManager.getMethodResult(instance, 'method1')).toBe('Mixin1');
    instance.method2();
    expect(MethodManager.getMethodResult(instance, 'method2')).toBe('Mixin2');
  });

  test('create should handle custom options', () => {
    const CustomClass = ClassComposer.create<{customMethod(): string}>(
      'CustomClass',
      [function customMethod() { return 'Custom'; }],
      { metadata: { version: '1.0.0' } }
    );

    const instance = new CustomClass();
    instance.customMethod();
    expect(MethodManager.getMethodResult(instance, 'customMethod')).toBe('Custom');
    expect((CustomClass as any).metadata.version).toBe('1.0.0');
  });
});

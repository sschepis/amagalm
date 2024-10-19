import { ClassComposer } from '../src/index';

// Define two simple classes
class Greeter {
  greet(name: string) {
    return `Hello, ${name}!`;
  }
}

class Farewell {
  sayGoodbye(name: string) {
    return `Goodbye, ${name}!`;
  }
}

// Compose a new class from Greeter and Farewell
const GreeterFarewell = ClassComposer.compose<Greeter & Farewell>(Greeter, Farewell);

// Create an instance of the composed class
const greeterFarewell = new GreeterFarewell();

console.log(greeterFarewell.greet('Alice')); // Output: Hello, Alice!
console.log(greeterFarewell.sayGoodbye('Bob')); // Output: Goodbye, Bob!

// Demonstrate the use of ClassComposer.create for more flexibility
const CustomGreeter = ClassComposer.create<{ greet: (name: string) => string }>('CustomGreeter', [
  function greet(name: string) {
    return `Greetings, ${name}! Welcome to Amalgam.js!`;
  }
]);

const customGreeter = new CustomGreeter();
console.log(customGreeter.greet('Charlie')); // Output: Greetings, Charlie! Welcome to Amalgam.js!

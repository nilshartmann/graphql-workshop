import Service from "./service";
console.log("HALLO");

class Person {
  constructor(private name: string) {}

  sayWhat(what: string) {
    return `${what}, ${this.name}`;
  }
}

const p = new Person("World");
const what = p.sayWhat("Hello");

console.log(what);

const s = new Service();
const user1 = s.getUser("U1");
console.log(user1);

export class TypeOrmError extends Error {
  // error name
  name: string;

  // error message
  message: string;

  // error stack
  stack: string;

  constructor(error) {
    super(error);
    // sets the typeorm error name
    this.name = error.name;
    this.message = error.message;
    this.stack = error.stack;
  }
}

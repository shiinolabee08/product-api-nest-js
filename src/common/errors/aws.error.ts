export class AWSError extends Error {
  // error code
  code: number;

  constructor(error) {
    super(error.message);

    // sets the aws error code
    this.code = error.statusCode;
  }
}

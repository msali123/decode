export interface ErrorContext {
  response: Response;
  json?: object;
}

export class DecodeError extends Error {
  context?: ErrorContext;
}

class InvalidParams extends DecodeError {
  constructor(message: any) {
    super(message);
    this.name = "InvalidParams";
  }
}

class UnexpectedError extends DecodeError {
  context: ErrorContext;

  constructor(message: any, ctx: ErrorContext) {
    super(message);
    this.name = "UnexpectedError";
    this.context = ctx;
  }
}

class NotFound extends DecodeError {
  constructor(message: any) {
    super(message);
    this.name = "NotFound";
  }
}

const errors = { InvalidParams, UnexpectedError, NotFound };

export default errors;
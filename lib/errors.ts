export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ServerError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends ServerError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends ServerError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternalServerError extends ServerError {
  constructor(message: string) {
    super(message, 500);
  }
}

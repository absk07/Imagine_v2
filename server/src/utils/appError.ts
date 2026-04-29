import { CustomError } from './customError';

export class BadRequestError extends CustomError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500);
    }
}
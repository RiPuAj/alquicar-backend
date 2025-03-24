export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const handlerValidationError = ({ error }) => {
  console.log(error.message);
}
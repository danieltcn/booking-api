export class CustomError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message);

    this.status = status;

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return 'Something went wrong: ' + this.message;
  }
}

export const generateError = (status: number, message: any) => {
  const error = new CustomError(status);
  error.message = message;
  return error;
};

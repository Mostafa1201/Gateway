class CustomError extends Error {
  constructor(message, status, error) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    (this as any).status = status;
    (this as any).response = {
      statusCode: status,
      message,
      error,
    };
  }

  statusCode() {
    return (this as any).status;
  }
}

module.exports = CustomError;

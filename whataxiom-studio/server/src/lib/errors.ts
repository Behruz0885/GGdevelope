/** An error with an attached HTTP status code, surfaced cleanly to the client. */
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

/** Thrown when a required API key / provider is not configured. */
export function missingKey(what: string): AppError {
  return new AppError(
    `${what} is not configured. Add the required key to your .env file and restart the server.`,
    424 // Failed Dependency
  );
}

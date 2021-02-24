export class ImoDatabaseServerError {
  public readonly name = ImoDatabaseServerError.name;
  constructor(public code: number, public message: string, public originalError?: any) {}

  public toString(): string {
    return `${this.name}: ${this.code} ${this.message}`;
  }

  public static isImoDatabaseServerError(err: any): err is ImoDatabaseServerError {
    return !!err && err.name === ImoDatabaseServerError.name && typeof err.code === "number" && typeof err.message === "string";
  }
}

export class ErrorCode {
  public static readonly BAD_REQUEST = 400;
  public static readonly UNAUTHORIZED = 401;
  public static readonly FORBIDDEN = 403;
  public static readonly NOT_FOUND = 404;
  public static readonly CONFLICT = 409;
  public static readonly INTERNAL = 500;

  public static categorize(err: any): ImoDatabaseServerError {
    if (ImoDatabaseServerError.isImoDatabaseServerError(err)) {
      return err;
    }

    return new ImoDatabaseServerError(ErrorCode.INTERNAL, "Unexpected error", err);
  }
}

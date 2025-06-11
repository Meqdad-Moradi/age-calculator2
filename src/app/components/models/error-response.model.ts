export class ErrorResponse<T> extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;

  constructor(status: number, message: string, details?: T) {
    super(message);
    this.name = 'ErrorResponse';
    this.status = status;
    this.details = details;

    // restore prototype chain (needed when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ShowErrorMessage {
  name: string;
  message: string;
  details?: unknown;
}

export interface ErrorOption {
  showInDialog?: boolean;
  showInSnackbar?: boolean;
}

export class ErrorResponses<T> {
  constructor(public status: number, public value: T | string) {}
}

export interface ErrorAction<T> {
  logError?: boolean;
  customErrorMessage?: string;
  showErrorInDialog?: boolean;
  showErrorInSnackbar?: boolean;
  valueToReturn?: T;
  statusCodesWhitelist?: number[];
}

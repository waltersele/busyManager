export class MatrixError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'MatrixError';
  }
}

export class ModuleNotSubscribedError extends MatrixError {
  constructor() {
    super('Module not subscribed', 403, 'MODULE_NOT_SUBSCRIBED');
    this.name = 'ModuleNotSubscribedError';
  }
}

export class InsufficientTokensError extends MatrixError {
  constructor() {
    super('Insufficient token balance', 402, 'INSUFFICIENT_TOKENS');
    this.name = 'InsufficientTokensError';
  }
}

interface dataInterface {
  code: number;
  message: string;
}

export interface SuccessInterface {
  success: dataInterface;
}

export interface ErrorInterface {
  error: dataInterface;
}

export type ResponseInterface = string | Error | SuccessInterface | ErrorInterface;

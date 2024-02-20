import { ErrorInterface, ResponseInterface, SuccessInterface } from '../../domain/interfaces/response.interface';

const setFormatError = (code: number, message: string): ErrorInterface => {
  return {
    error: {
      code: code,
      message: message
    }
  } as ErrorInterface;
};

const setFormatSuccess = (code: number, message: string): SuccessInterface => {
  return {
    success: {
      code: code,
      message: message
    }
  } as SuccessInterface;
};

const parseResponse = (data: ResponseInterface) => {
  if (data.constructor === Error) {
    const errorSplitter = data.toString().split(': ');
    const errorCode = parseInt(errorSplitter[1] as string, 10);
    const errorMessage = `${errorSplitter[1]}: ${errorSplitter[2]}`;
    return setFormatError(errorCode, errorMessage);
  } else if (typeof data === 'string') {
    const successCode = parseInt(data.toString().split(':')[0] as string, 10);
    return setFormatSuccess(successCode, data);
  } else {
    return data;
  }
};

export default parseResponse;

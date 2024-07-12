import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

type CustomError = { statusCode: number; status: string; error: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const resp = exception.getResponse();

      response.status(exception?.getStatus()).json({
        statusCode: exception?.getStatus(),
        message: exception ? (resp as CustomError).error : exception.message,
        timestamp: new Date().toISOString(),
      });

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}

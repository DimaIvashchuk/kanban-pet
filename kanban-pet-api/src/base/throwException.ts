import { HttpException, HttpStatus } from '@nestjs/common';

export default (ex: any) => {
  throw new HttpException(
    {
      statusCode:
        ex.response?.status || ex.status || HttpStatus.INTERNAL_SERVER_ERROR,
      status: 'error',
      error: ex.message,
    },
    ex.response?.status || ex.status || HttpStatus.INTERNAL_SERVER_ERROR,
    {
      cause: ex,
    },
  );
};

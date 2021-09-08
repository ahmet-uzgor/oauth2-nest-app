import { HttpException } from '@nestjs/common';

interface IErrData {
  msg?: string;
  raise?: boolean;
}

export const unauthorized = (data?: IErrData) => {
  const err = new HttpException(
    {
      statusCode: 401,
      message: data?.msg || 'UNAUTHORIZED',
    },
    401,
  );

  if (data?.raise) {
    throw err;
  }

  return err;
};
export const refreshTokenExpiredSignature = (data?: IErrData) => {
  const err = new HttpException(
    {
      statusCode: 419,
      message: data?.msg || 'REFRESH_TOKEN_EXPIRED',
    },
    419,
  );

  if (data?.raise) {
    throw err;
  }

  return err;
};

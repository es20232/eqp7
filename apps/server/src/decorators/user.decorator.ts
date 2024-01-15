import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserData {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);

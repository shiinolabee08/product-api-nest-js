import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustomParamsDecorator = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      ...(!request.body.id && request.params.id && { id: parseInt(request.params.id, 10) }),
      ...request.body,
    };
  },
);

import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    return data ? user?.[data] : user;
  },
);

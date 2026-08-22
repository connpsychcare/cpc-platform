import { mixin, type ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { OAuthProvider } from "@workspace/contracts";

export function OAuthGuard(provider: OAuthProvider) {
  class OAuthGuardMixin extends AuthGuard(provider) {
    getAuthenticateOptions(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();
      const clientApp: string = req.clientApp ?? "web";

      return {
        state: Buffer.from(clientApp).toString("base64"),
      };
    }
  }

  return mixin(OAuthGuardMixin);
}

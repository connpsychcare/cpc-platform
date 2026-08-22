import { Module } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "@/modules/auth/auth.module";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [AuthModule, TokenModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}

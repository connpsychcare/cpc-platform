import { Module } from "@nestjs/common";

import { PrismaModule } from "@/modules/prisma/prisma.module";
import { AuditModule } from "@/modules/audit/audit.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PostController, CategoryController],
  providers: [PostService, CategoryService],
  exports: [PostService, CategoryService],
})
export class ContentModule {}

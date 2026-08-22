import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CategoryDto, CategoryQueryDto } from "@workspace/contracts/category/dto";

import { CategoryService } from "./category.service";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("content")
@Roles("admin", "staff", "author")
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get("public")
  listPublic() {
    return this.categoryService.listPublic();
  }

  @Get()
  list(@Query() query: CategoryQueryDto) {
    return this.categoryService.list(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(id);
  }

  @Post()
  create(@Body() dto: CategoryDto, @User() user: AuthUser) {
    return this.categoryService.create(dto, user);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: CategoryDto,
    @User() user: AuthUser,
  ) {
    return this.categoryService.update(id, dto, user);
  }

  @Patch(":id/restore")
  restore(@Param("id") id: string, @User() user: AuthUser) {
    return this.categoryService.restore(id, user);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Query("force") force: string,
    @User() user: AuthUser,
  ) {
    return this.categoryService.remove(id, force === "true", user);
  }
}

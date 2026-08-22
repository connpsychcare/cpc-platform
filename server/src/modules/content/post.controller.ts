import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
  Query,
} from "@nestjs/common";
import {
  PostDto,
  PostQueryDto,
  TrackPostViewDto,
} from "@workspace/contracts/post/dto";

import { PostService } from "./post.service";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("content")
@Roles("admin", "staff", "author")
@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ── Public reading. Declared before :id so the literal wins the match. ─────

  @Public()
  @Get("public")
  listPublic(@Query() query: PostQueryDto) {
    return this.postService.listPublic(query);
  }

  @Public()
  @Get("public/:slug")
  findPublic(@Param("slug") slug: string) {
    return this.postService.findPublicBySlug(slug);
  }

  @Public()
  @HttpPost("public/:slug/view")
  trackView(@Param("slug") slug: string, @Body() dto: TrackPostViewDto) {
    return this.postService.trackView(slug, dto);
  }

  // ── Authoring ─────────────────────────────────────────────────────────────

  @Get()
  list(@Query() query: PostQueryDto, @User() user: AuthUser) {
    return this.postService.list(query, user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() user: AuthUser) {
    return this.postService.findOne(id, user);
  }

  @HttpPost()
  create(@Body() dto: PostDto, @User() user: AuthUser) {
    return this.postService.create(dto, user);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: PostDto,
    @User() user: AuthUser,
  ) {
    return this.postService.update(id, dto, user);
  }

  @Patch(":id/restore")
  restore(@Param("id") id: string, @User() user: AuthUser) {
    return this.postService.restore(id, user);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Query("force") force: string,
    @User() user: AuthUser,
  ) {
    return this.postService.remove(id, force === "true", user);
  }
}

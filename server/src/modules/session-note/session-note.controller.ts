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
import {
  SessionNoteDto,
  SessionNoteQueryDto,
} from "@workspace/contracts/session-note/dto";

import { SessionNoteService } from "./session-note.service";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("session-notes")
export class SessionNoteController {
  constructor(private readonly sessionNoteService: SessionNoteService) {}

  @Roles("admin", "staff")
  @Post()
  create(@Body() dto: SessionNoteDto, @User() currentUser: AuthUser) {
    return this.sessionNoteService.create(dto, currentUser);
  }

  @Get()
  list(@Query() query: SessionNoteQueryDto, @User() currentUser: AuthUser) {
    return this.sessionNoteService.list(query, currentUser);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.sessionNoteService.findOne(id, currentUser);
  }

  @Roles("admin", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: Partial<SessionNoteDto>,
    @User() currentUser: AuthUser,
  ) {
    return this.sessionNoteService.update(id, dto, currentUser);
  }

  @Roles("admin", "staff")
  @Delete(":id")
  remove(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.sessionNoteService.remove(id, currentUser);
  }
}

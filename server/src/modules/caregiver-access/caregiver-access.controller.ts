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
  CaregiverAccessDto,
  RevokeCaregiverAccessDto,
  CaregiverAccessQueryDto,
  SendCaregiverInvitationDto,
  CaregiverInvitationQueryDto,
} from "@workspace/contracts/caregiver-access/dto";

import { CaregiverAccessService } from "./caregiver-access.service";
import { Public } from "@/decorators/public.decorator";
import { Roles } from "@/decorators/roles.decorator";
import { User } from "@/decorators/user.decorator";
import { RequiresModule } from "@/decorators/require-module.decorator";

@RequiresModule("clinical")
@Roles("admin", "staff", "patient")
@Controller("caregiver-access")
export class CaregiverAccessController {
  constructor(
    private readonly caregiverAccessService: CaregiverAccessService,
  ) {}

  // ── Accesses ────────────────────────────────────────────────────────────────

  @Roles("admin", "staff")
  @Post()
  grant(@Body() dto: CaregiverAccessDto, @User() currentUser: AuthUser) {
    return this.caregiverAccessService.grant(dto, currentUser);
  }

  @Get()
  list(@Query() query: CaregiverAccessQueryDto, @User() currentUser: AuthUser) {
    return this.caregiverAccessService.list(query, currentUser);
  }

  @Roles("patient")
  @Get("mine")
  mine(@User() currentUser: AuthUser) {
    return this.caregiverAccessService.mine(currentUser);
  }

  /** Caregivers who can access the current patient's own care record */
  @Roles("patient")
  @Get("my-profile")
  myProfile(@User() currentUser: AuthUser) {
    return this.caregiverAccessService.myProfile(currentUser);
  }

  /** Invitations the current patient has sent */
  @Roles("patient")
  @Get("my-invitations")
  myInvitations(@User() currentUser: AuthUser) {
    return this.caregiverAccessService.myInvitations(currentUser);
  }

  // ── Invitations ─────────────────────────────────────────────────────────────

  @Roles("admin", "patient")
  @Post("invitations")
  sendInvitation(
    @Body() dto: SendCaregiverInvitationDto,
    @User() currentUser: AuthUser,
  ) {
    return this.caregiverAccessService.sendInvitation(dto, currentUser);
  }

  @Roles("admin")
  @Get("invitations")
  listInvitations(
    @Query() query: CaregiverInvitationQueryDto,
    @User() currentUser: AuthUser,
  ) {
    return this.caregiverAccessService.listInvitations(query, currentUser);
  }

  /** Public - invited person looks up the invitation by token */
  @Public()
  @Get("invitations/token/:token")
  getInvitationByToken(@Param("token") token: string) {
    return this.caregiverAccessService.getInvitationByToken(token);
  }

  /** Public - invited person accepts (must be signed in to link their account) */
  @Roles("patient")
  @Post("invitations/token/:token/accept")
  acceptInvitation(
    @Param("token") token: string,
    @User() currentUser: AuthUser,
  ) {
    return this.caregiverAccessService.acceptInvitation(token, currentUser);
  }

  /** Public - invited person rejects */
  @Roles("patient")
  @Post("invitations/token/:token/reject")
  rejectInvitation(
    @Param("token") token: string,
    @User() currentUser: AuthUser,
  ) {
    return this.caregiverAccessService.rejectInvitation(token, currentUser);
  }

  @Roles("admin", "patient")
  @Patch("invitations/:id/revoke")
  revokeInvitation(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.caregiverAccessService.revokeInvitation(id, currentUser);
  }

  // ── Access by id ────────────────────────────────────────────────────────────
  // Declared last so the literal paths above win the match. A ":id" route
  // placed earlier swallows "/invitations" and answers 404.

  @Get(":id")
  findOne(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.caregiverAccessService.findOne(id, currentUser);
  }

  @Roles("admin", "staff")
  @Patch(":id/revoke")
  revoke(
    @Param("id") id: string,
    @Body() dto: RevokeCaregiverAccessDto,
    @User() currentUser: AuthUser,
  ) {
    return this.caregiverAccessService.revoke(id, dto, currentUser);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string, @User() currentUser: AuthUser) {
    return this.caregiverAccessService.remove(id, currentUser);
  }
}

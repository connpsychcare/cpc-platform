import { Controller, Get } from "@nestjs/common";

import { DashboardService } from "./dashboard.service";
import { Roles } from "@/decorators/roles.decorator";
import { Public } from "@/decorators/public.decorator";
import { User } from "@/decorators/user.decorator";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get("stats")
  getPublicStats() {
    return this.dashboardService.getPublicStats();
  }

  @Roles("admin")
  @Get("admin")
  getAdminOverview() {
    return this.dashboardService.getAdminOverview();
  }

  @Roles("staff")
  @Get("provider")
  getProviderOverview(@User("id") userId: string) {
    return this.dashboardService.getProviderOverview(userId);
  }

  @Roles("staff")
  @Get("staff")
  getStaffOverview(@User("id") userId: string) {
    return this.dashboardService.getStaffOverview(userId);
  }

  @Roles("patient")
  @Get("patient")
  getPatientOverview(@User("id") userId: string) {
    return this.dashboardService.getPatientOverview(userId);
  }
}

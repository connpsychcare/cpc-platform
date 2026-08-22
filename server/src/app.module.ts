import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";

import { EnvModule } from "@/modules/env/env.module";
import { validateEnv } from "@/schemas/env.schema";
import { AuthGuard } from "@/guards/auth.guard";
import { ModulePermissionGuard } from "@/guards/module-permission.guard";
import { AuthModule } from "@/modules/auth/auth.module";
import { TokenModule } from "@/modules/token/token.module";
import { PublicModule } from "@/modules/public/public.module";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { LoggerModule } from "@/modules/logger/logger.module";
import { SchedulerModule } from "@/modules/scheduler/scheduler.module";
import { NotificationModule } from "@/modules/notification/notification.module";
import { AllExceptionsFilter } from "@/filters/exceptions.filter";
import { ResponseInterceptor } from "@/interceptors/response.interceptor";
import { AdminModule } from "@/modules/admin/admin.module";
import { CacheModule } from "@/modules/cache/cache.module";
import { UserModule } from "@/modules/user/user.module";
import { MediaModule } from "@/modules/media/media.module";
import { AuditModule } from "@/modules/audit/audit.module";
import { BusinessModule } from "@/modules/business/business.module";
import { PatientModule } from "@/modules/patient/patient.module";
import { ProviderModule } from "@/modules/provider/provider.module";
import { ContentModule } from "@/modules/content/content.module";
import { AvailabilityModule } from "@/modules/availability/availability.module";
import { AppointmentModule } from "@/modules/appointment/appointment.module";
import { ChatModule } from "@/modules/chat/chat.module";
import { PaymentModule } from "@/modules/payment/payment.module";
import { CampaignModule } from "@/modules/campaign/campaign.module";
import { TestimonialModule } from "@/modules/testimonial/testimonial.module";
import { JobListingModule } from "@/modules/job-listing/job-listing.module";
import { ClientModule } from "./modules/client/client.module";
import { LeadModule } from "@/modules/lead/lead.module";
import { TrafficModule } from "./modules/traffic/traffic.module";
import { DashboardModule } from "@/modules/dashboard/dashboard.module";
import { StaffModule } from "@/modules/staff/staff.module";
import { TreatmentPlanModule } from "@/modules/treatment-plan/treatment-plan.module";
import { BehaviorProgramModule } from "@/modules/behavior-program/behavior-program.module";
import { SessionNoteModule } from "@/modules/session-note/session-note.module";
import { DataPointModule } from "@/modules/data-point/data-point.module";
import { StaffAssignmentModule } from "@/modules/staff-assignment/staff-assignment.module";
import { InsuranceAuthorizationModule } from "@/modules/insurance-authorization/insurance-authorization.module";
import { CaregiverAccessModule } from "@/modules/caregiver-access/caregiver-access.module";
import { StaffPermissionModule } from "@/modules/staff-permission/staff-permission.module";
import { ProgressReportModule } from "@/modules/progress-report/progress-report.module";
import { TeacherTokenModule } from "@/modules/teacher-token/teacher-token.module";
import { ClinicalFormsModule } from "@/modules/clinical-forms/clinical-forms.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60000, limit: 100 },
    ]),
    EnvModule,
    CacheModule,
    SchedulerModule,
    PublicModule,
    ClientModule,
    PrismaModule,
    LoggerModule,
    NotificationModule,
    AuthModule,
    TokenModule,
    UserModule,
    AdminModule,
    MediaModule,
    AuditModule,
    BusinessModule,
    PatientModule,
    ProviderModule,
    ContentModule,
    AvailabilityModule,
    AppointmentModule,
    ChatModule,
    PaymentModule,
    CampaignModule,
    TestimonialModule,
    JobListingModule,
    LeadModule,
    TrafficModule,
    DashboardModule,
    StaffModule,
    TreatmentPlanModule,
    BehaviorProgramModule,
    SessionNoteModule,
    DataPointModule,
    StaffAssignmentModule,
    InsuranceAuthorizationModule,
    CaregiverAccessModule,
    StaffPermissionModule,
    ProgressReportModule,
    TeacherTokenModule,
    ClinicalFormsModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ModulePermissionGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    AllExceptionsFilter,
    ResponseInterceptor,
  ],
})
export class AppModule {}

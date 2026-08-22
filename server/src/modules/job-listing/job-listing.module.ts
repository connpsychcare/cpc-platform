import { Module } from "@nestjs/common";
import { JobListingController } from "./job-listing.controller";
import { JobListingService } from "./job-listing.service";

@Module({
  controllers: [JobListingController],
  providers: [JobListingService],
  exports: [JobListingService],
})
export class JobListingModule {}

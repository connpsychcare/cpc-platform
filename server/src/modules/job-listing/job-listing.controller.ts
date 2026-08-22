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
  JobListingDto,
  JobListingQueryDto,
} from "@workspace/contracts/job-listing/dto";

import { JobListingService } from "./job-listing.service";
import { Roles } from "@/decorators/roles.decorator";
import { Public } from "@/decorators/public.decorator";

@Controller("job-listings")
export class JobListingController {
  constructor(private readonly jobListingService: JobListingService) {}

  @Roles("admin")
  @Post()
  create(@Body() dto: JobListingDto) {
    return this.jobListingService.create(dto);
  }

  @Public()
  @Get()
  list(@Query() query: JobListingQueryDto) {
    return this.jobListingService.list(query);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobListingService.findOne(id);
  }

  @Roles("admin")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: Partial<JobListingDto>) {
    return this.jobListingService.update(id, dto);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobListingService.remove(id);
  }
}

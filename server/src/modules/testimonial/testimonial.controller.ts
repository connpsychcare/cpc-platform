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
  TestimonialDto,
  TestimonialQueryDto,
  SubmitTestimonialDto,
} from "@workspace/contracts/testimonial/dto";

import { TestimonialService } from "./testimonial.service";
import { Roles } from "@/decorators/roles.decorator";
import { Public } from "@/decorators/public.decorator";
import { User } from "@/lib/decorators/user.decorator";

@Controller("testimonials")
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Roles("admin")
  @Post()
  create(@Body() dto: TestimonialDto) {
    return this.testimonialService.create(dto);
  }

  @Roles("patient")
  @Post("submit")
  submit(@Body() dto: SubmitTestimonialDto, @User() user: AuthUser) {
    return this.testimonialService.submit(dto, user);
  }

  @Roles("patient")
  @Get("mine")
  listMine(@User() user: AuthUser) {
    return this.testimonialService.listMine(user);
  }

  @Public()
  @Get()
  list(@Query() query: TestimonialQueryDto) {
    return this.testimonialService.list(query);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.testimonialService.findOne(id);
  }

  @Roles("admin")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: Partial<TestimonialDto>) {
    return this.testimonialService.update(id, dto);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.testimonialService.remove(id);
  }
}

import { v2 as cloudinary } from "cloudinary";

import { EnvService } from "../env/env.service";

export const CLOUDINARY = "CLOUDINARY";

export const cloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [EnvService],
  useFactory: (env: EnvService) => {
    const cloudinaryUrl = new URL(env.get("CLOUDINARY_URL"));

    cloudinary.config({
      cloud_name: cloudinaryUrl.hostname,
      api_key: cloudinaryUrl.username,
      api_secret: cloudinaryUrl.password,
      secure: true,
    });

    return cloudinary;
  },
};

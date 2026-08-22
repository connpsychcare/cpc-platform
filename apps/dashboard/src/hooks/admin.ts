"use client";

import * as user from "@workspace/sdk/admin";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useUser,
  useEntities: useUsers,
  useCreateEntity: useCreateUser,
  useUpdateEntity: useUpdateUser,
  useDeleteEntity: useDeleteUser,
  useRestoreEntity: useRestoreUser,
} = createCrudHooks(
  {
    findOne: user.findUser,
    findAll: user.findAllUsers,
    create: user.createUser,
    update: user.updateUser,
    delete: user.deleteUser,
    restore: user.restoreUser,
  },
  {
    single: "user",
    list: "users",
  },
);

"use client";

import * as contact from "@workspace/sdk/contact";
import * as newsletter from "@workspace/sdk/newsletter";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useNewsletterSubscriber,
  useEntities: useNewsletterSubscribers,
  useDeleteEntity: useDeleteNewsletterSubscriber,
  useRestoreEntity: useRestoreNewsletterSubscriber,
} = createCrudHooks(
  {
    findOne: newsletter.getNewsletterSubscriber,
    findAll: newsletter.listNewsletterSubscribers,
    delete: newsletter.deleteNewsletterSubscriber,
    restore: newsletter.restoreNewsletterSubscriber,
  },
  {
    single: "newsletter-subscriber",
    list: "newsletter-subscribers",
  },
);

export const {
  useEntity: useContactMessage,
  useEntities: useContactMessages,
  useUpdateEntity: useReplyContactMessage,
  useDeleteEntity: useDeleteContactMessage,
  useRestoreEntity: useRestoreContactMessage,
} = createCrudHooks(
  {
    findOne: contact.getContactMessage,
    findAll: contact.getContactMessages,
    update: contact.replyContactMessage,
    delete: contact.deleteContactMessage,
    restore: contact.restoreContactMessage,
  },
  {
    single: "contact-message",
    list: "contact-messages",
  },
);

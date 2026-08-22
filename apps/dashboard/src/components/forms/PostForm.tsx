"use client";

import type { BaseCUFormProps } from "@workspace/contracts";
import { postSchema } from "@workspace/contracts/post";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { MediaField } from "@workspace/ui/media/mediaField";
import { GenericForm } from "@workspace/ui/shared/GenericForm";

import { useCategories, usePost } from "@/hooks/content-cms";

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];

const PostForm = ({ entityId, formType }: BaseCUFormProps) => {
  return (
    <GenericForm
      entityId={entityId}
      formType={formType}
      entityName="Post"
      description="Drafts save with whatever you have. Publishing requires a category, title, slug, excerpt, and body."
      schema={postSchema}
      useQuery={usePost}
      defaultValues={{
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
      }}
    >
      {(form, data) => (
        <>
          <FormSection
            title="Content"
            description="The article itself. Only a title is needed to save a draft."
          >
            <InputField form={form} name="title" label="Title" />
            <InputField
              form={form}
              name="slug"
              label="Slug"
              placeholder="how-telehealth-visits-work"
            />
            <ComboboxField
              form={form}
              name="categoryId"
              label="Category"
              placeholder="Choose a category"
              dataKey="categories"
              useQuery={useCategories}
              queryArgs={{ page: 1, limit: 100, sortBy: "name", sortOrder: "asc", searchBy: "name" }}
              getOption={(category) => ({
                key: `${category.name} ${category.slug}`,
                value: category.id,
                label: category.name,
                content: (
                  <div className="flex flex-col">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      /{category.slug}
                    </span>
                  </div>
                ),
              })}
            />
            <InputField
              form={form}
              name="excerpt"
              type="textarea"
              rows={3}
              label="Excerpt"
              placeholder="Shown on cards and used as the meta description fallback."
            />
            <InputField
              form={form}
              name="content"
              type="textarea"
              rows={16}
              label="Body"
              className="md:col-span-2"
            />
          </FormSection>

          <FormSection
            title="Images"
            description="The cover runs inline under the title; the header image sits behind the title band."
          >
            <MediaField
              form={form}
              name="coverId"
              label="Cover image"
              defaultMedia={data?.cover ?? undefined}
            />
            <MediaField
              form={form}
              name="headerImageId"
              label="Header background"
              defaultMedia={data?.headerImage ?? undefined}
            />
          </FormSection>

          <FormSection
            title="Publishing"
            description="A future date keeps the post out of the public list until then."
          >
            <SelectField
              form={form}
              name="status"
              label="Status"
              options={STATUS_OPTIONS}
            />
            <DatePickerField
              form={form}
              name="publishedAt"
              label="Publish date"
              placeholder="Defaults to now on publish"
            />
          </FormSection>

          <FormSection
            title="Search"
            description="Leave blank to fall back to the title and excerpt."
          >
            <InputField form={form} name="metaTitle" label="Meta title" />
            <InputField
              form={form}
              name="metaDescription"
              type="textarea"
              rows={2}
              label="Meta description"
            />
          </FormSection>
        </>
      )}
    </GenericForm>
  );
};

export default PostForm;

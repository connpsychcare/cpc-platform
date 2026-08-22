"use client";

import type { BaseCUFormProps } from "@workspace/contracts";
import { categorySchema } from "@workspace/contracts/category";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { MediaField } from "@workspace/ui/media/mediaField";
import { GenericForm } from "@workspace/ui/shared/GenericForm";

import { useCategories, useCategory } from "@/hooks/content-cms";

const CategoryForm = ({ entityId, formType }: BaseCUFormProps) => {
  return (
    <GenericForm
      entityId={entityId}
      formType={formType}
      entityName="Category"
      description="Categories group posts and give the blog its URL structure."
      schema={categorySchema}
      useQuery={useCategory}
      defaultValues={{
        name: "",
        slug: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
      }}
    >
      {(form, data) => (
        <>
          <FormSection title="Details">
            <InputField form={form} required name="name" label="Name" />
            <InputField
              form={form}
              required
              name="slug"
              label="Slug"
              placeholder="anxiety"
            />
            <ComboboxField
              form={form}
              name="parentId"
              label="Parent category"
              placeholder="Top level"
              dataKey="categories"
              useQuery={useCategories}
              queryArgs={{ page: 1, limit: 100, sortBy: "name", sortOrder: "asc", searchBy: "name" }}
              // A category cannot parent itself.
              excludeIds={entityId ? [entityId] : undefined}
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
            <MediaField
              form={form}
              name="coverId"
              label="Cover image"
              defaultMedia={data?.cover ?? undefined}
            />
            <InputField
              form={form}
              name="description"
              type="textarea"
              rows={3}
              label="Description"
              className="md:col-span-2"
            />
          </FormSection>

          <FormSection
            title="Search"
            description="Leave blank to fall back to the name and description."
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

export default CategoryForm;

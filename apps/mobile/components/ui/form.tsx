import type { ReactNode } from "react";
import { View } from "react-native";
import type {
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldListeners,
  FieldValidateOrFn,
  FieldValidators,
  ReactFormExtendedApi,
} from "@tanstack/react-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AnyFormApi<TFormData> = ReactFormExtendedApi<
  TFormData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

type FieldValidatorsFor<
  TFormData,
  TName extends DeepKeys<TFormData>,
> = FieldValidators<
  TFormData,
  TName,
  DeepValue<TFormData, TName>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>
>;

export interface BaseFieldProps<
  TFormData,
  TName extends DeepKeys<TFormData> = DeepKeys<TFormData>,
> {
  name: TName & string;
  desc?: string;
  label?: React.ReactNode;
  placeholder?: string;
  className?: string;
  form: AnyFormApi<TFormData>;
  disabled?: boolean;
  validators?: FieldValidatorsFor<TFormData, TName>;
  listeners?: FieldListeners<TFormData, TName, DeepValue<TFormData, TName>>;
  handleChange?: (
    value: DeepValue<TFormData, TName>,
    commit: (value: DeepValue<TFormData, TName>) => void,
  ) => void | Promise<void>;
}

export interface FieldChildrenProps<TFormData> {
  name: DeepKeys<TFormData> & string;
  value: any;
  placeholder?: string;
  onBlur: () => void;
  onChange: (value: any) => void;
  isInvalid: boolean;
  disabled?: boolean;
}

export interface FormFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  children: (fieldProps: FieldChildrenProps<TFormData>) => ReactNode;
}

// ─── Form ────────────────────────────────────────────────────────────────────

interface FormProps<TFormData> {
  form: AnyFormApi<TFormData>;
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Form<TFormData>({
  form,
  children,
  className,
  header,
  footer,
}: FormProps<TFormData>) {
  return (
    <View className={cn("gap-6", className)}>
      {header}
      <FieldGroup>{children}</FieldGroup>
      {footer}
    </View>
  );
}

// ─── FormSection ─────────────────────────────────────────────────────────────

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  footer,
  columns = 1,
  className,
}: FormSectionProps) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent
        className={cn(
          "mt-4 gap-4",
          columns === 2 && "flex-row flex-wrap",
          className,
        )}
      >
        {children}
      </CardContent>
      {footer ? <View className="px-5 pt-4">{footer}</View> : null}
    </Card>
  );
}

// ─── FormField ───────────────────────────────────────────────────────────────

export function FormField<TFormData>({
  name,
  desc,
  label,
  placeholder,
  form,
  className,
  children,
  validators,
  disabled,
  listeners,
  handleChange,
}: FormFieldProps<TFormData> & { listeners?: any }) {
  if (!placeholder && typeof label === "string") placeholder = label;

  return (
    <form.Field name={name} validators={validators} listeners={listeners}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        const fieldProps: FieldChildrenProps<TFormData> = {
          name: field.name,
          placeholder,
          value: field.state.value,
          onBlur: field.handleBlur,
          onChange: async (value: any) => {
            const resolved =
              value?.nativeEvent !== undefined ? value.nativeEvent.text : value;

            if (handleChange) {
              await handleChange(resolved, field.handleChange);
              return;
            }

            field.handleChange(resolved);
          },
          isInvalid,
          disabled,
        };

        return (
          <Field className={className}>
            {label ? <FieldLabel>{label}</FieldLabel> : null}
            {children(fieldProps)}
            {desc ? <FieldDescription>{desc}</FieldDescription> : null}
            {isInvalid ? (
              <FieldError errors={[field.state.meta.errors[0]]} />
            ) : null}
          </Field>
        );
      }}
    </form.Field>
  );
}

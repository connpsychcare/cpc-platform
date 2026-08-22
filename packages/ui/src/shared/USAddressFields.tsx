"use client";

import { useMemo } from "react";
import { useStore } from "@tanstack/react-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { FormField } from "../components/form";
import { getUSStates, getCitiesForState } from "../lib/us-address";

const US_STATES = getUSStates();

interface USAddressFieldsProps<TFormData> {
  form: any;
  stateFieldName: string;
  cityFieldName: string;
  stateLabel?: string;
  cityLabel?: string;
}

export function USAddressFields<TFormData>({
  form,
  stateFieldName,
  cityFieldName,
  stateLabel = "State",
  cityLabel = "City",
}: USAddressFieldsProps<TFormData>) {
  const selectedState = useStore(
    form.store,
    (s: any) => s.values[stateFieldName],
  );

  const cityOptions = useMemo(
    () => (selectedState ? getCitiesForState(selectedState) : []),
    [selectedState],
  );

  return (
    <>
      <FormField form={form} name={stateFieldName as any} label={stateLabel}>
        {({ value, isInvalid }) => (
          <Select
            value={value ?? ""}
            onValueChange={(v) => {
              form.setFieldValue(stateFieldName, v);
              form.setFieldValue(cityFieldName, "");
            }}
          >
            <SelectTrigger aria-invalid={isInvalid} className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-64">
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>

      <FormField form={form} name={cityFieldName as any} label={cityLabel}>
        {({ value, isInvalid }) => (
          <Select
            value={value ?? ""}
            disabled={!selectedState}
            onValueChange={(v) => form.setFieldValue(cityFieldName, v)}
          >
            <SelectTrigger aria-invalid={isInvalid} className="w-full">
              <SelectValue
                placeholder={
                  selectedState ? "Select city" : "Select state first"
                }
              />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-64">
              {cityOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>
    </>
  );
}

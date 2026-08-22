import { State, City } from "country-state-city";

export const US_COUNTRY_VALUE = "United States";

export function getUSStates() {
  return State.getStatesOfCountry("US").map((s) => ({
    label: s.name,
    value: s.isoCode,
  }));
}

export function getCitiesForState(stateCode: string) {
  return City.getCitiesOfState("US", stateCode).map((c) => ({
    label: c.name,
    value: c.name,
  }));
}

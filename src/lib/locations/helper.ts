import { LOCATION_MAP } from "./zillas";

/** All zilla names sorted A → Z */
export function getZillas(): string[] {
  return Object.keys(LOCATION_MAP).sort();
}

/** Thanas for a given zilla, sorted A → Z. Returns [] if zilla unknown. */
export function getThanas(zilla: string): string[] {
  return (LOCATION_MAP[zilla] ?? []).slice().sort();
}

/** true if thana belongs to zilla — mirrors backend Joi validation */
export function isValidThana(zilla: string, thana: string): boolean {
  return LOCATION_MAP[zilla]?.includes(thana) ?? false;
}
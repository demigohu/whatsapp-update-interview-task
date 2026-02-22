const DEFAULT_COUNTRY_CODE = "62";

export function normalizePhone(input: string | null | undefined): string | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  if (!digitsOnly) {
    return null;
  }

  let normalizedDigits: string | null = null;

  if (digitsOnly.startsWith(DEFAULT_COUNTRY_CODE)) {
    normalizedDigits = `0${digitsOnly.slice(DEFAULT_COUNTRY_CODE.length)}`;
  } else if (digitsOnly.startsWith("0")) {
    normalizedDigits = digitsOnly;
  } else if (digitsOnly.startsWith("8")) {
    normalizedDigits = `0${digitsOnly}`;
  }

  if (!normalizedDigits) {
    return null;
  }

  if (normalizedDigits.length < 8 || normalizedDigits.length > 15) {
    return null;
  }

  return normalizedDigits;
}

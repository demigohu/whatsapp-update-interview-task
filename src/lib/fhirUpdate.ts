export type Identifier = {
  system?: string;
  value?: string;
};

export type Telecom = {
  system?: string;
  use?: string;
  value?: string;
};

export type PatientResource = {
  identifier?: Identifier[];
  telecom?: Telecom[];
};

const NIK_SYSTEM = "https://fhir.kemkes.go.id/id/nik";

export function getNik(patient: PatientResource): string | null {
  const identifiers = patient.identifier ?? [];
  const nikIdentifier = identifiers.find(
    (identifier) => identifier.system === NIK_SYSTEM && identifier.value
  );

  return nikIdentifier?.value ?? null;
}

export function upsertTelecomMobile(
  patient: PatientResource,
  normalizedPhone: string
): void {
  if (!patient.telecom) {
    patient.telecom = [];
  }

  const existing = patient.telecom.find(
    (telecom) => telecom.system === "phone" && telecom.use === "mobile"
  );

  if (existing) {
    existing.value = normalizedPhone;
    return;
  }

  patient.telecom.push({
    system: "phone",
    use: "mobile",
    value: normalizedPhone
  });
}

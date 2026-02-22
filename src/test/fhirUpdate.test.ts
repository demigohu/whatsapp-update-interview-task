import { describe, expect, it } from "vitest";
import { upsertTelecomMobile, PatientResource } from "../lib/fhirUpdate";

describe("upsertTelecomMobile", () => {
  it("adds telecom when missing", () => {
    const patient: PatientResource = {};
    upsertTelecomMobile(patient, "+628123456789");

    expect(patient.telecom).toEqual([
      { system: "phone", use: "mobile", value: "+628123456789" }
    ]);
  });

  it("updates existing mobile telecom", () => {
    const patient: PatientResource = {
      telecom: [{ system: "phone", use: "mobile", value: "+620000" }]
    };

    upsertTelecomMobile(patient, "+62811111111");

    expect(patient.telecom?.[0]).toEqual({
      system: "phone",
      use: "mobile",
      value: "+62811111111"
    });
  });

  it("preserves other telecom entries", () => {
    const patient: PatientResource = {
      telecom: [
        { system: "email", value: "patient@example.com" },
        { system: "phone", use: "mobile", value: "+6280000" }
      ]
    };

    upsertTelecomMobile(patient, "+62822222222");

    expect(patient.telecom).toHaveLength(2);
    expect(patient.telecom?.[0]).toEqual({
      system: "email",
      value: "patient@example.com"
    });
    expect(patient.telecom?.[1]).toEqual({
      system: "phone",
      use: "mobile",
      value: "+62822222222"
    });
  });
});

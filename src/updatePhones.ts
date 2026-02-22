import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { normalizePhone } from "./lib/normalizePhone";
import { getNik, upsertTelecomMobile, PatientResource } from "./lib/fhirUpdate";

type PatientEntry = {
  resource: PatientResource;
};

type PatientsPayload = {
  patients_before_phone_update: PatientEntry[];
  patients_after_phone_update?: PatientEntry[];
};

type CsvRow = {
  last_updated_date?: string;
  nik_identifier?: string;
  name?: string;
  phone_number?: string;
};

type Summary = {
  updated: number;
  skipped_invalid: number;
  skipped_not_found: number;
  total_rows: number;
};

const DEFAULT_CSV_PATH = path.join(
  "docs",
  "interview",
  "Whatsapp Data - Sheet.csv"
);
const DEFAULT_PATIENTS_PATH = path.join(
  "docs",
  "interview",
  "patients-data.json"
);
const DEFAULT_OUTPUT_PATH = path.join(
  "out",
  "patients-phone-updated.json"
);

function parseArgs(argv: string[]): Record<string, string> {
  const options: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      options[arg] = next;
      index += 1;
    } else {
      options[arg] = "true";
    }
  }

  return options;
}

async function readPatients(patientsPath: string): Promise<PatientsPayload> {
  const content = await readFile(patientsPath, "utf8");
  return JSON.parse(content) as PatientsPayload;
}

async function readCsv(csvPath: string): Promise<CsvRow[]> {
  const content = await readFile(csvPath, "utf8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvRow[];
}

function buildNikIndex(patients: PatientEntry[]): Map<string, PatientResource> {
  const index = new Map<string, PatientResource>();

  for (const entry of patients) {
    const nik = getNik(entry.resource);
    if (!nik) {
      continue;
    }

    if (!index.has(nik)) {
      index.set(nik, entry.resource);
    }
  }

  return index;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const csvPath = args["--csv"] ?? DEFAULT_CSV_PATH;
  const patientsPath = args["--patients"] ?? DEFAULT_PATIENTS_PATH;
  const outputPath = args["--out"] ?? DEFAULT_OUTPUT_PATH;

  const [patientsPayload, rows] = await Promise.all([
    readPatients(patientsPath),
    readCsv(csvPath)
  ]);

  const patients = patientsPayload.patients_before_phone_update ?? [];
  const nikIndex = buildNikIndex(patients);

  const summary: Summary = {
    updated: 0,
    skipped_invalid: 0,
    skipped_not_found: 0,
    total_rows: rows.length
  };

  for (const row of rows) {
    const nik = row.nik_identifier?.trim();
    if (!nik) {
      summary.skipped_invalid += 1;
      continue;
    }

    const normalized = normalizePhone(row.phone_number);
    if (!normalized) {
      summary.skipped_invalid += 1;
      continue;
    }

    const patient = nikIndex.get(nik);
    if (!patient) {
      summary.skipped_not_found += 1;
      continue;
    }

    upsertTelecomMobile(patient, normalized);
    summary.updated += 1;
  }

  const outputPayload = {
    patients_after_phone_update: patients
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(outputPayload, null, 2), "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

# Welcome to Sphere's Technical Test

Hi there, and thanks so much for taking the time to explore this challenge with us! We’re genuinely excited to learn more about how you think and build. Consider this repository your sandbox—feel free to take notes, experiment, and make it your own as you work through the exercise.

## How to Get Started
- Begin with `docs/interview-task.md`. It walks you through the two parts of the assignment and points you to every resource you’ll need.
- You’ll also find extra context, sample data, and expectations in `docs/interview/candidate-brief.md`.
- Sample inputs (`Whatsapp Data - Sheet.csv`) and patient payloads (`patients-data.json`) live under `docs/interview/` ready for you to use.

## A Few Friendly Notes
- We know interviews can feel intense—take your time, be curious, and call out assumptions when things aren’t clear.
- Clean, well-explained solutions are more valuable to us than rushed perfection.
- If something seems ambiguous, make a reasonable decision and document it. We love seeing how you reason.

## Part A — Phone Update Script (CLI)

### Requirements
- Node.js 18+ recommended.

### Install
```bash
npm install
```

### Build
```bash
npm run build
```

### Run
```bash
npm start -- --csv "docs/interview/Whatsapp Data - Sheet.csv" --patients "docs/interview/patients-data.json" --out "out/patients-phone-updated.json"
```

### Output
- Updated payload written to `out/patients-phone-updated.json`.
- Summary JSON is printed to stdout:
  ```json
  { "updated": 10, "skipped_invalid": 0, "skipped_not_found": 0, "total_rows": 10 }
  ```

### Compare output to expected
- The file `docs/interview/patients-data.json` includes `patients_after_phone_update` as a reference shape.
- You can diff the `patients_after_phone_update` arrays from the input file and the output file to validate structure.

### Assumptions & Data-Cleaning Rules
- CSV columns used: `nik_identifier`, `phone_number`, and `last_updated_date` (present in the source file).
- The offline CSV file in this repo is `docs/interview/Whatsapp Data - Sheet.csv` (not `Sheet1.csv`).
- Phone normalization rules:
  - Trim whitespace.
  - Remove punctuation, spaces, hyphens, and parentheses.
  - Accept inputs like `0812...`, `62...`, or `+62...`.
  - Normalize to a single local format: `0...` (e.g., `0812...`).
  - If the cleaned number is too short/long or does not match expected Indonesia prefixes, treat as invalid.
- If `nik_identifier` is missing or invalid, the row is skipped.
- If a patient with matching NIK is not found, the row is skipped and counted.
- Existing `telecom` entries are preserved; only `system=phone` + `use=mobile` is upserted.

### Edge Cases Handled
- Missing or malformed phone numbers.
- Missing NIK values.
- Existing `telecom` arrays with other contact methods.
- Multiple rows for the same NIK (last row in the CSV wins).

### Tests
```bash
npm test
```

## Part B — System Design Proposal
- See `docs/system-design.md` for diagrams and narrative.

## Optional Demo Workflow
- A sample GitHub Actions workflow is included at `.github/workflows/nightly-sync.yml`.
- This is for demonstration only and is not a production scheduler.

## Need Anything?
If questions pop up while you’re working, please reach out to your recruiter or interview coordinator. We’re here to help and want you to feel supported throughout the process.

Good luck, have fun, and we can’t wait to see what you come up with!

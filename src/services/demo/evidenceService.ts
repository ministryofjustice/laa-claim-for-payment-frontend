import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SearchResult } from "./searchResult.js";
import { AnalysisDoc } from "./analysisDoc.js";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// src/demo-data/search/<evidenceId>.json
const SEARCH_DATA_DIR = path.resolve(process.cwd(), "src/demo-data/search");
const ANALYSIS_DATA_DIR = path.resolve(process.cwd(), "src/demo-data/analysis");

export function getSearchResult(evidenceId: string): SearchResult {
  if (!evidenceId) {
    throw new Error("Missing evidenceId");
  }

  const filePath = path.join(SEARCH_DATA_DIR, `${evidenceId}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Search result not found for evidenceId ${evidenceId}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getAnalysisDoc(documentFileName: string): AnalysisDoc {
  if (!documentFileName) {
    throw new Error("Missing documentFileName");
  }

  const textractFileName = `${documentFileName}.textract.json`;
  const filePath = path.join(ANALYSIS_DATA_DIR, textractFileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Analysis doc not found for ${documentFileName}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getAllSearchResults(): SearchResult[] {
  const files = fs
    .readdirSync(SEARCH_DATA_DIR)
    .filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(SEARCH_DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as SearchResult;
  });
}
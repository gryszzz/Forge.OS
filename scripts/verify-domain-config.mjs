#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

function readTrimmed(filePath) {
  if (!existsSync(filePath)) return "";
  return readFileSync(filePath, "utf8").trim();
}

const publicDomain = readTrimmed("public/CNAME");
const rootDomain = readTrimmed("CNAME");

if (!publicDomain) {
  console.error("[verify:domain] Missing public/CNAME or empty value.");
  process.exit(1);
}

if (!/^[a-z0-9.-]+$/i.test(publicDomain)) {
  console.error(`[verify:domain] Invalid public/CNAME value: ${publicDomain}`);
  process.exit(1);
}

if (!rootDomain) {
  console.error("[verify:domain] Missing root CNAME. Keep root CNAME aligned with public/CNAME.");
  process.exit(1);
}

if (rootDomain.toLowerCase() !== publicDomain.toLowerCase()) {
  console.error(
    `[verify:domain] CNAME mismatch: root (${rootDomain}) != public/CNAME (${publicDomain}).`
  );
  process.exit(1);
}

console.log(`[verify:domain] OK - CNAME aligned at ${publicDomain}`);

import { execSync } from "child_process";
import path from "path";
import fs from "fs";

async function main() {
  try {
    console.log("Packaging Chromium binary for Vercel deployment...");

    // Find @sparticuz/chromium bin directory directly in node_modules
    const binDir = path.join(process.cwd(), "node_modules", "@sparticuz", "chromium", "bin");

    if (!fs.existsSync(binDir)) {
      console.log("Chromium bin directory not found, skipping packaging");
      process.exit(0);
    }

    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, "chromium-pack.tar");

    console.log(`Creating tar archive at ${outputPath}...`);
    execSync(`tar -cf "${outputPath}" -C "${binDir}" .`);

    console.log("Chromium binary packaged successfully!");
  } catch (error) {
    console.error("Error packaging Chromium:", error.message);
    // Don't fail the install
    process.exit(0);
  }
}

main();

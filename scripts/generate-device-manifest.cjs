#!/usr/bin/env node
/*
  Scans public/images and generates a manifest at public/images/manifest.json
  Structure:
  {
    brands: {
      [brand]: {
        logo: string | null,
        models: Array<{ name: string, image: string }>,
        series: { [seriesName]: Array<{ name: string, image: string }> }
      }
    }
  }
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const imagesDir = path.join(root, 'public', 'images');
const outFile = path.join(imagesDir, 'manifest.json');

function isImageFile(file) {
  return /\.(webp|png|jpg|jpeg)$/i.test(file);
}

function toTitleCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildManifest() {
  if (!fs.existsSync(imagesDir)) {
    console.error('images directory not found:', imagesDir);
    process.exit(1);
  }

  const brands = {};
  const brandDirs = fs.readdirSync(imagesDir, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const brandDirEnt of brandDirs) {
    const brandName = brandDirEnt.name;
    const brandPath = path.join(imagesDir, brandName);
    const result = { logo: null, models: [], series: {} };

    // Gather files directly under brand for logo and root-level models
    const brandEntries = fs.readdirSync(brandPath, { withFileTypes: true });
    for (const entry of brandEntries) {
      const entryPath = path.join(brandPath, entry.name);
      if (entry.isFile() && isImageFile(entry.name)) {
        const url = `/images/${brandName}/${entry.name}`;
        const base = path.parse(entry.name).name;
        if (!result.logo && base.toLowerCase() === brandName.toLowerCase()) {
          result.logo = url;
        } else {
          result.models.push({ name: toTitleCase(base), image: url });
        }
      }
    }

    // Series subfolders
    for (const entry of brandEntries) {
      if (entry.isDirectory()) {
        const seriesName = entry.name;
        const seriesPath = path.join(brandPath, seriesName);
        const seriesModels = [];
        const seriesEntries = fs.readdirSync(seriesPath, { withFileTypes: true });
        for (const sEntry of seriesEntries) {
          if (sEntry.isFile() && isImageFile(sEntry.name)) {
            const url = `/images/${brandName}/${seriesName}/${sEntry.name}`;
            const base = path.parse(sEntry.name).name;
            seriesModels.push({ name: toTitleCase(base), image: url });
          }
        }
        if (seriesModels.length > 0) {
          result.series[seriesName] = seriesModels;
        }
      }
    }

    brands[brandName] = result;
  }

  return { brands };
}

function main() {
  const manifest = buildManifest();
  fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
  console.log(`✔ Wrote manifest with ${Object.keys(manifest.brands).length} brands to`, outFile);
}

main();




/* eslint-disable global-require */
import { readdir } from 'fs';
import { promisify } from 'util';
const readDir = promisify(readdir);
import { join } from 'path';
import { models } from 'mongoose';

function toTitleCase (str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Load seeds of all models
export async function seedDatabase () {
  const dir = await readDir(__dirname);
  const seedFiles = dir.filter(f => f.endsWith('.seed.js'));

  for (const file of seedFiles) {
    const fileName = file.split('.seed.js')[0];
    const modelName = toTitleCase(fileName);
    const model = models[modelName];

    if (!model) throw new Error(`Cannot find Model '${modelName}'`);
    const fileContents = require(join(__dirname, file));

    await model.create(fileContents.default);
  }
}

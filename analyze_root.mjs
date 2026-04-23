import fs from 'fs';
const css = fs.readFileSync('main.css', 'utf-8');
const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
if (rootMatch) {
  console.log(rootMatch[1].trim());
}

import fs from 'fs';
const css = fs.readFileSync('main.css', 'utf-8');

const classesToFind = ['.hero-section', '.hero-text-container', '.button', '.primary-button', '.accent-button'];
classesToFind.forEach(cls => {
  const regex = new RegExp(`\\${cls}\\s*\\{[^}]+\\}`, 'g');
  const matches = css.match(regex);
  if (matches) {
    console.log(matches.join('\n'));
  }
});

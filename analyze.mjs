import fs from 'fs';
const css = fs.readFileSync('main.css', 'utf-8');
const colors = css.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/g);
if (colors) {
  const counts = {};
  colors.forEach(c => {
    const color = c.toLowerCase();
    counts[color] = (counts[color] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 20);
  console.log('Top colors:', sorted);
}

const fonts = css.match(/font-family:([^;]+)/gi);
if (fonts) {
    const fCounts = {};
    fonts.forEach(f => fCounts[f.toLowerCase()] = (fCounts[f.toLowerCase()] || 0) + 1);
    console.log('Fonts:', Object.entries(fCounts).sort((a,b) => b[1] - a[1]));
}

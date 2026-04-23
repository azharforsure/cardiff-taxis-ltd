import fs from 'fs';
const text = fs.readFileSync('site.html', 'utf-8');
const styles = text.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
if (styles) {
  styles.forEach(s => console.log(s.substring(0, 500)));
}
const links = text.match(/<link[^>]*rel="stylesheet"[^>]*>/gi);
if (links) console.log(links);

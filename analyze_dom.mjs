import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('site.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Grab the body class
console.log('Body class:', document.body.className);

// Grab the first few sections to see layout
const sections = document.querySelectorAll('section, header, .section, .hero, div[class*="hero"]');
for (let i = 0; i < Math.min(3, sections.length); i++) {
  console.log(`\n\n--- SECTION ${i} ---`);
  console.log('Class:', sections[i].className);
  // Get text content of headings
  const text = sections[i].textContent.replace(/\s+/g, ' ').substring(0, 500);
  console.log('Text preview:', text);
  
  // Look at internal classes
  const divs = Array.from(sections[i].querySelectorAll('div')).map(d => d.className).filter(c => c).slice(0, 15);
  console.log('Inner div classes:', divs);
}

import fs from 'fs';
fetch('https://cdn.prod.website-files.com/69173812d9ec8417630f5fe1/css/taxi2terminal.webflow.shared.c37cd276b.css')
  .then(res => res.text())
  .then(text => {
    fs.writeFileSync('main.css', text);
    console.log('Main CSS downloaded. Length:', text.length);
  })
  .catch(err => console.error(err));

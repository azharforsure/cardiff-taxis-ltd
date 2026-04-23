import fs from 'fs';
fetch('https://taxi2terminal.webflow.io/')
  .then(res => res.text())
  .then(text => {
    fs.writeFileSync('site.html', text);
    console.log('Site downloaded. Length:', text.length);
  })
  .catch(err => console.error(err));

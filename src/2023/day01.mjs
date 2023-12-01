const fs = require('fs').promises;

const data = await fs.readFile('example.txt', 'utf8');  
console.log(data);
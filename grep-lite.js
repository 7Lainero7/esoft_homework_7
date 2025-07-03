const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const options = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key === '--file') options.file = value;
  else if (key === '--search') options.search = value;
  else if (key === '--ignore-case') options.ignoreCase = true;
});

// Проверка обязательных аргументов
if (!options.file || !options.search) {
  console.error('Usage: node grep-lite.js --file=<path> --search=<string>');
  process.exit(1);
}

// Чтение файла
fs.readFile(path.resolve(options.file), 'utf-8', (err, data) => {
  if (err) {
    console.error('Error: File not found');
    process.exit(1);
  }

  const lines = data.split('\n');
  const searchStr = options.ignoreCase ? options.search.toLowerCase() : options.search;

  lines.forEach((line, index) => {
    const haystack = options.ignoreCase ? line.toLowerCase() : line;
    if (haystack.includes(searchStr)) {
      const highlighted = line.replace(
        new RegExp(options.search, options.ignoreCase ? 'gi' : 'g'),
        match => `\x1b[33m${match}\x1b[0m`
      );
      console.log(`[Line ${index + 1}]: ${highlighted}`);
    }
  });
});

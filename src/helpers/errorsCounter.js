const fs = require('fs');

function errorsCounter(logFilePath, callback) {
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      return;
    }

    const lines = data.split('\n');
    let systemErrorCount = 0;
    let fatalErrorCount = 0;
    let errorCount = 0;

    lines.forEach((line) => {
      if (line.includes(`"level":40`)) {
        systemErrorCount++;
      }
    });

    lines.forEach((line) => {
      if (line.includes(`"level":60`)) {
        fatalErrorCount++;
      }
    });

    lines.forEach((line) => {
      if (line.includes(`"level":50`)) {
        errorCount++;
      }
    });

    callback(null, fatalErrorCount, errorCount, systemErrorCount);
  });
}

module.exports = { errorsCounter };

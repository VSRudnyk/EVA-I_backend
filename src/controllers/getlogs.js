const { sendSmtpEmail, errorsCounter } = require('../helpers');
const pinoLogger = require('../../logger');

const fs = require('fs');

const pathToAttachment = 'app.log';

let attachment;
let fatalErrCount;
let systemErrCount;
let errCount;

function getErrorCounts() {
  return new Promise((resolve, reject) => {
    errorsCounter(
      pathToAttachment,
      (err, fatalErrorCount, errorCount, systemErrorCount) => {
        if (err) {
          return reject(err);
        }
        fatalErrorCount === 0
          ? (fatalErrCount = 'No Fatal errors in logs')
          : (fatalErrCount = fatalErrorCount);
        systemErrorCount === 0
          ? (systemErrCount = 'No System errors in logs')
          : (systemErrCount = systemErrorCount);
        errorCount === 0
          ? (errCount = 'No errors in logs')
          : (errCount = errorCount);

        resolve(); // Resolve the promise once the counts are available
      }
    );
  });
}

const getLogs = async (req, res) => {
  await getErrorCounts();

  const email = {
    to: 'v.rudnyk@gmail.com',
    subject: 'Logs',
    text: 'Results sent from log_test',
    html: `<p>Fatal: ${fatalErrCount}</p>
        <p>Error: ${errCount}</p>
        <p>Warn: ${systemErrCount}</p>`,
  };

  //   Read log file base 64
  if (pathToAttachment !== undefined) {
    attachment = fs.readFileSync(pathToAttachment, { encoding: 'utf8' });
    email.attachments = [
      {
        content: attachment,
        filename: 'app.log',
        type: 'text/html',
        disposition: 'attachment',
        content_id: 'app.log',
      },
    ];
  } else {
    email.attachments = undefined;
  }

  try {
    await sendSmtpEmail(email);
    fs.writeFile(pathToAttachment, '', (err) => {
      if (err) throw err;
      pinoLogger.info('app.log was cleaned');
    });
    res.json('Daily email sent!');
    return true;
  } catch (err) {
    pinoLogger.warn(err);
  }
};

const sendDailyEmail = () => {
  try {
    getLogs().then((res) => {
      pinoLogger.info('Daily email sent!');
    });
  } catch (err) {
    pinoLogger.error(err);
  }
};

module.exports = { getLogs, sendDailyEmail };

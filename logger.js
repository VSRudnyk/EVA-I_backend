const pino = require('pino');

const fileTransport = pino.transport({
  targets: [
    {
      target: 'pino/file',

      options: {
        destination: 'app.log',
        mkdir: true,
      },
    },
    {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'pid, hostname',
        levelFirst: true,
      },
    },
  ],
});

module.exports = pino(
  {
    level: 'info',
    timestamp: () => `,"timestamp":"${new Date().toLocaleString('uk-UA')}"`,
    redact: {
      paths: [
        'name',
        'email',
        'phone',
        'user.name',
        'user.email',
        'user.phone',
        '*.user.name',
        '*.user.email',
        '*.user.phone',
      ],
      censor: '[PERSONAL_DATA]',
      remove: true,
    },
  },
  fileTransport
);

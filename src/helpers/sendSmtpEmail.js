const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { BACK_URL, BACK_LOCAL_URL, SENDGRID_API_KEY, PROJECT_EMAIL } =
  process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendSmtpEmail = async (email, token, path) => {
  const ifCollaboratorPath = path === '/collaborator';

  const commonFieldsForPassword = {
    email,
    subject: `Request to ${
      ifCollaboratorPath ? 'create' : 'reset'
    } your EVA-I password`,
    text: 'Click on the link in this email to enter a new password',
    link: `${BACK_URL}/api/auth/verify-token/${token}`,
    textLink: `${ifCollaboratorPath ? 'Create' : 'Reset'} your password`,
    salutationText: `Hi, we’ve received a request to ${
      ifCollaboratorPath ? 'create' : 'reset'
    } your EVA-I password.`,
    actionText:
      'If you didn’t make the request, just ignore this message. Otherwise, please click on the link below to enter a new password:',
  };

  const choseEmailFild = {
    '/forgot-password': commonFieldsForPassword,
    '/reset-password': commonFieldsForPassword,
    '/collaborator': commonFieldsForPassword,
    '/verification': {
      email,
      subject: 'Confirm your email address',
      text: 'Click on the link in this email to confirm your email address',
      link: `${BACK_URL}/api/auth/verify/${token}`,
      textLink: 'Confirm email address',
      salutationText: 'Hi, thank you for creating an account!',
      actionText:
        'But before starting using EVA-I, please click on the link below to confirm your email address',
    },
  };

  const mail = {
    to: email,
    from: PROJECT_EMAIL,
    subject: choseEmailFild[path].subject,
    text: choseEmailFild[path].text,
    html: `
        <table style="border-spacing: 0px; border-collapse: collapse">
      <tbody>
        <tr>
          <td rowspan="2" style="width: 40px; height: 40px; padding: 0">
            <img
              src="https://res.cloudinary.com/docbv5qdf/image/upload/v1744009289/Logo_molwsk.svg"
              alt="EVA-I Logo"
              width="40"
              height="40"
            />
          </td>
          <td
            style="
              padding: 0 0 0 16px;
              width: 100%;
              color: #07061f;
              font-family: Montserrat, sans-serif;
              font-size: 20px;
              font-style: normal;
              font-weight: 700;
              line-height: 23.2px;
            "
          >
            EVA-I
          </td>
        </tr>
        <tr>
          <td
            colspan="2"
            style="
              padding: 0 0 0 16px;
              color: #07061f;
              font-family: Montserrat, sans-serif;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 23.2px;
            "
          >
            AI Assistant
          </td>
        </tr>
        <tr>
          <td colspan="2" style="height: 23.2px; padding: 0"></td>
        </tr>
        <tr>
          <td
            colspan="2"
            style="
              height: 23.2px;
              padding: 0;
              font-family: Montserrat, sans-serif;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
            "
          >
            ${choseEmailFild[path].salutationText}
            <p></p>
            ${choseEmailFild[path].actionText}
            <p></p>
            <a
              href="${choseEmailFild[path].link}"
              style="
                font-family: Montserrat, sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: 24px;
                text-decoration-line: underline;
                color: #07061f;
              "
              >${choseEmailFild[path].textLink}</a
            >
            <p></p>
            If you didn’t request this email, just ignore it.
            <p></p>
            Please note that the link will expire in 15 minutes.
            <p></p>
            Best regards
            <br />
            EVA-I Team
          </td>
        </tr>
      </tbody>
    </table>
    `,
  };

  try {
    await sgMail.send(mail);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendSmtpEmail };

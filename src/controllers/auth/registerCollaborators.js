const { createError } = require('../../helpers');
const { User } = require('../../models/users.model');
const { sendSmtpEmail } = require('../../helpers/sendSmtpEmail');
const { sign } = require('../../helpers/jwt');

const registerCollaborators = async (req, res) => {
  const { emails } = req.body;

  try {
    const existingUsers = await User.find({ email: { $in: emails } });
    const existingEmails = existingUsers.map((user) => user.email);

    const newEmails = emails.filter((email) => !existingEmails.includes(email));

    if (newEmails.length === 0) {
      throw createError(409, 'All specified emails are already registered');
    }

    // Создаем массив новых пользователей
    const newUsers = newEmails.map((email) => {
      const resetPasswordToken = sign(
        {
          userEmail: email,
          uniqueValue: Date.now(),
        },
        'access',
        '15m'
      );
      return {
        owner: req.user.id,
        email,
        authType: 'collaborator',
        role: 'User',
        verify: true,
        resetPasswordToken,
      };
    });

    // Вставляем новых пользователей в базу данных
    const createdUsers = await User.insertMany(newUsers);

    // Отправляем email каждому новому пользователю
    await Promise.all(
      createdUsers.map((user) =>
        sendSmtpEmail(user.email, user.resetPasswordToken, '/forgot-password')
      )
    );

    res.status(201).json({
      message: 'Users have been successfully registered',
      registeredEmails: newEmails,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = registerCollaborators;

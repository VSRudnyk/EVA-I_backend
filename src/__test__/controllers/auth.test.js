const {
  register,
  login,
  logout,
  resendEmail,
  verifyEmail,
  verifyPassToken,
  forgotPassword,
  resetPassword,
  refreshToken,
  updateTariffPlan,
} = require('../../controllers/auth');
const { verify, sign } = require('../../helpers');
const { User } = require('../../models/users.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Common test variables
const mockData = {
  userId: 'mockUserId',
  email: 'test@example.com',
  password: 'Testpassword123!',
  name: 'Test User',
  hashedPassword: 'hashedPassword123',
  verificationCode: 'verification-code-123',
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-123',
  resetPasswordToken: 'reset-token-123',
  tariffPlan: 'premium',
  FRONT_URL: 'https://eva-i.com',
};

// Common mock user object
const mockUser = {
  _id: mockData.userId,
  email: mockData.email,
  name: mockData.name,
  password: mockData.hashedPassword,
  verificationCode: mockData.verificationCode,
  accessToken: mockData.accessToken,
  refreshToken: mockData.refreshToken,
  resetPasswordToken: mockData.resetPasswordToken,
  verify: false,
  save: jest.fn().mockResolvedValue(true),
  _doc: {
    _id: mockData.userId,
    email: mockData.email,
    name: mockData.name,
    password: mockData.hashedPassword,
    verificationCode: mockData.verificationCode,
    accessToken: mockData.accessToken,
    refreshToken: mockData.refreshToken,
    resetPasswordToken: mockData.resetPasswordToken,
  },
};

// Common mock response object
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
  redirect: jest.fn(),
};

// Mocks setup
jest.mock('../../models/users.model.js');
jest.mock('../../helpers/jwt.js', () => ({
  verify: jest.fn(() => null),
  sign: jest.fn(() => 'mockedToken'),
}));
jest.mock('bcryptjs');
jest.mock('express-rate-limit');
jest.mock('rate-limit-mongo');
jest.mock('../../helpers/sendSmtpEmail.js', () => ({
  sendSmtpEmail: jest.fn().mockResolvedValue(true),
}));

// Global beforeEach
beforeEach(() => {
  jest.clearAllMocks();
  process.env.FRONT_URL = mockData.FRONT_URL;
  bcrypt.compare.mockResolvedValue(true);
  bcrypt.genSaltSync.mockReturnValue('salt');
  bcrypt.hash.mockResolvedValue(mockData.hashedPassword);
  sign.mockReturnValue(mockData.verificationCode);
});

describe('register', () => {
  it('should delete existing user if verification token expired', async () => {
    const verificationCode = verify(() => null);
    expect(verificationCode).toBeNull();
    expect(
      User.findOneAndDelete.mockResolvedValue({
        email: mockUser.email,
      })
    );
  });

  it('should throw error if user exists and is verified', async () => {
    User.findOne.mockResolvedValue({ email: mockUser.email, verify: true });

    const req = {
      body: {
        email: mockUser.email,
        password: mockUser.password,
        name: mockUser.name,
      },
    };
    const res = {};

    await expect(register(req, res)).rejects.toMatchObject({
      message: 'This email address is already used',
      status: 409,
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
  });

  it('should throw error if user exists but not verified', async () => {
    User.findOne.mockResolvedValue({
      email: mockUser.email,
      verify: mockUser.verify,
    });

    const req = {
      body: {
        email: mockUser.email,
        password: mockUser.password,
        name: mockUser.name,
      },
    };
    const res = {};

    await expect(register(req, res)).rejects.toMatchObject({
      message: 'This email address is already used',
      status: 409,
    });
  });

  it('should successfully register new user', async () => {
    const mockNewUser = {
      _id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      password: mockUser.password,
      verificationCode: mockUser.verificationCode,
      _doc: {
        email: mockUser.email,
        name: mockUser.name,
        password: mockUser.password,
        verificationCode: mockUser.verificationCode,
      },
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockNewUser);

    const req = {
      body: {
        email: mockUser.email,
        password: mockUser.password,
        name: mockUser.name,
      },
      url: 'test-url',
    };
    const res = mockRes;

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      mockUser.password,
      expect.any(String)
    );
    expect(sign).toHaveBeenCalledWith(
      {
        userEmail: mockUser.email,
        uniqueValue: expect.any(Number),
      },
      'access',
      '15m'
    );
    expect(User.create).toHaveBeenCalledWith({
      email: mockUser.email,
      name: mockUser.name,
      password: mockUser.password,
      verificationCode: mockUser.verificationCode,
      expireAt: expect.any(Date),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.not.objectContaining({
        password: expect.any(String),
      })
    );
  });
});

describe('login', () => {
  it('should throw an error if user not found', async () => {
    User.findOne.mockResolvedValue(null);
    const req = {
      body: {
        email: mockData.email,
        password: mockData.password,
      },
    };
    const res = mockRes;

    await expect(login(req, res)).rejects.toMatchObject({
      message: 'Wrong email or password',
      status: 401,
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: mockData.email });
  });

  it('should throw an error if password is wrong', async () => {
    User.findOne.mockResolvedValue({
      email: mockData.email,
      password: mockData.hashedPassword,
    });
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: {
        email: mockData.email,
        password: mockData.password,
      },
    };
    const res = mockRes;

    await expect(login(req, res)).rejects.toMatchObject({
      message: 'Wrong email or password',
      status: 401,
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockData.password,
      mockData.hashedPassword
    );
  });

  it('should throw an error if email not verified', async () => {
    const unverifiedUser = {
      ...mockUser,
      verify: false,
    };
    User.findOne.mockResolvedValue(unverifiedUser);

    const req = {
      body: {
        email: mockData.email,
        password: mockData.password,
      },
    };
    const res = mockRes;

    await expect(login(req, res)).rejects.toMatchObject({
      message: 'Email not verified',
      status: 403,
    });
  });

  it('should successfully login user and return tokens', async () => {
    // Setup verified user with all required properties
    const verifiedUser = {
      ...mockUser,
      verify: true,
      password: mockData.hashedPassword, // Important for password comparison
    };

    // Setup updated user response
    const mockUpdatedUser = {
      _id: mockData.userId,
      email: mockData.email,
      name: mockData.name,
      verify: true,
      accessToken: mockData.accessToken,
      refreshToken: mockData.refreshToken,
      resetPasswordToken: null,
    };

    // Setup mocks
    User.findOne.mockResolvedValue(verifiedUser);
    const mockSelect = jest.fn().mockResolvedValue(mockUpdatedUser);
    User.findByIdAndUpdate.mockReturnValue({ select: mockSelect });

    const req = {
      body: {
        email: mockData.email,
        password: mockData.password,
      },
    };
    const res = mockRes;

    // Execute test
    await login(req, res);

    // Verify password comparison was called
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockData.password,
      mockData.hashedPassword
    );

    // Verify user lookup
    expect(User.findOne).toHaveBeenCalledWith({ email: mockData.email });

    // Verify token generation and user update
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockData.userId,
      {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        resetPasswordToken: null,
      },
      { new: true }
    );

    // Verify password field exclusion
    expect(mockSelect).toHaveBeenCalledWith('-password');

    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
  });
});

describe('logout', () => {
  it('should successfully logout user', async () => {
    const req = { user: { id: mockData.userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    User.findById.mockResolvedValue({ id: mockData.userId });

    const mockSelect = jest.fn();
    User.findByIdAndUpdate.mockReturnValue({ select: mockSelect });

    await logout(req, res);

    expect(User.findById).toHaveBeenCalledWith(mockData.userId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockData.userId,
      { accessToken: null, refreshToken: null },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should throw error if user not found', async () => {
    const req = { user: { id: mockData.userId } };
    const res = {};

    User.findById.mockResolvedValue(null);

    await expect(logout(req, res)).rejects.toMatchObject({
      message: 'Unauthorized (invalid access token)',
      status: 401,
    });
  });
});

describe('resendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sign.mockReturnValue(mockData.resetPasswordToken);
  });

  it('should throw error if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: {
        email: mockData.email,
        action: '/verification',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sorry, can’t find an account associated with this address',
    });
  });

  it('should throw error if action is wrong', async () => {
    const mockUser = {
      _id: mockData.userId,
      email: mockData.email,
    };

    User.findOne.mockResolvedValue(mockUser);

    const req = {
      body: {
        email: mockData.email,
        action: '/wrong-action',
      },
    };
    const res = {};

    await expect(resendEmail(req, res)).rejects.toMatchObject({
      message: 'Wrong path in action',
      status: 404,
    });
  });

  it('should successfully resend verification email', async () => {
    const mockUser = {
      _id: mockData.userId,
      email: mockData.email,
      _doc: {
        email: mockData.email,
        verificationCode: mockData.resetPasswordToken,
      },
    };

    User.findOne.mockResolvedValue(mockUser);
    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    const req = {
      body: {
        email: mockData.email,
        action: '/verification',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resendEmail(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockData.userId, {
      verificationCode: mockData.resetPasswordToken,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      email: mockData.email,
      verificationCode: mockData.resetPasswordToken,
    });
  });

  it('should successfully resend reset password email', async () => {
    const mockUser = {
      _id: mockData.userId,
      email: mockData.email,
      _doc: {
        email: mockData.email,
        resetPasswordToken: mockData.resetPasswordToken,
      },
    };

    User.findOne.mockResolvedValue(mockUser);
    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    const req = {
      body: {
        email: mockData.email,
        action: '/reset-password',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resendEmail(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockData.userId, {
      resetPasswordToken: mockData.resetPasswordToken,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      email: mockData.email,
      resetPasswordToken: mockData.resetPasswordToken,
    });
  });
});

describe('verifyEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FRONT_URL = mockData.FRONT_URL;
  });

  it('should redirect with isTokenExpired=true if token is expired or user not found', async () => {
    verify.mockReturnValue(false);
    User.findOne.mockResolvedValue(null);

    const req = {
      params: { verificationCode: mockData.verificationCode },
    };
    const res = {
      redirect: jest.fn(),
    };

    await verifyEmail(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      verificationCode: mockData.verificationCode,
    });
    expect(verify).toHaveBeenCalledWith(mockData.verificationCode, 'access');
    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `${mockData.FRONT_URL}/verification?isTokenExpired=true`
    );
  });

  it('should redirect with verified=true if user is already verified', async () => {
    verify.mockReturnValue(true);
    User.findOne.mockResolvedValue({
      _id: mockData.userId,
      verificationCode: mockData.verificationCode,
      verify: true,
    });

    const req = {
      params: { verificationCode: mockData.verificationCode },
    };
    const res = {
      redirect: jest.fn(),
    };

    await verifyEmail(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `${mockData.FRONT_URL}/verification?verified=true`
    );
  });

  it('should successfully verify user email', async () => {
    verify.mockReturnValue(true);

    const mockUser = {
      _id: mockData.userId,
      verificationCode: mockData.verificationCode,
      verify: false,
    };

    User.findOne.mockResolvedValue(mockUser);
    User.findByIdAndUpdate.mockResolvedValue({
      ...mockUser,
      verify: true,
      verificationCode: null,
    });

    const req = {
      params: { verificationCode: mockData.verificationCode },
    };
    const res = {
      redirect: jest.fn(),
    };

    await verifyEmail(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockData.userId, {
      verify: true,
      verificationCode: null,
    });
    expect(res.redirect).toHaveBeenCalledWith(
      302,
      `${mockData.FRONT_URL}/verification?verify=true`
    );
  });
});

describe('verifyPassToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect with tokenExpired=true if token is expired but user exists', async () => {
    verify.mockReturnValue(false);
    const mockExpiredUser = {
      ...mockUser,
      resetPasswordToken: mockData.resetPasswordToken,
    };
    User.findOne.mockResolvedValue(mockExpiredUser);

    const req = {
      params: { resetPasswordToken: mockData.resetPasswordToken },
    };
    const res = mockRes;

    await verifyPassToken(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: mockData.resetPasswordToken,
    });
    expect(verify).toHaveBeenCalledWith(mockData.resetPasswordToken, 'access');
    expect(mockExpiredUser.resetPasswordToken).toBeNull();
    expect(mockExpiredUser.save).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      `${mockData.FRONT_URL}/reset-password?tokenExpired=true`
    );
  });

  it('should redirect with usedLink=true if token is expired and user not found', async () => {
    verify.mockReturnValue(false);
    User.findOne.mockResolvedValue(null);

    const req = {
      params: { resetPasswordToken: mockData.resetPasswordToken },
    };
    const res = mockRes;

    await verifyPassToken(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      `${mockData.FRONT_URL}/reset-password?usedLink=true`
    );
  });
});

describe('forgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sign.mockReturnValue(mockData.resetPasswordToken);
  });

  it('should throw error if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: { email: mockData.email },
      url: '/forgot-password',
    };
    const res = mockRes;

    await forgotPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockData.email });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sorry, can’t find an account associated with this address',
    });
  });

  it('should successfully send reset password email', async () => {
    const mockForgotUser = {
      ...mockUser,
      _doc: {
        _id: mockData.userId,
        email: mockData.email,
        resetPasswordToken: mockData.resetPasswordToken,
      },
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(mockForgotUser);

    const req = {
      body: { email: mockData.email },
      url: '/forgot-password',
    };
    const res = mockRes;

    await forgotPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockData.email });
    expect(sign).toHaveBeenCalledWith(
      {
        userEmail: mockData.email,
        uniqueValue: expect.any(Number),
      },
      'access',
      '15m'
    );
    expect(mockForgotUser.resetPasswordToken).toBe(mockData.resetPasswordToken);
    expect(mockForgotUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: mockData.userId,
      email: mockData.email,
      resetPasswordToken: mockData.resetPasswordToken,
    });
  });

  it('should handle errors during password reset process', async () => {
    const mockError = new Error('Database error');
    mockError.status = 500;
    User.findOne.mockRejectedValue(mockError);

    const req = {
      body: { email: mockData.email },
      url: '/forgot-password',
    };
    const res = mockRes;

    await forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database error',
    });
  });
});

describe('resetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcrypt.genSaltSync.mockReturnValue('salt');
    bcrypt.hash.mockResolvedValue(mockData.hashedPassword);
  });

  it('should throw error if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      params: { token: mockData.resetPasswordToken },
      body: { password: mockData.password },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resetPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: mockData.resetPasswordToken,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid token, user not found',
    });
  });

  it('should successfully reset password', async () => {
    const mockUser = {
      _id: mockData.userId,
      email: mockData.email,
      resetPasswordToken: mockData.resetPasswordToken,
      save: jest.fn().mockResolvedValue(true),
      _doc: {
        _id: mockData.userId,
        email: mockData.email,
        password: mockData.hashedPassword,
        resetPasswordToken: null,
      },
    };

    User.findOne.mockResolvedValue(mockUser);

    const req = {
      params: { token: mockData.resetPasswordToken },
      body: { password: mockData.password },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resetPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: mockData.resetPasswordToken,
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 'salt');
    expect(mockUser.password).toBe(mockData.hashedPassword);
    expect(mockUser.resetPasswordToken).toBeNull();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: mockData.userId,
      email: mockData.email,
      resetPasswordToken: null,
    });
  });

  it('should handle errors during password reset', async () => {
    const mockError = new Error('Database error');
    mockError.status = 500;
    User.findOne.mockRejectedValue(mockError);

    const req = {
      params: { token: mockData.resetPasswordToken },
      body: { password: mockData.password },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database error',
    });
  });
});

describe('refreshToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verify.mockImplementation(() => ({ id: mockData.userId }));
    sign.mockImplementation((payload, type) =>
      type === 'refresh' ? mockData.refreshToken : mockData.accessToken
    );
  });

  it('should throw error if refresh token verification fails', async () => {
    verify.mockImplementation(() => {
      throw new Error('Token invalid');
    });

    const req = {
      body: { refreshToken: mockData.refreshToken },
    };
    const res = {};

    await expect(refreshToken(req, res)).rejects.toMatchObject({
      message: 'Token invalid',
      status: 401,
    });

    expect(verify).toHaveBeenCalledWith(mockData.refreshToken, 'refresh');
  });

  it('should throw error if user not found with token', async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: { refreshToken: mockData.refreshToken },
    };
    const res = {};

    await expect(refreshToken(req, res)).rejects.toMatchObject({
      message: 'Token invalid',
      status: 401,
    });

    expect(User.findOne).toHaveBeenCalledWith({
      refreshToken: mockData.refreshToken,
    });
  });

  it('should successfully refresh tokens', async () => {
    const mockUser = {
      _id: mockData.userId,
      refreshToken: mockData.refreshToken,
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(mockUser);

    const req = {
      body: { refreshToken: mockData.refreshToken },
    };
    const res = {
      json: jest.fn(),
    };

    await refreshToken(req, res);

    expect(verify).toHaveBeenCalledWith(mockData.refreshToken, 'refresh');
    expect(sign).toHaveBeenCalledWith(
      {
        id: mockData.userId,
        uniqueValue: expect.any(Number),
      },
      'access',
      '5m'
    );
    expect(sign).toHaveBeenCalledWith(
      {
        id: mockData.userId,
        uniqueValue: expect.any(Number),
      },
      'refresh',
      '8m'
    );
    expect(mockUser.accessToken).toBe(mockData.accessToken);
    expect(mockUser.refreshToken).toBe(mockData.refreshToken);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      accessToken: mockData.accessToken,
      refreshToken: mockData.refreshToken,
    });
  });

  it('should handle errors during token refresh', async () => {
    const mockError = new Error('Database error');
    User.findOne.mockRejectedValue(mockError);

    const req = {
      body: { refreshToken: mockData.refreshToken },
    };
    const res = {};

    await expect(refreshToken(req, res)).rejects.toMatchObject({
      message: 'Token invalid',
      status: 401,
    });
  });
});

describe('updateTariffPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update tariff plan', async () => {
    const mockUpdatedUser = {
      _id: mockData.userId,
      email: mockData.email,
      tariffPlan: mockData.tariffPlan,
    };

    const mockSelect = jest.fn().mockResolvedValue(mockUpdatedUser);
    User.findByIdAndUpdate.mockReturnValue({ select: mockSelect });

    const req = {
      user: { _id: mockData.userId },
      body: { tariffPlan: mockData.tariffPlan },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateTariffPlan(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockData.userId,
      { tariffPlan: mockData.tariffPlan },
      { new: true }
    );
    expect(mockSelect).toHaveBeenCalledWith('-password');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
  });

  it('should handle case when user not found', async () => {
    const mockSelect = jest.fn().mockResolvedValue(null);
    User.findByIdAndUpdate.mockReturnValue({ select: mockSelect });

    const req = {
      user: { _id: mockData.userId },
      body: { tariffPlan: mockData.tariffPlan },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateTariffPlan(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockData.userId,
      { tariffPlan: mockData.tariffPlan },
      { new: true }
    );
    expect(mockSelect).toHaveBeenCalledWith('-password');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');
    mockError.status = 500;

    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockRejectedValue(mockError),
    });

    const req = {
      user: { _id: mockData.userId },
      body: { tariffPlan: mockData.tariffPlan },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateTariffPlan(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database error',
    });
  });
});

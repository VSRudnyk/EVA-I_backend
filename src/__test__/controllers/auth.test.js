const register = require('../../controllers/auth/register');
const { verify } = require('../../helpers');
const { User } = require('../../models/users.model');
const bcrypt = require('bcryptjs');

jest.mock('../../models/users.model.js');
jest.mock('../../helpers/jwt.js', () => ({
  verify: jest.fn(() => null),
}));
jest.mock('bcryptjs');

describe('register', () => {
  it('should throw an error if the user already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' });
    const req = { body: { email: 'test@example.com', password: '123456' } };
    const res = {};

    await expect(register(req, res)).rejects.toMatchObject({
      message: 'This email address is already used',
      status: 409,
    });
  });
  it('should delete the user if the token is expired', async () => {
    const isTokenExpired = verify(() => null);
    expect(isTokenExpired).toBeNull();
    expect(
      User.findOneAndDelete.mockResolvedValue({
        email: 'test@example.com',
      })
    );
  });
  const password = 'mySecretPassword';
  const salt = 'mockedSalt';
  const hashedPassword = 'mockedHashedPassword';

  beforeEach(() => {
    bcrypt.genSaltSync.mockReturnValue(salt);
    bcrypt.hash.mockResolvedValue(hashedPassword);
  });
  it('should get status 200 when user was created', async () => {
    const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(hashPassword).toBe(hashedPassword);
  });
});

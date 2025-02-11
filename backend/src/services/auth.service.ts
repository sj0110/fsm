import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';
import { UserModel } from '../models/user.model';
import config from '../config';
import { BlacklistedTokenModel } from '../models/blacklistedToken.model';

export class AuthService {
  static async login(email: string, password: string): Promise<string> {
    const user = await UserModel.findOne({ email });
    if (!user || !user.active) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return token;
  }

  static async logout(token: string): Promise<void> {
    try {
      // Decode token to get expiration
      const decoded = jwt.decode(token) as { exp: number };
      if (!decoded?.exp) {
        throw new Error('Invalid token');
      }

      // Store in blacklist
      await BlacklistedTokenModel.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
      });
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await BlacklistedTokenModel.findOne({ token });
    return !!blacklistedToken;
  }
}


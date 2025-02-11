import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const token = await AuthService.login(email, password);
            res.json({ token });
        } catch (error) {
            const err = error as Error;
            res.status(401).json({ message: err.message });
        }
    }

    static async logout(req: AuthRequest, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(400).json({ message: 'No token provided' });
                return;
            }

            await AuthService.logout(token);
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ message: err.message });
        }
    }
}

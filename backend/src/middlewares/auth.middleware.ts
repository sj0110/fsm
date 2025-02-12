import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  config from '../config/index';
import { User } from '../types/index';
import { AuthService } from '../services/auth.service';

export interface AuthRequest extends Request {
    user?: User;
}

// export const dummyMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
//     console.log('dummy middleware');
//     next()
// }

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // console.log(req.headers.authorization?.split(' ')[1])
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        // Check if token is blacklisted
        const isBlacklisted = await AuthService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(401).json({ message: 'Token has been invalidated' });
        }
        const decoded = jwt.verify(token, config.jwtSecret) as User;
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};


export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        // console.log(req.user)
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        next();
    };

};

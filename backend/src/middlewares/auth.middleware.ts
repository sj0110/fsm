import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  config from '../config/index';
import { User } from '../types/index';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';

export interface AuthRequest extends Request {
    user?: User;
}

// export const dummyMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
//     console.log('dummy middleware');
//     next()
// }

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        // Check if token is blacklisted
        const isBlacklisted = await AuthService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(401).json({ message: 'Token has been invalidated' });
            return;
        }

        // Decode token to extract user ID
        const decoded = jwt.verify(token, config.jwtSecret) as { _id: string };

        // Fetch user details from the database
        const user = await UserModel.findById(decoded._id).select('-password');
        if (!user || !user.active) {
            res.status(401).json({ message: 'User not found or inactive' });
            return;
        }

        // Attach the fresh user details to the request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
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

import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';
import User from '../models/user';
import { UnauthorizedError } from '../utils/appError';

// Extend Request type to support custom `user` field
interface AuthenticatedRequest extends Request {
    user?: Document;
}

interface DecodedToken extends JwtPayload {
    id: string;
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
    
        if (!token) {
            throw new UnauthorizedError('Please Login to continue');
        }
    
        let decodedToken: DecodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'super_secrer_key') as DecodedToken;
        } catch (err) {
            throw new UnauthorizedError('Please Login to continue');
        }
    
        const user = await User.findById(decodedToken.id);

        if (!user) {
            throw new UnauthorizedError('Please Login to continue');
        }
    
        req.user = user;
        next();
    } catch (error: any) {
        console.error('Authentication error:', error);
        next(error);
    }
};
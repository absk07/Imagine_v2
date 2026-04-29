import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/appError';

interface AuthenticatedRequest extends Request {
    user?: Document;
}

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password } = req.body;
    // console.log(req.body)

    if (!email || !password || !username) {
        throw new BadRequestError('Reuired fields are missing');
    }

    try {
        const userExists = await User.findOne({ email });

        // console.log('User exists:', userExists);

        if (userExists) {
            throw new BadRequestError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'super_secrer_key');

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { username },
            token
        });
    } catch (err: any) {
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Reuired fields are missing');
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // console.log('User data:', user);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'super_secrer_key');
        
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: { username: user.username },
            token
        });
    } catch (err: any) {
        console.error('Error logging in user:', err);
        next(err);
    }
};

export const unknownCredit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Please Login to continue');
        }

        const { id } = req.user;

        const user = await User.findById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            success: true,
            user: { username: user?.username },
            uc: user?.unknownCredit,
        });
    } catch (err: any) {
        console.error('Error in unknownCredit:', err);
        next(err);
    }
};
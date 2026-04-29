import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';
import FormData from 'form-data';
import { apiData } from '../utils/clipdrop';
import User from '../models/user';
import History from '../models/history';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/appError';

interface AuthenticatedRequest extends Request {
    user?: Document;
}

export const generateImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            throw new BadRequestError('Prompt is required');
        }

        if (!req.user) {
            throw new UnauthorizedError('Login to continue');
        }

        const { id } = req.user;

        const user = await User.findById(id);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user?.unknownCredit === 0) {
            throw new ForbiddenError('Insufficient UC');
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        const response = await apiData(formData);

        const newHistory = await History.create({
            name: prompt,
            url: response
        });

        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, 
            { 
                $inc: { unknownCredit: -1 },
                $push: { history: newHistory.id }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Image generated successfully',
            imageUrl: response,
            uc: updatedUser?.unknownCredit
        });
    } catch (err: any) {
        console.error('Error generating image:', err);
        next(err);
    }
}
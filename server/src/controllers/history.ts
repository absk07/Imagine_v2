import { Express, Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import User from '../models/user';
import History from '../models/history';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/appError';

interface AuthenticatedRequest extends Request {
    user?: Document;
}

export const getAllHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Login to continue');
        }

        const { id } = req.user;

        const user = await User.findById(id).populate('history');
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            success: true,
            data: user.history
        });

    } catch (err: any) {
        console.log(err);
        next(err);
    }
}

export const getHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Login to continue');
        }

        const { id } = req.user;
        const { id: historyId } = req.params; 

        const user = await User.findById(id).populate({
            path: 'history',
            match: { _id: historyId }
        });

        if (!user || user.history.length === 0) {
            throw new NotFoundError('History not found or unauthorized access');
        }

        res.status(200).json({
            success: true,
            data: user.history[0]
        });
    } catch (err: any) {
        console.error(err);
        next(err);
    }
}

// export const createHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         if (!req.user) {
//             throw new UnauthorizedError('Login to continue');
//         }

//         const { id } = req.user;

//         const user = await User.findById(id);
//         if (!user) {
//             throw new NotFoundError('User not found');
//         }

//         const { historyName, imgUrl } = req.body;

//         if (!historyName || !imgUrl) {
//             throw new BadRequestError('Invalid data provided');
//         }

//         const newHistory = await History.create({
//             name: historyName,
//             url: imgUrl
//         });

//         user.history.push(newHistory.id);
//         await user.save();

//         res.status(201).json({
//             success: true,
//             data: newHistory
//         });
//     } catch (err: any) {
//         console.error(err);
//         next(err);
//     }
// }

export const editHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Login to continue');
        }

        const { id } = req.user;
        const { id: historyId } = req.params;
        const { historyName } = req.body;

        if (!historyName) {
            throw new BadRequestError('Invalid data provided');
        }

        const user = await User.findById(id);
        if (!user || !user.history.some((item) => item.equals(historyId))) {
            throw new NotFoundError('History not found or unauthorized access');
        }

        const updatedHistory = await History.findByIdAndUpdate(historyId, { name: historyName }, {
            new: true,
            runValidators: true
        });

        if (!updatedHistory) {
            throw new NotFoundError(`History not found`);
        }

        res.status(200).json({
            success: true,
            message: 'History name updated',
            data: updatedHistory
        });
    } catch (err: any) {
        console.error(err);
        next(err);
    }
}

export const deleteHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Login to continue');
        }

        const { id } = req.user;
        const { id: historyId } = req.params;

        const user = await User.findById(id);
        if (!user || !user.history.some((item) => item.equals(historyId))) {
            throw new NotFoundError('History not found or unauthorized access');
        }

        user.history = user.history.filter(id => id.toString() !== historyId);
        await user.save();

        await History.findByIdAndDelete(historyId);

        res.status(200).json({
            success: true,
            message: 'History has been deleted'
        });
    } catch (err: any) {
        console.error(err);
        next(err);
    }
}
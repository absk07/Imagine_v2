import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default function initLogger(logger: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
        return apiLogs(req, res, next, logger);
    };
}

function apiLogs(req: Request, res: Response, next: NextFunction, logger: any): void {
    // Attach request time and unique ID to the request object
    (req as any).requestTime = new Date();
    (req as any).uuid = uuidv4();

    logger.infoIn?.(req);

    const originalSend = res.send.bind(res);

    res.send = function (body: any): any {
        (res as any).responseTime = new Date();

        logger.infoOut?.(res);

        return originalSend(body);
    };

    next();
}
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

const LOG_STREAM = 'F';

const timezoned = (): string => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
    });
};

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

const transport = {
    console: new winston.transports.Console(),
    file: new DailyRotateFile({
        filename: 'info-%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        maxSize: '100m',
        format: format.combine(format.timestamp({ format: timezoned }), format.prettyPrint()),
        dirname: 'logs'
    })
};

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
        winston.format.json(),
        winston.format.printf(log => {
            return `${JSON.stringify(log)}\r\n`;
        })
    ),
    transports: [
        transport.console
    ]
});

if (LOG_STREAM.toLowerCase() === 'cf') {
    logger.add(transport.file);
} else if (LOG_STREAM.toLowerCase() === 'f') {
    logger.add(transport.file);
    logger.remove(transport.console);
}

const sanitizeBody = (body: { [key: string]: any }): { [key: string]: any } => {
    if (!body || typeof body !== 'object') return body;

    const sanitizedBody = { ...body };
    if ('password' in sanitizedBody) {
        sanitizedBody.password = '******';
    }
    return sanitizedBody;
};

interface RequestLike {
    method: string;
    path: string;
    query: { [key: string]: any };
    body: { [key: string]: any };
    uuid: string;
}

const infoIn = (req: RequestLike): void => {
    logger.log({
        level: 'info',
        message: `Incoming Request - ${req.method} ${req.path}`,
        method: req.method,
        path: req.path,
        query: req.query,
        body: sanitizeBody(req.body),
        reqId: req.uuid
    });
};

interface ResponseLike {
    req: RequestLike & { requestTime: Date };
    responseTime: Date;
}

const infoOut = (res: ResponseLike): void => {
    const resTimeinSec = (res.responseTime.getTime() - res.req.requestTime.getTime()) / 1000;

    logger.log({
        level: 'info',
        message: `Response Sent - ${res.req.method} ${res.req.path}`,
        method: res.req.method,
        path: res.req.path,
        reqId: res.req.uuid,
        responseTime: resTimeinSec
    });
};

export default {
    infoIn,
    infoOut
};
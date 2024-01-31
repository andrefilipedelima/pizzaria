import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    
    // receber o token
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try {
        // validar este token
        const { sub } = verify(token, process.env.JWT_SECRET) as Payload;

        // injetar o id no request para o next (criado ./src/@types/index.d.ts e adicionado no tsconfig.json)
        req.user_id = sub;

        return next();

    } catch(err) {
        return res.status(401).end();
    }


}
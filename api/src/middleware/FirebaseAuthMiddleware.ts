/// <reference path="../../express.d.ts" />

import {Request, Response, NextFunction} from "express";
import {initializeApp} from "firebase-admin/app";
import {auth, credential} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/lib/auth";

export class FirebaseAuthMiddleware {
    public constructor(pathToKeyFile: string) {
        initializeApp({
            credential: credential.cert(pathToKeyFile),
        });
    }

    public async authorize(request: Request, response: Response, next: NextFunction): Promise<void> {
        request.currentUser = await FirebaseAuthMiddleware.verifyToken(
            response,
            request.headers.authorization?.split("Bearer ")[1]
        );
        if (request.currentUser) {
            next();
        }
    }

    public static async verifyToken(response?: Response, idToken?: string): Promise<DecodedIdToken|undefined> {
        if (!idToken) {
            this.sendUnauthorized(response);
            return undefined;
        }

        try {
            return await auth().verifyIdToken(idToken);
        } catch {
            this.sendUnauthorized(response);
            return undefined;
        }
    }

    private static sendUnauthorized(response?: Response) {
        response?.status(401).send("Unauthorized");
    }
}
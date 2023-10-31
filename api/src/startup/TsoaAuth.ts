import {Request} from "express";
import { FirebaseAuthMiddleware } from "../middleware/FirebaseAuthMiddleware";
import {DecodedIdToken} from "firebase-admin/lib/auth";

export async function expressAuthentication(request: Request, _securityName: string, _scopes?: string[])
    : Promise<DecodedIdToken | undefined> {
    return FirebaseAuthMiddleware.verifyToken(request.res, request.headers.authorization?.split("Bearer ")[1]);
}

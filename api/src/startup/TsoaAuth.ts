import {Request} from "express";
import { FirebaseAuthMiddleware } from "../middleware/FirebaseAuthMiddleware";
import {IPrincipal} from "./auth/IPrincipal";
import { container } from "tsyringe";

export async function expressAuthentication(request: Request, _securityName: string, _scopes?: string[])
    : Promise<IPrincipal | undefined> {
    const authMiddleware = container.resolve<FirebaseAuthMiddleware>("FirebaseAuthMiddleware");
    return authMiddleware.verifyToken(request.res, request.headers.authorization?.split("Bearer ")[1]);
}

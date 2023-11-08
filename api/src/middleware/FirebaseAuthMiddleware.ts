/// <reference path="../../express.d.ts" />

import {Response} from "express";
import {initializeApp} from "firebase-admin/app";
import {auth, credential} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/lib/auth";
import {IPrincipal} from "../startup/auth/IPrincipal";
import {IUserRepository} from "../infra/IUserRepository";

export class FirebaseAuthMiddleware {
    public constructor(pathToKeyFile: string, private userRepository: IUserRepository) {
        initializeApp({
            credential: credential.cert(pathToKeyFile),
        });
    }

    public async verifyToken(response?: Response, idToken?: string): Promise<IPrincipal | undefined> {
        if (!idToken) {
            this.sendUnauthorized(response);
            return undefined;
        }

        try {
            const decodedToken: DecodedIdToken = await auth().verifyIdToken(idToken);
            const principal = this.toPrincipal(decodedToken);
            if (principal && !await this.userRepository.getBySubId(principal?.subId)) {
                await this.userRepository.create({
                    subId: principal.subId,
                    name: principal.name,
                    email: principal.email || ""
                });
            }
            return principal;
        } catch {
            this.sendUnauthorized(response);
            return undefined;
        }
    }

    private toPrincipal(decodedToken?: DecodedIdToken): IPrincipal | undefined {
        console.log(`toPrincipal: decoded token: ${JSON.stringify(decodedToken || {})}`);
        if (!decodedToken) {
            return undefined;
        }
        return {
            subId: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name || "No name"
        }
    }

    private sendUnauthorized(response?: Response) {
        response?.status(401).send("Unauthorized");
    }
}
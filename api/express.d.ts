import { DecodedIdToken } from "firebase-admin/auth";

declare module "express" {
    interface Request {
        currentUser?: DecodedIdToken;
    }
}

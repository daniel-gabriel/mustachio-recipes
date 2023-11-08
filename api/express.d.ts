import { IPrincipal } from "./src/startup/auth/IPrincipal";

declare module "express" {
    interface Request {
        currentUser?: IPrincipal;
    }
}

import { Document, model } from "mongoose";
import {IAuditDates} from "./IAuditDates";
import DbHelper from "./DbHelper";

export interface IUserModel extends IAuditDates {
    subId: string;
    name: string;
    email: string;
}

export interface IUserDoc extends IUserModel, Document {}

const userSchema = DbHelper.MakeSchema<IUserModel>({
    subId: String,
    name: String,
    email: String
});

export const UserModel =  model<IUserDoc>("User", userSchema);
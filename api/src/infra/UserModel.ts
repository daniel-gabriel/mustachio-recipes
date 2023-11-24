import { Document, model } from "mongoose";
import {IAuditDatesModel} from "./IAuditDatesModel";
import DbHelper from "./DbHelper";

export interface IUserModel extends IAuditDatesModel {
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
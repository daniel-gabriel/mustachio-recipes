import { Document, model } from "mongoose";
import {IAuditDates} from "./IAuditDates";
import DbHelper from "./DbHelper";

export interface IGroupModel extends IAuditDates {
    owner: string;
    name: string;
    members: IMemberModel[];
}

export interface IMemberModel extends IAuditDates {
    subId: string;
}

export interface IGroupDoc extends IGroupModel, Document {}

const memberSchema = DbHelper.MakeSchema<IMemberModel>({
    subId: String
});

const groupSchema = DbHelper.MakeSchema<IGroupModel>({
    owner: String,
    name: String,
    members: [memberSchema]
});

export const GroupModel =  model<IGroupDoc>("Group", groupSchema);
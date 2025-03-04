import { Document, model } from "mongoose";
import {IAuditDatesModel} from "./IAuditDatesModel";
import DbHelper from "./DbHelper";

export interface IGroupModel extends IAuditDatesModel {
    owner: string;
    name: string;
    members: IMemberModel[];
}

export interface IMemberModel extends IAuditDatesModel {
    subId?: string;
    invitedSubId?: string;
    randomCode?: string;
}

export interface IGroupDoc extends IGroupModel, Document {}

const memberSchema = DbHelper.MakeSchema<IMemberModel>({
    subId: String,
    invitedSubId: String,
    randomCode: String
});

const groupSchema = DbHelper.MakeSchema<IGroupModel>({
    owner: String,
    name: String,
    members: [memberSchema]
});

export const GroupModel =  model<IGroupDoc>("Group", groupSchema);
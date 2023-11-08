import {IPagedList} from "./IPagedList";
import {IMember} from "./IMember";

export interface IGroup {
    owner: string,
    groupName: string,
    members: IPagedList<IMember>
}
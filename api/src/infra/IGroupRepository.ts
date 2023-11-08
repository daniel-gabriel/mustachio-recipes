import {IGroup} from "./IGroup";
import {IMember} from "./IMember";

export interface IGroupRepository {
    getGroupWithPagedMembers(
        ownerId: string, groupName: string, memberPageIndex: number, memberPageSize: number
    ): Promise<IGroup | undefined>;
    isMember(ownerId: string, groupName: string, memberSubId: string): Promise<boolean>;
    getMember(ownerId: string, groupName: string, memberSubId: string): Promise<IMember | undefined>;
    addMember(ownerId: string, groupName: string, memberSubId: string): Promise<void>;
    deleteMember(ownerId: string, groupName: string, memberSubId: string): Promise<boolean>;
}
import {IPagedList} from "./IPagedList";
import {GroupModel, IMemberModel} from "./GroupModel";
import {IGroup} from "./IGroup";
import {IMember} from "./IMember";
import {IGroupRepository} from "./IGroupRepository";

export class MongoGroupRepository implements IGroupRepository {
    public async getGroupWithPagedMembers(
        ownerId: string, groupName: string, memberPageIndex: number = 0, memberPageSize: number = 10
    ): Promise<IGroup | undefined> {
        if (memberPageIndex < 0) {
            throw new Error("Page index must be 0 or greater");
        }
        if (memberPageSize > 100 || memberPageSize < 1) {
            throw new Error("Page size must be between 1 and 100");
        }

        // Calculate the number of documents to skip
        const skipCount = memberPageIndex * memberPageSize;

        // Execute the query with skip and limit
        const pipeline = [
            {$match: {owner: ownerId, name: groupName}},
            {
                $facet: {
                    members: [
                        {$unwind: "$members"},
                        {$skip: skipCount},
                        {$limit: memberPageSize},
                        {
                            $project: {
                                subId: 1,
                                createdOn: 1,
                                updatedOn: 1,
                                _id: 0
                            }
                        }
                    ],
                    totalCount: [{$count: "count"}]
                }
            }
        ];
        const results = await GroupModel.aggregate(pipeline).exec();

        if (!results?.length || !results[0].members === undefined) {
            return undefined;
        }
        const result = results[0];

        return {
            owner: ownerId,
            groupName: groupName,
            members: {
                pageIndex: memberPageIndex,
                pageSize: memberPageSize,
                totalItems: result.totalCount,
                totalPages: Math.ceil(result.totalCount / memberPageSize),
                data: result.members.map((m: IMemberModel) => ({
                    user: m.subId,
                    createdOn: m.createdOn,
                    lastUpdatedOn: m.lastUpdatedOn
                }))
            } as IPagedList<IMember>
        } as IGroup;
    }

    public async isMember(ownerId: string, groupName: string, memberSubId: string): Promise<boolean> {
        const pipeline = [
            {$match: {owner: ownerId, name: groupName}},
            {$unwind: "$members"},
            {$match: {"members.subId": memberSubId}},
            {$limit: 1},
            {$count: "exists"}
        ];
        const results = await GroupModel.aggregate(pipeline).exec();
        return !!results?.length && (results[0]?.exists > 0);
    }

    public async getMember(ownerId: string, groupName: string, memberSubId: string): Promise<IMember | undefined> {
        const pipeline = [
            {$match: {owner: ownerId, name: groupName}},
            {$match: {"members.subId": memberSubId}},
            {$limit: 1},
        ];
        const results = await GroupModel.aggregate(pipeline).exec();

        const foundGroup = results?.[0];

        const foundMember = foundGroup?.members?.[0];
        if (!foundMember) {
            return undefined;
        }
        return {
            subId: foundMember.subId,
            createdOn: foundMember.createdOn,
            lastUpdatedOn: foundMember.lastUpdatedOn
        };
    }

    public async inviteMember(ownerId: string, groupName: string, memberSubId: string, randomCode: string) {
        await GroupModel.findOneAndUpdate({
            owner: ownerId,
            name: groupName
        }, {
            $setOnInsert: {owner: ownerId, name: groupName},
            $addToSet: {
                members: {
                    invitedSubId: memberSubId,
                    randomCode: randomCode
                }
            } // Use $addToSet to avoid adding duplicates
        }, {
            new: true,
            upsert: true
        }).exec();
    }

    public async addMember(ownerId: string, groupName: string, memberSubId: string, randomCode: string) {
        if (!(await GroupModel.findOne({
            owner: ownerId,
            name: groupName,
            members: {
                $elemMatch: {
                    invitedSubId: memberSubId,
                    randomCode: randomCode
                }
            }
        }))) {
            throw new Error("You must first be invited to this user's group");
        }
        await GroupModel.findOneAndUpdate({
            owner: ownerId,
            name: groupName
        }, {
            $setOnInsert: {owner: ownerId, name: groupName},
            $addToSet: {members: {subId: memberSubId}} // Use $addToSet to avoid adding duplicates
        }, {
            new: true,
            upsert: true
        }).exec();
        await GroupModel.findOneAndUpdate({
            owner: ownerId,
            name: groupName,
        }, {
            $pull: {
                members: {
                    invitedSubId: memberSubId,
                    randomCode: randomCode
                }
            }
        }, {
            new: true,
            upsert: true
        }).exec();
    }

    public async deleteMember(ownerId: string, groupName: string, memberSubId: string): Promise<boolean> {
        const count = await this.getMemberCount(ownerId, groupName);
        await GroupModel.updateOne(
            {owner: ownerId, name: groupName},
            {
                $pull: {
                    members: {
                        subId: memberSubId
                    }
                }
            }
        );
        return count !== await this.getMemberCount(ownerId, groupName);
    }

    private async getMemberCount(ownerId: string, groupName: string): Promise<number> {
        const result = await GroupModel.aggregate([
            { $match: { owner: ownerId, name: groupName } },
            { $project: { numberOfMembers: { $size: "$members" } } }
        ]).exec();

        return result[0] ? result[0].numberOfMembers : 0;
    }
}
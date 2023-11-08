import { GroupModel } from "../../src/infra/GroupModel";
import { MongoGroupRepository } from "../../src/infra/MongoGroupRepository";
import {MongoTestHelper} from "../_utils/MongoTestHelper";

const mongoTestHelper = new MongoTestHelper();

describe("MongoGroupRepository", () => {
    const ownerId = "ownerId";
    const groupName = "default";
    const memberSubId = "memberSubId";
    let repo: MongoGroupRepository;

    beforeAll(async () => {
        await mongoTestHelper.startInMemoryMongo();
        repo = new MongoGroupRepository();
    });

    afterAll(async () => {
        await mongoTestHelper.stopInMemoryMongo();
    });

    beforeEach(async () => {
        await GroupModel.deleteMany({});
    });

    it("getGroupWithPagedMembers_withNonExistentGroup_returnsUndefined", async () => {
        const group = await repo.getGroupWithPagedMembers(ownerId, groupName);
        expect(group).toBeUndefined();
    });

    it("getGroupWithPagedMembers_withValidArgs_returnsPagedMembers", async () => {
        // Create a group with members
        const newGroup = new GroupModel({
            name: groupName,
            owner: ownerId,
            members: [{ subId: memberSubId }],
        });
        await newGroup.save();

        // Retrieve paged members
        const group = await repo.getGroupWithPagedMembers(ownerId, groupName, 0, 10);
        expect(group).toBeDefined();
        expect(group!.members.data.length).toBeGreaterThanOrEqual(1);
    });

    it("isMember_withValidGroupMember_returnsTrue", async () => {
        // Create a group with members
        const newGroup = new GroupModel({
            name: groupName,
            owner: ownerId,
            members: [{ subId: memberSubId }],
        });
        await newGroup.save();

        // Check membership
        const isMember = await repo.isMember(ownerId, groupName, memberSubId);
        expect(isMember).toBeTruthy();
    });

    it("addMember_withValidData_addsMemberToGroup", async () => {
        // Create a group
        const newGroup = new GroupModel({
            name: groupName,
            owner: ownerId,
            members: [],
        });
        await newGroup.save();

        // Add a new member
        await repo.addMember(ownerId, groupName, memberSubId);

        // Verify the member was added
        const group = await GroupModel.findOne({ owner: ownerId, name: groupName });
        const memberAdded = group!.members.some(m => m.subId === memberSubId);
        expect(memberAdded).toBeTruthy();
    });

    it("deleteMember_withMatchingSubId_removesMemberAndReturnsTrue", async () => {
        // Create a group with members
        const newGroup = new GroupModel({
            name: groupName,
            owner: ownerId,
            members: [{ subId: memberSubId }],
        });
        await newGroup.save();

        // Remove a member
        const success = await repo.deleteMember(ownerId, groupName, memberSubId);
        expect(success).toBeTruthy();

        // Verify the member was removed
        const updatedGroup = await GroupModel.findOne({ owner: ownerId, name: groupName });
        const memberExists = updatedGroup!.members.some(m => m.subId === memberSubId);
        expect(memberExists).toBeFalsy();
    });

    it("deleteMember_withNonMatchingSubId_doesNotRemoveAndReturnsFalse", async () => {
        // Create a group with members
        const newGroup = new GroupModel({
            name: groupName,
            owner: ownerId,
            members: [{ subId: memberSubId }],
        });
        await newGroup.save();

        // Remove a member
        const success = await repo.deleteMember(ownerId, groupName, "some id");
        expect(success).toBeFalsy();

        // Verify the member was removed
        const updatedGroup = await GroupModel.findOne({ owner: ownerId, name: groupName });
        const memberExists = updatedGroup!.members.some(m => m.subId === memberSubId);
        expect(memberExists).toBeTruthy();
    });
});

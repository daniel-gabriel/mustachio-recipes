import { MongoGroupRepository } from "../../src/infra/MongoGroupRepository";
import { GroupModel } from "../../src/infra/GroupModel";
import { MongoTestHelper } from "../_utils/MongoTestHelper";
import {v4 as newGuid} from "uuid";

const mongoTestHelper = new MongoTestHelper();

describe("MongoGroupRepository", () => {
    let repo: MongoGroupRepository;
    let mockOwnerId = "mockOwnerId";
    let mockGroupName = "mockGroupName";
    let mockMemberSubId = "mockMemberSubId";
    let mockRandomCode = "randomCode";

    beforeAll(async () => {
        await mongoTestHelper.startInMemoryMongo();
        repo = new MongoGroupRepository();
    });

    beforeEach(() => {
        mockOwnerId = `mockOwnerId-${newGuid()}`;
        mockGroupName = `mockGroupName-${newGuid()}`;
        mockMemberSubId = `mockMemberSubId-${newGuid()}`;
        mockRandomCode = `randomCode-${newGuid()}`;
    });

    afterAll(async () => {
        await mongoTestHelper.stopInMemoryMongo();
    });

    it("getGroupWithPagedMembers_withValidParameters_returnsPagedGroup", async () => {
        // arrange
        await new GroupModel({ owner: mockOwnerId, name: mockGroupName, members: [] }).save();

        // act
        const group = await repo.getGroupWithPagedMembers(mockOwnerId, mockGroupName);

        // assert
        expect(group).toBeDefined();
        expect(group?.members.pageIndex).toBe(0);
        expect(group?.members.pageSize).toBe(10);
    });

    it("isMember_withMemberInGroup_returnsTrue", async () => {
        // arrange
        await new GroupModel({ owner: mockOwnerId, name: mockGroupName, members: [{ subId: mockMemberSubId }] }).save();

        // act
        const isMember = await repo.isMember(mockOwnerId, mockGroupName, mockMemberSubId);

        // assert
        expect(isMember).toBe(true);
    });

    it("getMember_withExistingMember_returnsMember", async () => {
        // arrange
        await new GroupModel({ owner: mockOwnerId, name: mockGroupName, members: [{ subId: mockMemberSubId }] }).save();

        // act
        const member = await repo.getMember(mockOwnerId, mockGroupName, mockMemberSubId);

        const group = await repo.getGroupWithPagedMembers(mockOwnerId, mockGroupName);
        console.log(`${JSON.stringify(group?.members)}`);

        // assert
        expect(member).toBeDefined();
        expect(member?.subId).toBe(mockMemberSubId);
    });

    it("inviteMember_withValidData_invitesMember", async () => {
        // arrange
        await new GroupModel({ owner: mockOwnerId, name: mockGroupName, members: [] }).save();

        // act
        await repo.inviteMember(mockOwnerId, mockGroupName, mockMemberSubId, mockRandomCode);
        const group = await GroupModel.findOne({ owner: mockOwnerId, name: mockGroupName });

        // assert
        expect(group?.members.some(member => member.invitedSubId === mockMemberSubId)).toBe(true);
    });

    it("addMember_withValidInvitation_addsMember", async () => {
        // arrange
        await new GroupModel({ owner: mockOwnerId, name: mockGroupName, members: [{ invitedSubId: mockMemberSubId, randomCode: mockRandomCode }] }).save();

        // act
        await repo.addMember(mockOwnerId, mockGroupName, mockMemberSubId, mockRandomCode);
        const group = await GroupModel.findOne({ owner: mockOwnerId, name: mockGroupName });

        // assert
        expect(group?.members.some(member => member.subId === mockMemberSubId)).toBe(true);
    });

    it("deleteMember_withExistingMember_deletesMember", async () => {
        // arrange
        await new GroupModel({ owner: mockOwnerId, name: mockGroupName, members: [{ subId: mockMemberSubId }] }).save();

        // act
        const result = await repo.deleteMember(mockOwnerId, mockGroupName, mockMemberSubId);
        const group = await GroupModel.findOne({ owner: mockOwnerId, name: mockGroupName });

        // assert
        expect(result).toBe(true);
        expect(group?.members.some(member => member.subId === mockMemberSubId)).toBe(false);
    });
});

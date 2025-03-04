import { Controller, Route, Tags, Post, Get, Path, Delete, Query } from "tsoa";
import { IGroupRepository } from "../infra/IGroupRepository";
import { IGroup } from "../infra/IGroup";
import { IMember } from "../infra/IMember";
import {inject, injectable} from "tsyringe";
import {NumberUtils} from "../utils/NumberUtils";
import {IUserRepository} from "../infra/IUserRepository";

@injectable()
@Route("groups")
@Tags("Group")
export class GroupController extends Controller {

    constructor(
        @inject("IGroupRepository") private groupRepository: IGroupRepository,
        @inject("IUserRepository") private userRepository: IUserRepository
    ) {
        super();
    }

    /**
     * Retrieves a group with paged members.
     *
     * @param ownerId The ID of the owner of the group.
     * @param groupName The name of the group.
     * @param memberPageIndex The index of the member page to retrieve.
     * @param memberPageSize The size of the member page to retrieve.
     * @returns A group with its members paged or undefined if not found.
     */
    @Get("{ownerId}/{groupName}")
    public async getGroupWithPagedMembers(
        @Path() ownerId: string,
        @Path() groupName: string,
        @Query() memberPageIndex: number,
        @Query() memberPageSize: number
    ): Promise<IGroup | undefined> {
        return this.groupRepository.getGroupWithPagedMembers(ownerId, groupName, memberPageIndex, memberPageSize);
    }

    /**
     * Retrieves a specific member of a group.
     *
     * @param ownerId The ID of the owner of the group.
     * @param groupName The name of the group.
     * @param memberSubId The ID of the member to retrieve.
     * @returns The requested member or undefined if not found.
     */
    @Get("{ownerId}/{groupName}/{memberSubId}")
    public async getMember(
        @Path() ownerId: string,
        @Path() groupName: string,
        @Path() memberSubId: string
    ): Promise<IMember | undefined> {
        return this.groupRepository.getMember(ownerId, groupName, memberSubId);
    }

    /**
     * Invite a new member to a group.
     *
     * @param ownerId The ID of the owner of the group.
     * @param groupName The name of the group.
     * @param memberSubId The ID of the member to add.
     */
    @Post("invites/{ownerId}/{groupName}/{memberSubId}")
    public async inviteMember(
        @Path() ownerId: string,
        @Path() groupName: string,
        @Path() memberSubId: string
    ): Promise<void> {
        const randomCode = NumberUtils.generateRandom4DigitCode();
        const invitedUser = await this.userRepository.getBySubId(memberSubId);
        //TODO: send email containing the random code
        console.log(`Sending invitation to: ${invitedUser?.email}, using code: ${randomCode}`);
        return this.groupRepository.inviteMember(ownerId, groupName, memberSubId, randomCode);
    }

    /**
     * Adds a new member to a group.
     *
     * @param ownerId The ID of the owner of the group.
     * @param groupName The name of the group.
     * @param memberSubId The ID of the member to add.
     * @param randomCode The random verification code to ensure this user is allowed to be added.
     */
    @Post("{ownerId}/{groupName}/{memberSubId}")
    public async addMember(
        @Path() ownerId: string,
        @Path() groupName: string,
        @Path() memberSubId: string,
        @Query() randomCode: string
    ): Promise<void> {
        return this.groupRepository.addMember(ownerId, groupName, memberSubId, randomCode);
    }

    /**
     * Deletes a member from a group.
     *
     * @param ownerId The ID of the owner of the group.
     * @param groupName The name of the group.
     * @param memberSubId The ID of the member to delete.
     * @returns True if deletion was successful, false otherwise.
     */
    @Delete("{ownerId}/{groupName}/{memberSubId}")
    public async deleteMember(
        @Path() ownerId: string,
        @Path() groupName: string,
        @Path() memberSubId: string
    ): Promise<boolean> {
        return this.groupRepository.deleteMember(ownerId, groupName, memberSubId);
    }
}

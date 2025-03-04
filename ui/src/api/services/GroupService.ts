/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IGroup } from '../models/IGroup';
import type { IMember } from '../models/IMember';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GroupService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Retrieves a group with paged members.
     * @returns IGroup A group with its members paged or undefined if not found.
     * @throws ApiError
     */
    public getGroupWithPagedMembers({
ownerId,
groupName,
memberPageIndex,
memberPageSize,
}: {
/**
 * The ID of the owner of the group.
 */
ownerId: string,
/**
 * The name of the group.
 */
groupName: string,
/**
 * The index of the member page to retrieve.
 */
memberPageIndex: number,
/**
 * The size of the member page to retrieve.
 */
memberPageSize: number,
}): CancelablePromise<IGroup> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/groups/{ownerId}/{groupName}',
            path: {
                'ownerId': ownerId,
                'groupName': groupName,
            },
            query: {
                'memberPageIndex': memberPageIndex,
                'memberPageSize': memberPageSize,
            },
        });
    }

    /**
     * Retrieves a specific member of a group.
     * @returns IMember The requested member or undefined if not found.
     * @throws ApiError
     */
    public getMember({
ownerId,
groupName,
memberSubId,
}: {
/**
 * The ID of the owner of the group.
 */
ownerId: string,
/**
 * The name of the group.
 */
groupName: string,
/**
 * The ID of the member to retrieve.
 */
memberSubId: string,
}): CancelablePromise<IMember> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/groups/{ownerId}/{groupName}/{memberSubId}',
            path: {
                'ownerId': ownerId,
                'groupName': groupName,
                'memberSubId': memberSubId,
            },
        });
    }

    /**
     * Adds a new member to a group.
     * @returns void 
     * @throws ApiError
     */
    public addMember({
ownerId,
groupName,
memberSubId,
randomCode,
}: {
/**
 * The ID of the owner of the group.
 */
ownerId: string,
/**
 * The name of the group.
 */
groupName: string,
/**
 * The ID of the member to add.
 */
memberSubId: string,
/**
 * The random verification code to ensure this user is allowed to be added.
 */
randomCode: string,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/groups/{ownerId}/{groupName}/{memberSubId}',
            path: {
                'ownerId': ownerId,
                'groupName': groupName,
                'memberSubId': memberSubId,
            },
            query: {
                'randomCode': randomCode,
            },
        });
    }

    /**
     * Deletes a member from a group.
     * @returns boolean True if deletion was successful, false otherwise.
     * @throws ApiError
     */
    public deleteMember({
ownerId,
groupName,
memberSubId,
}: {
/**
 * The ID of the owner of the group.
 */
ownerId: string,
/**
 * The name of the group.
 */
groupName: string,
/**
 * The ID of the member to delete.
 */
memberSubId: string,
}): CancelablePromise<boolean> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/groups/{ownerId}/{groupName}/{memberSubId}',
            path: {
                'ownerId': ownerId,
                'groupName': groupName,
                'memberSubId': memberSubId,
            },
        });
    }

    /**
     * Invite a new member to a group.
     * @returns void 
     * @throws ApiError
     */
    public inviteMember({
ownerId,
groupName,
memberSubId,
}: {
/**
 * The ID of the owner of the group.
 */
ownerId: string,
/**
 * The name of the group.
 */
groupName: string,
/**
 * The ID of the member to add.
 */
memberSubId: string,
}): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/groups/invites/{ownerId}/{groupName}/{memberSubId}',
            path: {
                'ownerId': ownerId,
                'groupName': groupName,
                'memberSubId': memberSubId,
            },
        });
    }

}

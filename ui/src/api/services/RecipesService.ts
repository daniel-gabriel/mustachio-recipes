/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IPagedList_IRecipe_ } from '../models/IPagedList_IRecipe_';
import type { IRecipe } from '../models/IRecipe';
import type { ITextParseRequest } from '../models/ITextParseRequest';
import type { IUpdateRecipe } from '../models/IUpdateRecipe';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RecipesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns IPagedList_IRecipe_ Ok
     * @throws ApiError
     */
    public getRecipes({
pageIndex,
pageSize = 10,
}: {
pageIndex?: number,
pageSize?: number,
}): CancelablePromise<IPagedList_IRecipe_> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/recipes',
            query: {
                'pageIndex': pageIndex,
                'pageSize': pageSize,
            },
        });
    }

    /**
     * @returns IRecipe Ok
     * @throws ApiError
     */
    public createRecipe({
requestBody,
}: {
requestBody: IUpdateRecipe,
}): CancelablePromise<IRecipe> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/recipes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public getRecipe({
id,
}: {
id: string,
}): CancelablePromise<IRecipe | null> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/recipes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public updateRecipe({
id,
requestBody,
}: {
id: string,
requestBody: IUpdateRecipe,
}): CancelablePromise<IRecipe | null> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/recipes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns boolean Ok
     * @throws ApiError
     */
    public deleteRecipe({
id,
}: {
id: string,
}): CancelablePromise<boolean> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/recipes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns IRecipe Ok
     * @throws ApiError
     */
    public parseText({
requestBody,
}: {
requestBody: ITextParseRequest,
}): CancelablePromise<IRecipe> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/recipes/parse-text',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns string Ok
     * @throws ApiError
     */
    public parseImage({
formData,
}: {
formData: {
image: Blob;
},
}): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/recipes/parse-image',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}

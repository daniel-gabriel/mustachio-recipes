/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IPagedList_IRecipe_ } from '../models/IPagedList_IRecipe_';
import type { IRecipe } from '../models/IRecipe';
import type { IRecipeStats } from '../models/IRecipeStats';
import type { ITextParseRequest } from '../models/ITextParseRequest';
import type { IUpdateRecipe } from '../models/IUpdateRecipe';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RecipesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Searches and returns recipes that belong to the logged-in user, as well as their friends - users listed in the
 * logged-in user's "default" group, sorted by created date in descending order.
     * @returns IPagedList_IRecipe_ Ok
     * @throws ApiError
     */
    public getRecipes({
pageIndex,
pageSize = 10,
}: {
/**
 * The 0-based index of the page to return. Default is 0.
 */
pageIndex?: number,
/**
 * The size of the page. Default is 10.
 */
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
     * Creates a new recipe with the logged-in user set as the owner. If any of the recipe's parameters are not valid,
 * a 400 Bad Request is returned, with the error information in the format of Problem-Json
 * (https://datatracker.ietf.org/doc/html/rfc7807).
     * @returns IRecipe Ok
     * @throws ApiError
     */
    public createRecipe({
requestBody,
}: {
/**
 * The recipe to create.
 */
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
     * Returns the logged-in user's statistics - how many recipes belong to the user and how many belong to the user's
 * friends.
     * @returns IRecipeStats Ok
     * @throws ApiError
     */
    public getStats(): CancelablePromise<IRecipeStats> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/recipes/stats',
        });
    }

    /**
     * Returns the recipe specified by the `id`. If the recipe doesn't belong to the logged-in user or their friends,
 * a 404 Not Found is returned to not expose the fact of the existence of the requested recipe.
     * @returns any Ok
     * @throws ApiError
     */
    public getRecipe({
id,
}: {
/**
 * The id of the recipe to retrieve.
 */
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
     * Updates an existing recipe specified by the `id`. If any of the recipe's parameters are not valid,
 * a 400 Bad Request is returned, with the error information in the format of Problem-Json
 * (https://datatracker.ietf.org/doc/html/rfc7807). If the recipe doesn't belong to the logged-in user, a 403 Forbidden
 * is returned.
     * @returns any Ok
     * @throws ApiError
     */
    public updateRecipe({
id,
requestBody,
}: {
/**
 * The id of the recipe to update.
 */
id: string,
/**
 * The updated recipe.
 */
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
     * Deletes an existing recipe specified by the `id`. If the recipe doesn't belong to the logged-in user, a 403 Forbidden
 * is returned.
     * @returns boolean Ok
     * @throws ApiError
     */
    public deleteRecipe({
id,
}: {
/**
 * The id of the recipe to update.
 */
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
     * Parses the specified recipe text using artificial intelligence, and returns as much information as could be
 * extracted from the text.
     * @returns IRecipe Ok
     * @throws ApiError
     */
    public parseText({
requestBody,
}: {
/**
 * The text parameters to parse.
 */
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
     * Parses the specified recipe image using OCR and artificial intelligence, and returns as much information as could be
 * extracted from the text.
     * @returns string Ok
     * @throws ApiError
     */
    public parseImage({
formData,
}: {
formData: {
/**
 * The parameters of the image containing text to parse.
 */
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

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IRecipe } from './IRecipe';

/**
 * A generic paged list. The items in the data array are expected to be of type `TItem`.
 */
export type IPagedList_IRecipe_ = {
    /**
     * The array containing one page of data.
     */
    data: Array<IRecipe>;
    /**
     * The index of the returned page, 0-based.
     */
    pageIndex: number;
    /**
     * The page size.
     */
    pageSize: number;
    /**
     * The total number of items across all pages.
     */
    totalItems: number;
    /**
     * The total number of pages.
     */
    totalPages: number;
};

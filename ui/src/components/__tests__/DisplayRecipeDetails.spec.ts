import {describe, it, expect} from "vitest";

import {mount} from "@vue/test-utils";
import DisplayRecipeDetails from "../DisplayRecipeDetails.vue";
import {type IMediaUrl, type IRecipe, type IStep, LocalesEnum, UnitsEnum} from "../../api";
import {createPinia} from "pinia";

describe("DisplayRecipeDetails", () => {
    const pinia = createPinia();

    it("renders properly", () => {
        const wrapper = mount(DisplayRecipeDetails, {
            props: {
                recipe: {
                    locale: LocalesEnum.EN_US,
                    name: "",
                    description: "",
                    ingredients: [{
                        item: "Salt",
                        quantity: 1,
                        unit: UnitsEnum.LB
                    }],
                    steps: [] as IStep[],
                    mediaUrls: [] as IMediaUrl[],
                    createdOn: "",
                    lastUpdatedOn: "",
                    createdBy: "",
                    id: ""
                } as IRecipe
            },
            global: {
                plugins: [pinia],
                stubs: {
                    "o-button": true,
                    "o-field": true,
                    "o-switch": true
                }
            }
        });
        expect(wrapper.text()).toContain("Salt 1 Pounds (lb)");
    });
});

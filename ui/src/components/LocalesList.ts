import {LocalesEnum} from "@/api";

export interface ILocale {
    label: ILocaleLabel;
    value: LocalesEnum;
}

export interface ILocaleLabel {
    [LocalesEnum.EN_US]: string;
    [LocalesEnum.RU_RU]: string;
}

const defaultLocalesList: ILocale[] = [
    {label: {[LocalesEnum.EN_US]: "English", [LocalesEnum.RU_RU]: "Английский"}, value: LocalesEnum.EN_US},
    {label: {[LocalesEnum.EN_US]: "Russian", [LocalesEnum.RU_RU]: "Русский"}, value: LocalesEnum.RU_RU}
];

export const localesList = defaultLocalesList;
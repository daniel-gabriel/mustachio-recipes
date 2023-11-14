import {LocalesEnum, UnitsEnum} from "@/api";

export interface IUnit {
    label: IUnitLabel;
    value: UnitsEnum;
}

export interface IUnitLabel {
    [LocalesEnum.EN_US]: string;
    [LocalesEnum.RU_RU]: string;
}

const defaultUnitsList: IUnit[] = [
    {label: {[LocalesEnum.EN_US]: "tsp (Teaspoons)", [LocalesEnum.RU_RU]: "ч.л. (Чайные ложки)"}, value: UnitsEnum.TSP},
    {label: {[LocalesEnum.EN_US]: "tbsp (Tablespoons)", [LocalesEnum.RU_RU]: "ст.л. (Столовые ложки)"}, value: UnitsEnum.TBSP},
    {label: {[LocalesEnum.EN_US]: "fl oz (Fluid Ounces)", [LocalesEnum.RU_RU]: "жид. унц. (Жидкие унции)"}, value: UnitsEnum.FL_OZ},
    {label: {[LocalesEnum.EN_US]: "c (Cups)", [LocalesEnum.RU_RU]: "ч (Чашки)"}, value: UnitsEnum.C},
    {label: {[LocalesEnum.EN_US]: "pt (Pints)", [LocalesEnum.RU_RU]: "пт (Пинты)"}, value: UnitsEnum.PT},
    {label: {[LocalesEnum.EN_US]: "qt (Quarts)", [LocalesEnum.RU_RU]: "квт (Кварты)"}, value: UnitsEnum.QT},
    {label: {[LocalesEnum.EN_US]: "gal (Gallons)", [LocalesEnum.RU_RU]: "гал (Галлоны)"}, value: UnitsEnum.GAL},
    {label: {[LocalesEnum.EN_US]: "ml (Milliliters)", [LocalesEnum.RU_RU]: "мл (Миллилитры)"}, value: UnitsEnum.ML},
    {label: {[LocalesEnum.EN_US]: "l (Liters)", [LocalesEnum.RU_RU]: "л (Литры)"}, value: UnitsEnum.L},
    {label: {[LocalesEnum.EN_US]: "g (Grams)", [LocalesEnum.RU_RU]: "г (Граммы)"}, value: UnitsEnum.G},
    {label: {[LocalesEnum.EN_US]: "kg (Kilograms)", [LocalesEnum.RU_RU]: "кг (Килограммы)"}, value: UnitsEnum.KG},
    {label: {[LocalesEnum.EN_US]: "oz (Ounces)", [LocalesEnum.RU_RU]: "унц. (Унции)"}, value: UnitsEnum.OZ},
    {label: {[LocalesEnum.EN_US]: "lb (Pounds)", [LocalesEnum.RU_RU]: "фунт. (Фунты)"}, value: UnitsEnum.LB},
    {label: {[LocalesEnum.EN_US]: "pinch (Pinches)", [LocalesEnum.RU_RU]: "щеп. (Щепотки)"}, value: UnitsEnum.PINCH},
    {label: {[LocalesEnum.EN_US]: "dash (Dashes)", [LocalesEnum.RU_RU]: "дэш (Дэши)"}, value: UnitsEnum.DASH},
    {label: {[LocalesEnum.EN_US]: "touch (Touches)", [LocalesEnum.RU_RU]: "тач (Тачи)"}, value: UnitsEnum.TOUCH},
    {label: {[LocalesEnum.EN_US]: "handful (Handfuls)", [LocalesEnum.RU_RU]: "горст. (Горсти)"}, value: UnitsEnum.HANDFUL},
    {label: {[LocalesEnum.EN_US]: "stick (Sticks)", [LocalesEnum.RU_RU]: "пал. (Палочки)"}, value: UnitsEnum.STICK},
    {label: {[LocalesEnum.EN_US]: "can (Cans)", [LocalesEnum.RU_RU]: "бан. (Банки)"}, value: UnitsEnum.CAN},
    {label: {[LocalesEnum.EN_US]: "pkg (Packages)", [LocalesEnum.RU_RU]: "упак. (Упаковки)"}, value: UnitsEnum.PKG},
    {label: {[LocalesEnum.EN_US]: "jar (Jars)", [LocalesEnum.RU_RU]: "бан. (Банки)"}, value: UnitsEnum.JAR},
    {label: {[LocalesEnum.EN_US]: "bottle (Bottles)", [LocalesEnum.RU_RU]: "бут. (Бутылки)"}, value: UnitsEnum.BOTTLE},
    {label: {[LocalesEnum.EN_US]: "bunch (Bunches)", [LocalesEnum.RU_RU]: "пуч. (Пучки)"}, value: UnitsEnum.BUNCH},
    {label: {[LocalesEnum.EN_US]: "slice (Slices)", [LocalesEnum.RU_RU]: "ломт. (Ломтики)"}, value: UnitsEnum.SLICE},
    {label: {[LocalesEnum.EN_US]: "piece (Pieces)", [LocalesEnum.RU_RU]: "кус. (Кусочки)"}, value: UnitsEnum.PIECE},
    {label: {[LocalesEnum.EN_US]: "whole (Wholes)", [LocalesEnum.RU_RU]: "цел. (Целые)"}, value: UnitsEnum.WHOLE},
    {label: {[LocalesEnum.EN_US]: "half (Halves)", [LocalesEnum.RU_RU]: "пол. (Половинки)"}, value: UnitsEnum.HALF},
    {label: {[LocalesEnum.EN_US]: "quarter (Quarters)", [LocalesEnum.RU_RU]: "четв. (Четвертинки)"}, value: UnitsEnum.QUARTER},
    {label: {[LocalesEnum.EN_US]: "drop (Drops)", [LocalesEnum.RU_RU]: "кап. (Капли)"}, value: UnitsEnum.DROP},
    {label: {[LocalesEnum.EN_US]: "cube (Cubes)", [LocalesEnum.RU_RU]: "куб. (Кубики)"}, value: UnitsEnum.CUBE},
    {label: {[LocalesEnum.EN_US]: "To taste", [LocalesEnum.RU_RU]: "По вкусу"}, value: UnitsEnum.TO_TASTE}
];

export const unitsList = defaultUnitsList;
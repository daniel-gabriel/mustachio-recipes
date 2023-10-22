/**
 * Represents a converter from object type `TFrom` to object type `TTo`.
 */
export interface IConverter<TFrom, TTo> {
    /**
     * The implementation should perform a conversion of `obj` (which will be of type `TFrom`)
     * to a new object of type `TTo`. Additional parameters can be passed in using the `additional`
     * array.
     * @param obj the object to convert.
     * @param additional additional data necessary for the conversion.
     * @return a Promise of type `TTo`.
     */
    convert(obj: TFrom, ...additional: any[]): Promise<TTo>;
}

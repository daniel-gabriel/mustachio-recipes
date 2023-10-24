import Fraction from "fraction.js";

export class NumberUtils {
    public static toFraction(input: number): string {
        const fraction = new Fraction(input);
        return fraction.toFraction(true);
    }

    public static toDecimal(input?: string): number | undefined {
        try {
            const fraction = new Fraction(input || "");
            return fraction.valueOf();
        } catch (error) {
            return undefined;
        }
    }
}
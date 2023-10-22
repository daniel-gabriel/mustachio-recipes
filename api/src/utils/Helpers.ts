// based on: https://www.meziantou.net/typescript-nameof-operator-equivalent.htm
export function nameof<T>(key: keyof T): string {
    return key as string;
}
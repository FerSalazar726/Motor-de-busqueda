declare type Hasher<T> = (input: T) => string;
declare function dedupe<T>(list: T[], hasher?: Hasher<T>): T[];
export default dedupe;

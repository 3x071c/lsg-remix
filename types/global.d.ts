declare type PartialOnly<T, K extends keyof T> = Pick<Partial<T>, K> &
	Omit<T, K>;
declare type PartialExcept<T, K extends keyof T> = Pick<T, K> &
	Omit<Partial<T>, K>;
declare type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
declare type MakeRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;
declare type MakeOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>;

type Promisable<T> = T | Promise<T>;

export interface IInitialize {
  init: () => Promisable<void>;
}

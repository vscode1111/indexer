export class MultiSet<T> {
  private set: Set<T>;
  private array!: T[][];
  private counter: number;

  constructor(count: number) {
    this.set = new Set<T>();
    this.counter = 0;
    this.array = [];
    for (let i = 0; i < count; i++) {
      this.array.push([]);
    }
  }

  public add(value: T) {
    if (this.set.has(value)) {
      return;
    }

    this.set.add(value);

    if (this.counter > this.array.length - 1) {
      this.counter = 0;
    }
    this.array[this.counter].push(value);
    this.counter++;
  }

  public getValue(index: number) {
    const length = this.array[index].length;
    return this.array[index][length - 1];
  }

  public deleteValue(index: number) {
    const value = this.array[index].pop();
    if (value !== undefined) {
      this.set.delete(value);
    }
    return value;
  }

  public lenght(index: number) {
    return this.array[index].length;
  }

  public lenghts() {
    const result: number[] = [];
    for (let i = 0; i < this.array.length; i++) {
      result.push(this.array[i].length);
    }
    return result;
  }

  public totalLenght() {
    return this.lenghts().reduce((acc, cur) => (acc += cur), 0);
  }
}

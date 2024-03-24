type ReleaseFunction = () => void;

export class Lock {
  private isLocked: boolean;
  private waiting: ((release: ReleaseFunction) => void)[];

  constructor() {
    this.isLocked = false;
    this.waiting = [];
  }

  acquire(): Promise<ReleaseFunction> {
    if (this.isLocked) {
      return new Promise(resolve => this.waiting.push(resolve));
    } else {
      this.isLocked = true;
      return Promise.resolve(() => this.release());
    }
  }

  private release(): void {
    if (this.waiting.length > 0) {
      const nextResolve = this.waiting.shift();
      if (nextResolve) {
        nextResolve(() => this.release());
      }
    } else {
      this.isLocked = false;
    }
  }
}
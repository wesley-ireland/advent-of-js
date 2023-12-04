class Timer {
    constructor() {
        this.NS_PER_SEC = 1e9;
        this.MS_PER_NS = 1e-6
        this.startTime = process.hrtime();
    }

    runtimeMs() {
        const diff = process.hrtime(this.startTime);
        return (diff[0] * this.NS_PER_SEC + diff[1]) * this.MS_PER_NS;
    }
}

export function time(part, fn) {
    const timer = new Timer();
    const result = fn();
    const duration = Number(timer.runtimeMs().toPrecision(2));
    console.log(`${part}: Solution is ${result}\nTook ${duration} ms\n`);
}
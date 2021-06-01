import Interval from "./Interval";

export default interface Timer {
    id: string;
    name: string;
    root?: Interval;
    message?: string;
}

export function extractIntervals(timer: Timer): Interval[] {
    if (timer.root === undefined) {
        return [];
    }

    let interval = timer.root;
    const result: Interval[] = [interval];
    while (interval.next !== undefined) {
        interval = interval.next;
        result.push(interval);
    }
    return result;
}
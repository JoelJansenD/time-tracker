export default interface Interval {
    name: string;
    id: string;
    next?: Interval;
    runtime: Runtime;
    timePassed?: Runtime;
    message?: string;
}

export interface Runtime {
    hours: number;
    minutes: number;
    seconds: number;
}

export function getRuntimeString(runtime: Runtime) {
    return `${runtime.hours.toString().padStart(2, '0')}:${runtime.minutes.toString().padStart(2, '0')}:${runtime.seconds.toString().padStart(2, '0')}`;
}

export function getTimePassedSince(startTime: number): Runtime {
    const difference = Date.now() - startTime;
    const seconds = Math.floor(difference / 1000);

    return {
        hours: 0,
        minutes: 0,
        seconds: seconds
    }
}

export function toInterval(time: number): Runtime {
    const hours = Math.floor(time / 3600000);
    time -= (hours * 3600000);
    const minutes = Math.floor(time / 60000);
    time -= (minutes * 60000);
    const seconds = Math.floor(time / 1000);

    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}
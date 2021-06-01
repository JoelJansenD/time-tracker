import { Fragment, useEffect, useState } from "react";
import Interval, { getRuntimeString, getTimePassedSince, toInterval } from "../model/Interval";
import Timer, { extractIntervals } from "../model/Timer";
import IntervalComponent from "./IntervalComponent";
import { v4 as uuidv4 } from 'uuid';

interface TimerComponentProps {
    timer: Timer;
    timerChanged: (timer: Timer) => void;
}

const TimerComponent = ({ timer, timerChanged }: TimerComponentProps) => {

    const [activeInterval, setActiveInterval] = useState<Interval | undefined>(undefined);
    const [startTime, setStartTime] = useState(0);
    const [timePassed, setTimePassed] = useState(0);

    // Interval loop
    useEffect(() => {
        if (activeInterval !== undefined) {
            const startTime = Date.now();
            setStartTime(startTime);

            let intervalRunTime = activeInterval.runtime;
            const endTime = startTime
                + (intervalRunTime.hours * 3600000)
                + (intervalRunTime.minutes * 60000)
                + (intervalRunTime.seconds * 1000);

            const timerLoop = setInterval(() => {
                if (Date.now() >= endTime) {
                    toNextInterval(activeInterval);
                    return;
                }

                setTimePassed((endTime - Date.now()) + 1000); // Add 1000 ms to make time rendering a bit neater
            }, 100);
            return () => clearInterval(timerLoop);
        }
    }, [activeInterval]);

    const addInterval = () => {
        const name = window.prompt('Interval name');
        if (name === undefined) {
            return;
        }

        const message = window.prompt('Message');

        const newTimer = { ...timer };
        const interval: Interval = {
            name: name!,
            message: message ?? undefined,
            runtime: { hours: 0, minutes: 0, seconds: 0 },
            id: uuidv4()
        }

        if (newTimer.root === undefined) {
            newTimer.root = interval;
        }
        else {
            let curr = newTimer.root;
            while (curr.next !== undefined) curr = curr.next;
            curr.next = interval;
        }

        timerChanged(newTimer);
    }

    const deleteInterval = (interval: Interval) => {
        const newTimer = { ...timer };
        let node = newTimer.root;

        if (node !== undefined && node.id === interval.id) {
            newTimer.root = node.next;
        }
        else {
            while (node?.next !== undefined) {
                if (node.next.id === interval.id) {
                    node.next = node.next?.next ?? undefined;
                    break;
                }
                node = node.next;
            }
        }

        timerChanged(newTimer);
    }

    const toNextInterval = (interval: Interval) => {
        setActiveInterval(interval.next);
        speak(interval !== undefined ? (interval.message ?? 'Interval completed') : (timer.message ?? 'Timer completed'));
    }

    const saveInterval = (interval: Interval) => {
        const newTimer = { ...timer };
        let target = newTimer.root;
        while (target !== undefined) {
            if (target.id === interval.id) {
                target.runtime = interval.runtime;
                break;
            }
            target = target.next;
        }

        timerChanged(newTimer);
    }

    const speak = (message: string) => {
        const speech = new SpeechSynthesisUtterance();
        speech.lang = 'en';
        speech.text = message;
        window.speechSynthesis.speak(speech);
    }

    const start = () => {
        if (timer.root === undefined) {
            throw new Error("No intervals defined");
        }

        speak(`Starting ${timer.name}`);
        setActiveInterval(timer.root);
    }

    return (
        <Fragment>
            <h1>{timer.name}</h1>
            {
                activeInterval ? (
                    <Fragment>
                        <div>
                            <strong>Interval</strong>
                            <span>{activeInterval.name}</span>
                        </div>
                        <div>
                            <strong>Passed</strong>
                            <span>{getRuntimeString(getTimePassedSince(startTime))}</span>
                        </div>
                        <div>
                            <strong>Remaining</strong>
                            <span>{getRuntimeString(toInterval(timePassed))}</span>
                        </div>
                    </Fragment>
                ) : ''
            }
            <button onClick={addInterval}>Add interval</button>
            <button onClick={start}>Start</button>
            { extractIntervals(timer).map((interval, index) => <IntervalComponent key={index} interval={interval} deleteInterval={deleteInterval} saveInterval={saveInterval} />)}
        </Fragment>
    )
}

export default TimerComponent;
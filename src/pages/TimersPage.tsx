import TimerComponent from "../components/TimerComponent";
import Interval from "../model/Interval";
import Timer from "../model/Timer";
import { v4 as uuidv4 } from 'uuid';
import { Fragment, useState } from "react";

const TimersPage = () => {

    const [timers, setTimers] = useState<Timer[]>([
        {
            name: "Timer 1",
            root: {
                name: "Interval 1",
                next: {
                    name: "Interval 2",
                    runtime: { hours: 0, minutes: 0, seconds: 5 },
                    message: "Interval 2 completed",
                    id: uuidv4()
                },
                runtime: { hours: 0, minutes: 0, seconds: 5 },
                message: "Interval 1 completed",
                id: uuidv4()
            },
            message: "Timer 1 completed",
            id: uuidv4()
        }
    ]);

    console.log(timers);

    const timerChanged = (timer: Timer) => {
        const index = timers.findIndex(t => t.id === timer.id);
        const newTimers = [...timers];
        newTimers[index] = timer;
        setTimers(newTimers);
    }

    return (
        <Fragment>
            {timers.map((timer, index) => (
                <TimerComponent timer={timer} timerChanged={timerChanged} key={index} />
            ))}
        </Fragment>
    )
}

export default TimersPage;
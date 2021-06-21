import TimerComponent from "../components/TimerComponent";
import Interval from "../model/Interval";
import Timer from "../model/Timer";
import { v4 as uuidv4 } from 'uuid';
import { Fragment, useState } from "react";
import "./style/TimersPage.scss";

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
                    id: uuidv4(),
                    next: {
                        name: "Interval 3",
                        runtime: { hours: 0, minutes: 0, seconds: 5 },
                        message: "Interval 2 completed",
                        id: uuidv4(),
                        next: {
                            name: "Interval 4",
                            runtime: { hours: 0, minutes: 0, seconds: 5 },
                            message: "Interval 2 completed",
                            id: uuidv4()
                        },
                    },
                },
                runtime: { hours: 0, minutes: 0, seconds: 5 },
                message: "Interval 1 completed",
                id: uuidv4()
            },
            message: "Timer 1 completed",
            id: uuidv4()
        }
    ]);

    const timerChanged = (timer: Timer) => {
        const index = timers.findIndex(t => t.id === timer.id);
        const newTimers = [...timers];
        newTimers[index] = timer;
        setTimers(newTimers);
    }

    const timerDeleted = (timer: Timer) => {
        const index = timers.findIndex(t => t.id === timer.id);
        const newTimers = [...timers];
        newTimers.splice(index, 1);
        setTimers(newTimers);
    }

    return (
        <div className="timers">
            {[0, 1, 2, 3, 4].map((timer, index) => (
                <div className="timer" key={index}><TimerComponent timer={timers[0]} timerChanged={timerChanged} timerDeleted={timerDeleted} /></div>
            ))}
        </div>
    )
}

export default TimersPage;
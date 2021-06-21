import { Fragment, useEffect, useState } from "react";
import Interval, { getRuntimeString, getTimePassedSince, toInterval } from "../model/Interval";
import Timer, { extractIntervals } from "../model/Timer";
import IntervalComponent from "./IntervalComponent";
import { v4 as uuidv4 } from 'uuid';
import './style/TimerComponent.scss';
import CircularProgressbarComponent from "./CircularProgressbarComponent";
import { CardContent, Fab, Card, CardActions, Typography, Grid, List, ListItem, ListItemText, Paper, TextField, CircularProgress, makeStyles, IconButton } from "@material-ui/core";
import { Add, Delete, DeleteOutline, DoubleArrow, Pause, PlayArrow, Stop } from "@material-ui/icons";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

interface TimerComponentProps {
    timer: Timer;
    timerChanged: (timer: Timer) => void;
    timerDeleted: (timer: Timer) => void;
}

const TimerComponent = ({ timer, timerChanged, timerDeleted }: TimerComponentProps) => {

    const [activeInterval, setActiveInterval] = useState<Interval | undefined>(undefined);
    const [hasStarted, setStarted] = useState(false);
    const [isPaused, setPaused] = useState(false);

    const getRemainingIntervals = (): Interval[] => {
        if (timer.root === undefined) return [];

        const intervals = [activeInterval ?? timer.root];
        let curr = activeInterval ?? timer.root;
        while (curr.next !== undefined) {
            intervals.push(curr.next);
            curr = curr.next;
        }
        return intervals;
    }

    const click_add_interval = () => {

    }

    const double_click_paper = (interval: Interval) => {
        //TODO: Name change dialog
        interval.name = "test";
        timerChanged(timer);
    }

    const click_delete_interval = (interval: Interval) => {
        //TODO: Confirmation dialog
        let prev = timer.root;
        if (prev && prev.id === interval.id) {
            timer.root = prev?.next;
        }
        else {
            let curr = prev?.next;
            while (curr) {
                if (curr.id === interval.id) {
                    prev!.next = curr.next;
                    break;
                }
                prev = curr;
                curr = curr.next;
            }
        }

        timerChanged(timer);
    }

    const click_delete_timer = () => {
        //TODO: Confirmation dialog
        timerDeleted(timer);
    }

    const click_skip_interval = () => {
        //TODO: Pause to prevent accidental double click
    }

    const click_start_pause = () => {
        setPaused(!isPaused);
    }

    const click_start_stop = () => {
        setStarted(!hasStarted);
    }

    return (
        <Fragment>
            <Card className="card" variant="outlined" color="primary">
                <CardContent className="card__content card__content-title">
                    <Typography color="primary" variant="h4">{timer.name}</Typography>
                </CardContent>

                <CardContent className={'card__content card__content-intervals'}>
                    {
                        hasStarted ?
                            (
                                <Paper elevation={10} className="card__interval">
                                    <span className="card__interval-title">Interval 1</span>
                                    <form className="card__interval-form" noValidate autoComplete="off">
                                        <TextField type="number" disabled size="small" id={`hours-Interval 1`} label="Hours" />
                                        <TextField type="number" disabled size="small" id={`minutes-Interval 1`} label="Minutes" />
                                    </form>
                                </Paper>
                            ) :
                            (
                                getRemainingIntervals().map((interval, index) => (
                                    <Paper elevation={10} className="card__interval" onDoubleClick={() => double_click_paper(interval)} key={index}>
                                        <div className="card__interval-header">
                                            <span className="card__interval-title">{interval.name}</span>
                                            <IconButton aria-label="delete" onClick={() => click_delete_interval(interval)}>
                                                <Delete color="error" />
                                            </IconButton>
                                        </div>
                                        <form className="card__interval-form" noValidate autoComplete="off">
                                            <TextField type="number" size="small" id={`hours-${interval.name}`} label="Hours" />
                                            <TextField type="number" size="small" id={`minutes-${interval.name}`} label="Minutes" />
                                        </form>
                                    </Paper>
                                ))
                            )
                    }
                </CardContent>

                {hasStarted && <CardContent className="card__content card__content-remaining">
                    <CircularProgressWithLabel label="00:12:23" labelSize={29} variant="determinate" value={52} size={200} />
                </CardContent>}

                <CardActions className="card__actions">
                    {
                        hasStarted ?
                            (
                                <Fab size="small" color="primary" onClick={click_start_pause}>{isPaused ? <PlayArrow /> : <Pause />}</Fab>
                            ) :
                            (
                                <Fab size="small" color="primary" onClick={click_add_interval}><Add /></Fab>
                            )
                    }
                    <Fab size="large" color="primary" onClick={click_start_stop}>{hasStarted ? <Stop fontSize="large" /> : <PlayArrow fontSize="large" />}</Fab>
                    {
                        hasStarted ?
                            (
                                <Fab size="small" color="primary" onClick={click_skip_interval}><DoubleArrow /></Fab>
                            ) :
                            (
                                <Fab size="small" onClick={click_delete_timer}><Delete color="error" /></Fab>
                            )
                    }
                </CardActions>
            </Card>
        </Fragment >
    )
}

export default TimerComponent;

/*

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

    const getRemainingIntervals = (): Interval[] => {
        if (timer.root === undefined) return [];

        const intervals = [activeInterval ?? timer.root];
        let curr = activeInterval ?? timer.root;
        while (curr.next !== undefined) {
            intervals.push(curr.next);
            curr = curr.next;
        }
        return intervals;
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

*/
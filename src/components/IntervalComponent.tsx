import React, { Fragment, useState } from 'react';
import Interval, { getRuntimeString } from '../model/Interval';
import './style/IntervalComponent.scss';

interface IntervalComponentProps {
    interval: Interval;
    deleteInterval: (interval: Interval) => void;
    saveInterval: (interval: Interval) => void;
}

const IntervalComponent = ({ interval, deleteInterval, saveInterval }: IntervalComponentProps) => {

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const changeInterval = () => {
        const newInterval = { ...interval };
        newInterval.runtime = {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        saveInterval(newInterval);
    }

    return (
        <Fragment>
            <h3>{interval.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', width: '60%', alignItems: 'center', margin: '0 auto' }}>
                <input type='number' placeholder='hours' onChange={event => setHours(parseInt(event.target.value))} />
                <input type='number' placeholder='minutes' onChange={event => setMinutes(parseInt(event.target.value))} />
                <input type='number' placeholder='seconds' onChange={event => setSeconds(parseInt(event.target.value))} />
            </div>
            <button onClick={() => changeInterval()}>Save interval</button>
            <button onClick={() => deleteInterval(interval)}>Remove interval</button>
        </Fragment>
    )
}

export default IntervalComponent;
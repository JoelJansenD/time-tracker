import React, { useEffect, useState } from 'react';
import TimeInputComponent from './TimeInputComponent';

const IntervalComponent = ({name}) => {
    const [running, setRunning] = useState(false);
    const [intervals, setIntervals] = useState([]);

    const [activeInterval, setActiveInterval] = useState(Infinity);
    const [startDate, setStartDate] = useState(new Date());

    const [ellapsed, setEllapsed] = useState(new Date());
    const [remaining, setRemaining] = useState(new Date());

    useEffect(() => {
        if(activeInterval + 1 >= intervals.length) {
            if(activeInterval !== Infinity) {
                const msg = new SpeechSynthesisUtterance();
                msg.text = intervals[activeInterval] ? `${name} completed` : 'Task done!';
                msg.lang = 'en';
                speechSynthesis.speak(msg);
            }

            setActiveInterval(-1);
            setRunning(false);
            return;
        }
        
        const msg = new SpeechSynthesisUtterance();
        msg.text = intervals[activeInterval + 1].message;
        msg.lang = 'en';
        speechSynthesis.speak(msg);
        
        const started = new Date(startDate);
        const interval = intervals[activeInterval + 1];
        console.log(started.getTime() 
        + (interval.time.hours * 3600000)
        + (interval.time.minutes)
        + (interval.time.seconds))
        const endDate = new Date(started.getTime() 
            + (interval.time.hours * 3600000)
            + (interval.time.minutes * 60000)
            + (interval.time.seconds * 1000) );

        const clock = setInterval(() => {
            const curr = Date.now();
            const ellapsed = curr - started.getTime();
            const remaining = endDate.getTime() - curr;
            
            setEllapsed(new Date(ellapsed));
            setRemaining(new Date(remaining));

            if(remaining <= 0) {
                setActiveInterval(activeInterval + 1);
                setStartDate(Date.now());
            }
        }, 100);
        return () => clearInterval(clock);
    }, [startDate]);

    const addInterval = () => {
        const name = prompt("Name");
        const intervalNames = Object.keys(intervals);
        if(name !== null && !intervalNames.includes(name)) {
            const newIntervals = [...intervals];
            const message = prompt("Message")
            newIntervals.push({name: name, time: {hours:0,minutes:0,seconds:0}, message: message});
            setIntervals(newIntervals);
        }
    }

    const onRemove = (name) => {
        const newIntervals = [...intervals];
        newIntervals.splice(newIntervals.findIndex(i => i.name === name), 1);
        setIntervals(newIntervals);
    }

    const onSaveInterval = (name, interval) => {
        const newIntervals = [...intervals];
        const target = newIntervals.find(i => i.name === name);
        target.time = interval;
        setIntervals(newIntervals);
    }

    const start = () => {
        setActiveInterval(-1);
        setStartDate(Date.now());
    }

    const stop = () => {
        setActiveInterval(Infinity);
    }

    const click_start_stop = () => {
        if(running) {
            stop();
        }
        else {
            start();
        }

        setRunning(!running);
    }

    return (
        <div>
            {/* Info and controls */}
            <h3>{name}</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <button onClick={addInterval}>Add interval</button>
                <button onClick={click_start_stop}>{running ? 'Stop' : 'Start'}</button>
            </div>

            {/* Time remaining */}
            <div style={{display:running ? 'flex' : 'none',flexDirection:'column',marginBottom:'8px'}} >
                <span>
                    <b style={{display:'inline-block', width:'200px'}}>Active interval</b> {(intervals[activeInterval + 1] ? intervals[activeInterval + 1].name : '')}
                </span>
                <span>
                    <b style={{display:'inline-block', width:'200px'}}>Time ellapsed</b> {
                        `${(ellapsed.getHours() - 1).toString().padStart(2, '0')}:${ellapsed.getMinutes().toString().padStart(2, '0')}:${ellapsed.getSeconds().toString().padStart(2, '0')}`
                    }
                </span>
                <span>
                    <b style={{display:'inline-block', width:'200px'}}>Time remaining</b> {
                        `${(remaining.getHours() - 1).toString().padStart(2, '0')}:${remaining.getMinutes().toString().padStart(2, '0')}:${remaining.getSeconds().toString().padStart(2, '0')}`
                    }
                </span>
            </div>
            
            {/* All intervals */}
            {intervals.map((interval, index) => <TimeInputComponent key={index} name={interval.name} enabled={!running} onRemove={onRemove} onSave={onSaveInterval} />)}
            
        </div>   
    )
}

export default IntervalComponent;
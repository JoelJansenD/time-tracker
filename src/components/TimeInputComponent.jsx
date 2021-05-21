import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

const TimeInputComponent = ({ enabled, name, onRemove, onSave }) => {

    const [changed, setChanged] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const click_save = () => {
        setChanged(false);
        if(onSave) {
            console.log({hours: hours, minutes: minutes, seconds: seconds})
            onSave(name, {hours: hours, minutes: minutes, seconds: seconds});
        }
    }

    useEffect(() => {
        setChanged(true);
    }, [hours, minutes, seconds]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span style={{fontWeight: 500, width: '100px'}} >{name}</span>
            <input disabled={!enabled} type='number' placeholder='hh' onChange={event => setHours(parseInt(event.target.value || '0'))} />
            <input disabled={!enabled} type='number' placeholder='mm' onChange={event => setMinutes(parseInt(event.target.value || '0'))} />
            <input disabled={!enabled} type='number' placeholder='ss' onChange={event => setSeconds(parseInt(event.target.value || '0'))} />
            <button disabled={!changed} onClick={click_save}>Save</button>
            <button onClick={() => onRemove(name)}>Remove interval</button>
        </div>
    );
}

export default TimeInputComponent;
import { Fragment, useEffect, useState } from 'react';
import './style/CircularProgressbarComponent.scss';

interface CircularProgressbarComponentProps {
    height: number,
    width: number,
    max: number,
    current: number,
    color?: string,
    label?: { text: string, size: number, weight?: number, color?: string },
    subLabel?: { text: string, size: number, weight?: number, color?: string }
}

const CircularProgressbarComponent = ({ height, width, max, current, color, label, subLabel }: CircularProgressbarComponentProps) => {
    const [primaryLabel, setPrimaryLabel] = useState(<Fragment />);
    const [secondaryLabel, setSecondaryLabel] = useState(<Fragment />);

    const stroke = 4;
    const radius = Math.floor(height / 2) - (stroke * 2);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (current / max) * circumference;

    useEffect(() => {
        const primaryLabelText = label ?? subLabel;
        if (primaryLabelText !== undefined) {
            setPrimaryLabel(<text className="progress-bar__label" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={primaryLabelText.size} fontWeight={primaryLabelText.weight ?? 400} fill={primaryLabelText.color ?? 'white'}>{primaryLabelText.text}</text>);
        }

        if (primaryLabelText === label && subLabel !== undefined) {
            setSecondaryLabel(<text className="progress-bar__sublabel" x="50%" y="75%" dominantBaseline="middle" textAnchor="middle" fontSize={subLabel.size} fontWeight={subLabel.weight ?? 400} fill={subLabel.color ?? 'white'}>{subLabel.text}</text>)
        }
    }, []);

    return (
        <svg className="progress-bar" height={height} width={width}>
            <circle
                className="progress-bar__ring"
                stroke={color ?? "blue"}
                strokeOpacity="40%"
                strokeWidth={stroke}
                fill="transparent"
                r={radius}
                cx={Math.floor(width / 2)}
                cy={Math.floor(height / 2)} />
            <circle
                className="progress-bar__ring"
                stroke={color ?? "blue"}
                strokeWidth={stroke}
                fill="transparent"
                r={radius}
                cx={Math.floor(width / 2)}
                cy={Math.floor(height / 2)}
                style={{
                    strokeDasharray: `${circumference} ${circumference}`,
                    strokeDashoffset: offset
                }} />
            { primaryLabel}
            { secondaryLabel}
            {/* { label !== undefined ? <text className="progress-bar__label" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">{label}</text> : <Fragment />} */}
            {/* { subLabel !== undefined ? <text className="progress-bar__sublabel" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">{subLabel}</text> : <Fragment />} */}
        </svg>
    )
}

export default CircularProgressbarComponent;
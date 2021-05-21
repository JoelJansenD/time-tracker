import logo from './logo.svg';
import './App.css';
import IntervalComponent from './components/IntervalComponent';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

function App() {

	const [intervals, setIntervals] = useState([]);

	const addInterval = () => {
		const name = prompt('Name');
		if (name !== null && !intervals.includes(name)) {
			const newIntervals = [...intervals];
			newIntervals.push(name)
			setIntervals(newIntervals);
		}
	}

	return (
		<div className="App">
			<button onClick={addInterval}>New interval</button>
			{intervals.map((interval, index) => <div className='interval' key={index}><IntervalComponent name={interval} /></div>)}
		</div>
	);
}

export default App;

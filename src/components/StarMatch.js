import React, {useState, useEffect} from 'react';
import utils from '../math-utils';
import PlayNumber from './PlayNumber';
import StarsDisplay from './StarsDisplay';
import PlayAgain from './PlayAgain';

const StarMatch = () => {
	// initial state
	const [stars, setStars] = useState(utils.random(1, 9));
	const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
	const [candidateNums, setCandidateNums] = useState([]);
	const defaultTimer = 10;
	const [secondsLeft, setSecondsLeft] = useState(defaultTimer);

	//setTimeout
	useEffect(() => {
		// console.log('Rendered...');
		if (secondsLeft > 0 && availableNums.length > 0) {
			const timerId = setTimeout(() => {
				setSecondsLeft(secondsLeft - 1);
			}, 1000);
			return () => clearTimeout(timerId); // always clean up after Effects
		}
		// console.log('Done rendering');
		// return () => console.log('Component is going to rerender');
	});

	// check if clicked number is bigger than sum of available stars
	const candidatesAreWrong = utils.sum(candidateNums) > stars;
	const gameStatus = availableNums.length === 0
		? 'won'
		: secondsLeft === 0
			? 'lost'
			: 'active';

	const resetGame = () => {
		setStars(utils.random(1, 9));
		setAvailableNums(utils.range(1, 9));
		setCandidateNums([]);
		setSecondsLeft(defaultTimer);
	};

	// updating UI
	const numberStatus = (number) => {
		if (!availableNums.includes(number)) {
			return 'used';
		}
		if (candidateNums.includes(number)) {
			return candidatesAreWrong ? 'wrong' : 'candidate';
		}
		return 'available'
	};

	// currentStatus => newStatus
	const onNumberClick = (number, currentStatus) => {
		if (gameStatus !== 'active' || currentStatus === 'used') {
			return;
		}
		// adding new number to candidates
		const newCandidateNums =
			currentStatus === 'available'
				? candidateNums.concat(number)
				// keep all the candidate numbers except the number that was just clicked
				: candidateNums.filter(cn => cn !== number);
		if (utils.sum(newCandidateNums) !== stars) {
			setCandidateNums(newCandidateNums);
		} else {
			const newAvailableNums = availableNums.filter(
				n => !newCandidateNums.includes(n)
			);
			// redraw stars (from available)
			setStars(utils.randomSumIn(newAvailableNums, 9));
			// reset the available stars (from what is left)
			setAvailableNums(newAvailableNums);
			// reset the candidate nums to empty
			setCandidateNums([]);
		}
	};

	return (
		<div className="game">
			<h1>Star Match game</h1>
			<div className="help">
				Pick 1 or more numbers that sum to the number of stars
			</div>
			<div className="body">
				<div className="left">
					{gameStatus !== 'active' ? (
						<PlayAgain onClick={resetGame} gameStatus={gameStatus}/>
					) : (
						<StarsDisplay count={stars}/>
					)}
				</div>
				<div className="right">
					{utils.range(1, 9).map(number => (
						<PlayNumber
							key={number}
							status={numberStatus(number)}
							number={number}
							onClick={onNumberClick}
						/>
					))}
				</div>
			</div>
			<div className="timer">Time Remaining: {secondsLeft}</div>

			<p className="copy">Training project by Xenia Novosilska,<br/>
				based on Pluralsight online course by Samer Buna</p>
		</div>
	);
};

export default StarMatch;
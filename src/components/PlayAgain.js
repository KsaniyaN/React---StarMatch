import React from 'react';

const PlayAgain = props => (
	<div className="game-done">
		<div
			className="message"
			style={{color: props.gameStatus === 'lost' ? 'darkred' : 'limegreen'}}>
			{props.gameStatus === 'lost' ? 'Game Over..' : 'Nice!'}
		</div>
		<button
			className="message"
			onClick={props.onClick}>Play Again
		</button>
	</div>
);

export default PlayAgain;
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let className="square"
  if(props.highlight){
    className += " highlight";
  }

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square key={i}
            value={this.props.squares[i]} 
            onClick={() => {this.props.onClick(i)}}
            highlight={this.props.winnerLines.includes(i)}
            />
        );
    }
  
    render() {
      const table = [];
      for (let y = 0; y < 3; y++) {
        const row = [];
        for (let x = 0; x < 3; x++) {
          row.push(this.renderSquare(y * 3 + x));
        }
        table.push(<div className="board-row" key={y}>{row}</div>);
      }
      return (
        <div>{table}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares : Array(9).fill(null)
        }],
        stepNumber: 0, 
        xIsNext: true,
        movesOrderAsc: true,
      }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
              squares: squares,
              selectedIndex: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    
    toggleMoves() {
      this.setState({
        movesOrderAsc: !this.state.movesOrderAsc,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const gameEnd = current.squares.length === this.state.stepNumber;

      const moves = history.map((step, move) => {
        const col = (step.selectedIndex % 3) + 1;
        const row = Math.floor(step.selectedIndex / 3) + 1;

        const desc = move ? 
          'Go to move #' + move + ' (' + col + ', ' + row + ')':
          'Go to game start';

        return (
          <li key={move}>
            <button onClick={()=>this.jumpTo(move)}>
              <span className={move === this.state.stepNumber ? 'bold' : ''}>{desc}</span>
            </button>
          </li>
        );
      });
      if(!this.state.movesOrderAsc){
        moves.reverse();
      }

      let status;
      if(winner){
        status = 'Winner: ' + winner.winner;
      } else if(gameEnd) {
        status = 'Game end draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winnerLines={winner ? winner.lines : []}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.toggleMoves()}>toggle</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          lines: lines[i],
        }
      }
    }
    return null;
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
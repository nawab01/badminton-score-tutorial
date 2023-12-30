import React, { Component } from 'react';
import annyang from './Annyang';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      players: [
        {
          name: '',
          score: 0,
          commands: ['Player one point'],
        },
        {
          name: '',
          score: 0,
          commands: ['Player two point'],
        },
      ],
      serverHistory: [],
      voiceStatus: 'hello',
      voiceInput: ['hello world', 'halo war', 'hallow world'],
      inputValue: '', // Added input value state
    };
  }

  componentDidMount() {
    annyang.addCommands(this.reset, this.change, this.undo);
    annyang.addCallback(this.engineCallback, this.resultCallback);
    annyang.start();

    this.setState({
      voiceStatus: annyang.isSupported() ? 'Supported' : 'Unsupported',
    });
  }

  componentWillUnmount() {
    annyang.abort();
  }

  engineCallback = (status) => {
    this.setState({
      voiceStatus: status,
    });
  };

  resultCallback = (voiceInput) => {
    this.setState({
      voiceInput: voiceInput,
    });
    voiceInput.some((phrase) => {
      return this.state.players.some((player, playerIndex) => {
        if (
          player.commands
            .map((command) => command.toLowerCase())
            .includes(phrase.trim().toLowerCase())
        ) {
          this.increaseScore(playerIndex);
          return true;
        }
        return false;
      });
    });
  };

  increaseScore(playerIndex) {
    const players = this.state.players.slice();
    players[playerIndex].score += 1;
    this.setState({
      players: players,
      serverHistory: [...this.state.serverHistory, playerIndex],
    });
  }

  reset = () => {
    const players = this.state.players.slice();
    players.forEach((player) => (player.score = 0));
    this.setState({
      players: players,
      serverHistory: [],
    });
  };

  change = () => {
    this.setState({
      players: this.state.players.reverse(),
    });
  };

  undo = () => {
    const serverHistory = this.state.serverHistory;
    if (serverHistory.length === 0) {
      return;
    }
    const lastServerIndex = serverHistory[serverHistory.length - 1];
    const players = this.state.players.slice();
    players[lastServerIndex].score -= 1;
    this.setState({
      players: players,
      serverHistory: serverHistory.slice(0, -1),
    });
  };

  handleNameChange = (playerIndex, event) => {
    const name = event.target.value;
    const players = this.state.players.slice();
    players[playerIndex].name = name;
    this.setState({
      players: players,
    });
  };

  render() {
    const boxStyle = (text) => {
      return { background: text ? 'lightgrey' : 'transparent' };
    };

    return (
      <div id='naba'>
        <label>
          Player 1: 
          <input
            type="text"
            value={this.state.players[0].name}
            onChange={(event) => this.handleNameChange(0, event)}
          />
        </label>
        <br />
        <label>
          Player 2 : 
          <input
            type="text"
            value={this.state.players[1].name}
            onChange={(event) => this.handleNameChange(1, event)}
          />
        </label>
        <br />
        <div className="score-container">
          <div className="score">{this.state.players[0].score}</div>
          <div>
            <div className="court-row">
              <div className="box" style={boxStyle(this.state.players[0].name)}>
                {this.state.players[0].name}
              </div>
              <div className="box" style={boxStyle(this.state.players[1].name)}>
                {this.state.players[1].name}
              </div>
            </div>
          </div>
          <div className="score">{this.state.players[1].score}</div>
        </div>
      </div>
    );
  }
}

export default App;

import React from "react";
import { connect } from "react-redux";
import { Route, Routes } from 'react-router';
import { HashRouter } from "react-router-dom";
import './App.css';
import Home from './Elements/home';
import { getGameType, mapDispatchToProp, mapStoreToProp, untrackedGameData } from './management/data';
import Game, { gameStates } from './management/game';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.restoreState();
    window.notifyStatus = () => { window.activity.trackStatus(this.props.store?.status) };
  }
  render() {
    return (
      <HashRouter>
        <Routes>
            <Route index element={<Home />}></Route>
            <Route path='game' element={
              <Game gameType={getGameType()} saveState={this.saveState} />
            }>
            </Route>
        </Routes>
      </HashRouter>
    )
  }

  saveState = () => {
    if (this.props.store?.status === gameStates.gamePaused) {
      let state = {};
      state.url = document.URL
      state.store = this.props.store;
      let ball = untrackedGameData.ball;
      if (ball) {
        let pos = ball.getPosition()
        state.ballX = pos.x;
        state.ballY = pos.y;
      }
      window.preferences.setString("saved state", JSON.stringify(state))
    } else throw new Error("game is not paused for making snapshot of the current state.");
  }

  restoreState = () => {
    let stateString = window.preferences.getString("game state")

    if (stateString != null && stateString.length > 0) {
      let state = JSON.parse(stateString)
      document.URL = state.url;
      window.history.go()
      this.props.dispatch(state.store);
      console.log("form app: ", this.props.store)
      untrackedGameData.ball.setPosition(state.ballX, state.ballY);//todo after dispatch
      window.preferences.setString("game state", "");
    }
  }

}
export default connect(mapStoreToProp, mapDispatchToProp)(App);

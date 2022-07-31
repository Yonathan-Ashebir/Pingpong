import React from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { HashRouter } from "react-router-dom";
import { Vector } from "y-lib/LayoutBasics";
import './App.css';
import Home from './Elements/home';
import { getGameType, mapDispatchToProp, mapStoreToProp, untrackedGameData } from './management/data';
import Game, { gameStates } from './management/game';


class App extends React.Component {
  constructor(props) {
    super(props);
    window.notifyStatus = () => { window.activity.trackStatus(this.props.store?.status) };
    this.state = { firstTime: true, location: null };
    this.restoreState();
  }
  render() {

    return (
      <HashRouter>
        {(this.getFirstTime() && this.state.location) ? <Navigate to={this.state.location} /> : null}
        <Routes>

          <Route index element={<Home />}></Route>
          <Route path='game' element={
            <Game gameType={getGameType()} saveState={this.saveState} clearState={this.clearState} />
          }>
          </Route>
        </Routes>
      </HashRouter>
    )
  }
  getFirstTime = () => {
    if (this.state.firstTime) {
      this.state.firstTime = false;
      return true
    }
  }


  saveState = () => {
    if (this.props.store?.status === gameStates.paused) {
      let state = {};
      let container = {};
      <GetCurrentLocation container={container} />
      state.location = container.location  //saving location

      state.store = this.props.store; //saving store
      let ball = untrackedGameData.ball;
      if (ball) {
        state.ballState = ball.state; //saving ball state

        /* saving none state values */
        state.vx = ball.getVelocity().getX();
        state.vy = ball.getVelocity().getY();
      }
      window.preferences.setString("saved_state", JSON.stringify(state))
    } else throw new Error("game is not paused for making snapshot of the current state.");
  }


  restoreState = () => {
    let stateString = window.preferences.getString("saved_state")

    if (typeof stateString === "string" && stateString.length > 0) {
      let state = JSON.parse(stateString)
      this.state.location = state.location;//restoring location
      this.props.dispatch({ type: "share", payload: { ...(state.store), groundDimension: document.body.getBoundingClientRect() } });//restoring state, updating values needing to be updated


      Promise.resolve().then(() => new Promise(resolve => {
        let { ball } = untrackedGameData
  
        //restoring ball state
        ball.setState(state.ballState, () => {
          ball.setVelocity(new Vector(state.vx, state.vy)) //restoring non state value
          ball.rescalePosition()
        });

        resolve();
      }))

      this.clearState()//clearing up
    }
  }
  clearState = () => {
    window.preferences.setString("game state", "")
  }

}
function GetCurrentLocation({ container }) {
  let loc = useLocation()
  container.location = loc;
  return null
}
export default connect(mapStoreToProp, mapDispatchToProp)(App);

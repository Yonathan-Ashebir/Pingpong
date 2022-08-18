import { minWidth } from "@mui/system";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { HashRouter } from "react-router-dom";
import { Vector } from "y-lib/LayoutBasics";
import './App.css';
import Home from './Elements/home';
import { getGameType, mapDispatchToProp, mapStoreToProp, untrackedGameData } from './management/data';
import Game, { gameStates } from './management/game';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { location: null, path: "/" }
    this.restoreState();
    window.notifyStatus = () => { window.activity.trackStatus(this.props.store?.status) };
  }
  render() {

    return (
      <HashRouter>{/* imp: weird bug! I was forced to create custom navigator, router's kept rerendering itself after the first call*/}
        <Navigator to={this.state.path} />
        <Routes>
          <Route index element={<Home navigateAbsoluteTo={this.navigateAbsoluteTo} />}></Route>
          <Route path='game' element={
            <Game gameType={getGameType()} navigateAbsoluteTo={this.navigateAbsoluteTo} saveState={this.saveState} clearState={this.clearState} />
          }>
          </Route>
        </Routes>
      </HashRouter>
    )
  }



  saveState = () => {
    if (this.props.store?.status === gameStates.paused) {
      let data = {};

      data.location = this.getLocation() //saving location
      data.store = this.props.store; //saving store
      window.preferences.setString("game_data", JSON.stringify(data))
    } else throw new Error("> game is not paused for making snapshot of the current state.");
  }

  restoreState = () => {
    let dataString = window.preferences.getString("game_data")

    if (typeof dataString === "string" && dataString.length > 0) {-d
      let data = JSON.parse(dataString)
      this.state.path = data.location;//restoring location
      this.props.dispatch({ type: "share", payload: { ...(data.store), groundDimension: undefined, restoredStateCode: 0 } });//restoring state, updating values needing to be updated
      this.clearState()//clearing up
    }
  }
  clearState = () => {
    window.preferences.setString("game_data", "")
  }
  navigateAbsoluteTo = (path) => {
    this.setState({ path: path })
  }

  getLocation = () => {
    let container = {};
    <GetCurrentLocation container={container} />
    return container.location;
  }
}
function GetCurrentLocation({ container }) {
  let loc = useLocation()
  container.location = loc;
  return null
}
function Navigator({ to }) {
  if (typeof to !== "string") return;
  let goTo = useNavigate();
  useEffect(() => goTo(to),[to]);
  return null

}

export default connect(mapStoreToProp, mapDispatchToProp)(App);

import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Route, Routes, useNavigate} from 'react-router';
import './App.css';
import Home from './Elements/home';
import {getGameType, mapDispatchToProp, mapStoreToProp} from './management/data';
import Game, {gameStates} from './management/game';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { location: null, path: "/" }
    try {
      let dataString = window.preferences.getString("game_data")
      if (typeof dataString === "string" && dataString.length > 0) {
        let data = JSON.parse(dataString)
        this.props.dispatch({ type: "share", payload: { ...(data.store), groundDimensions: undefined, restoredStateCode: 1 } });//restoring state, updating values needing to be updated
        Promise.resolve().then(() => this.navigateAbsoluteTo(data.path))
        this.clearState()//clearing up
      } else {
        this.props.dispatch({ type: "share", payload: { restoredStateCode: -1 } })
      }
    }
    catch (e) {
      console.error(e);
      this.props.dispatch({ type: "share", payload: { restoredStateCode: -1 } })
    }
    window.notifyStatus = () => { window.activity.trackStatus(this.props.store?.status) };
    window.app = this

  }
  render() {

    return (
      <>
        {/* imp: weird bug! I was forced to create custom navigator, router's kept rerendering itself after the first call*/}
        <Navigator to={this.state.path} />
        <Routes>
          <Route index element={<Home navigateAbsoluteTo={this.navigateAbsoluteTo} />}></Route>
          <Route path='game' element={
            <Game gameType={getGameType()} navigateAbsoluteTo={this.navigateAbsoluteTo} saveState={this.saveState} clearState={this.clearState} />
          }>
          </Route>
        </Routes>
      </>
    )
  }



  saveState = () => {
    if (this.props.store?.status === gameStates.paused) {
      let data = {};

      data.path = this.state.path //imp: wished for native method
      data.store = this.props.store; //saving store
      window.preferences.setString("game_data", JSON.stringify(data))
    } else throw new Error("> game is not paused for making snapshot of the current state.");
  }


  clearState = () => {
    window.preferences.setString("game_data", "")
  }
  navigateAbsoluteTo = (path) => {
    this.setState({ path: path })
  }
}

function Navigator({ to }) {
  if (typeof to !== "string") return;
  let goTo = useNavigate();
  useEffect(() => goTo(to), [to]);
  return null

}

export default connect(mapStoreToProp, mapDispatchToProp)(App);

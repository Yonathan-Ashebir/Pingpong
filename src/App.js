import { Provider } from "react-redux";
import { Route, Routes } from 'react-router';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import { Home } from './Elements/home';
import "./fonts/material-icons.css";
import { getGameType, getStore } from './management/data';
import Game from './management/game';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path='/game' element={
          <Provider store={getStore()} >
            <Game gameType={getGameType()} />
          </Provider>
        }>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App;

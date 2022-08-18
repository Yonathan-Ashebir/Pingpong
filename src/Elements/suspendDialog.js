import { Button } from "@mui/material"
import { useSelector } from "react-redux"
import { untrackedGameData } from "../management/data"
export default function Suspend(props) {
    let {game} = untrackedGameData
    return (
        <div className="suspend-dialog">
            <Button variant="contained" color="primary" onClick={game.resumeGame}><span className="material-icons">play_arrow</span>&nbsp;Resume</Button>
            <div style={{height:10}}></div>
            <Button variant="contained" color="primary" onClick={game.restartNewGame}><span className="material-icons">replay</span>&nbsp;Restart</Button>    
            <Button variant="contained" color="warning" onClick={game.exitGame}><span className="material-icons">close</span>&nbsp;Exit</Button>    
        </div>
    )
}
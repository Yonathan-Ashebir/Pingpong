import { Button, Stack } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import { connect, useSelector } from "react-redux";
import Controls from "../Elements/controls";
import { BigCounter, SmallCounter } from "../Elements/counters";
import FullScreenDialog from "../Elements/fullScreenDialog";
import Ground from "../Elements/ground";
import Suspend from "../Elements/suspendDialog";
import TwoFactionsBar from "../Elements/twoFactionsBar";
import { WinnerDialog } from "../Elements/winnerDialog";
import {Navigate} from "react-router"
import { DEFAUlT_GAME_STARTED_MESSAGE, gameTypes, getAppreciationMessage, getInitialVelocity, getMaximumVelocity, getTargetLead, getTargetScore, getGameDurationSeconds, getVelocityRefreshTimeSeconds, mapDispatchToProp, mapStoreToProp, untrackedGameData, getMaximumDurationSeconds } from "./data";

export const gameStates={launched:0,gameStarting:1,roundStarting:2,roundStarted:3,pausing:4,paused:5,resuming:6,finished:7}
class Game extends React.Component {
    constructor(props) {
        super(props);
        untrackedGameData.game = this;
        this.state = { lastMonitorTimeSeconds: null }
    }

    render() {
        // setTimeout(() => { window.mStore = this.props.store; window.untracked = untrackedGameData }, 100) //todo
        let status = this.props.store?.status, winnerName = this.props.store?.winnerName, score = this.props.store?.score
        if(status==="exiting")return (<Navigate to="/"></Navigate>)
        let scoreDisplay, buttons;
        if (status === gameStates.finished) {
            let countDoneStyle = {
                animation: "small-counter-anim 800ms ease-out 10ms",
            }
            scoreDisplay = (
                <div className="score-container">
                    <SmallCounter from={0} to={score.red} countDoneStyle={{ ...countDoneStyle, color: "red" }} timePerDigit={200} />
                    <TwoFactionsBar className="score-bar" factionOne={score.red} factionTwo={score.blue} />
                    <SmallCounter from={0} to={score.blue} countDoneStyle={{ ...countDoneStyle, color: "blue" }} timePerDigit={200} />
                </div>
            )
            buttons = <Stack orientation="horizontal" spacing={2} >
                  <Button style={{ marginTop: "10mm" }} variant="contained" color="primary" onClick={this.startNewGame}><span className="material-icons">replay</span>&nbsp;Restart</Button>
                <Button style={{ marginTop: "10mm" }} variant="contained" color="warning" onClick={this.exitGame}><span className="material-icons">close</span>&nbsp;Exit</Button>
                </Stack>
        }

        return (
            <>
                <Ground gameType={this.props.gameType} />
                <Controls gameType={this.props.gameType} />
                <FullScreenDialog show={status === gameStates.launched || status === gameStates.finished} transitionInDuration={60} transitionOutDuration={400}>
                    {(status === gameStates.launched) ? (
                        <BigCounter from={3} to={0} message={DEFAUlT_GAME_STARTED_MESSAGE} onComplete={this.startGame} timePerDigit={800}></BigCounter>
                    ) : null}
                    {(status === gameStates.finished) ? (
                        <WinnerDialog winner={

                            (score.red === score.blue) ? (<span style={{ color: "green" }} className="winner-name">{"A TIE"}</span>) : (<span style={{ color: (score.red > score.blue) ? "red" : "blue" }} className="winner-name">{(winnerName) ? winnerName : "winner name"}</span>)

                        } score={scoreDisplay} message={(score.red == score.blue) ? getAppreciationMessage() : "WINS"} others={buttons}></WinnerDialog>
                    ) : null}
                </FullScreenDialog>
                <Buttons />
            </>
        );
    }
    componentDidMount() {
        this.trackGroundSize();
        document.body.onresize = this.trackGroundSize;
        this.props.dispatch({ type: "share", payload: { status: gameStates.launched } })
    }
    componentDidUpdate() {

    }
    gameFinished = () => {
        let { score } = this.props.store
        this.props.dispatch({ type: "share", payload: { status: gameStates.finished, winnerName: (score.red > score.blue) ? "RED" : "BLUE" } });
    }

    startNewGame = () => {
        if (this.props.store.status === gameStates.paused || this.props.store.status === gameStates.finished)
        this.props.dispatch({ type: "share", payload: { status: gameStates.launched } })
    }
    startGame = () => {
        if (!(this.props.store.status === gameStates.launched || this.props.store.status === gameStates.paused || this.props.store.status === gameStates.finished)) return;
        let target = (this.props.gameType === gameTypes.SCORE) ? getTargetScore() : (this.props.gameType === gameTypes.LEAD_BY) ? getTargetLead() : null;
        this.props.dispatch({ type: "share", payload: {status:gameStates.gameStarting, gameStartTime: new Date().getTime(), score: { blue: 0, red: 0, target: target }, gameTotalDurationSeconds: (this.props.gameType === gameTypes.TIME_OUT) ? getGameDurationSeconds() : getMaximumDurationSeconds() } });
        this.startRound();
        setTimeout(this.monitor, 100);
    }

    pauseGame = () => {
        if (!(this.props.store.status === gameStates.roundStarted)) return;
        let currentTime = new Date().getTime()
        let gameTime = currentTime - this.props.store.gameStartTime;
        let roundTime = currentTime - this.props.store.roundStartTime;
        this.props.dispatch({ type: "share", payload: { gameTime: gameTime, roundTime: roundTime, status: gameStates.pausing, gameStartTime: undefined, roundStartTime: undefined } })
        setTimeout(() => this.props.dispatch({ type: "share", payload: { status: gameStates.paused } }), 10)
    }

    resumeGame = () => {
        if (!(this.props.store.status === gameStates.paused)) return;
        let currentTime = new Date().getTime()
        let gameStartTime = currentTime - this.props.store.gameTime;
        let roundStartTime = currentTime - this.props.store.roundTime;
        this.state.lastMonitorTimeSeconds = -getVelocityRefreshTimeSeconds();;
        this.props.dispatch({ type: "share", payload: { gameStartTime: gameStartTime, roundStartTime: roundStartTime, gameTime: undefined, roundTime: undefined, status: gameStates.resuming } })
        setTimeout(() => { this.props.dispatch({ type: "share", payload: { gameTimeBeforePause: null, status: gameStates.roundStarted } });  setTimeout(this.monitor, 100)}, 10);

    }

    exitGame = () => {
        this.props.dispatch({ type: "share", payload: { status: "exiting" } })
     }

    updateScoreAndRestart = (score) => {
        this.props.dispatch({ type: "share", payload: { score: { red: Math.round(score.red), blue: Math.round(score.blue), target: this.props.store.score.target } } });
        this.monitor();
        this.restartRound();
    }

    startRound = () => {//todo: some kind of loaded check
        if (!(this.props.store.status === gameStates.roundStarted || this.props.store.status === gameStates.launched )) return;
        this.state.lastMonitorTimeSeconds = -getVelocityRefreshTimeSeconds();
        this.props.dispatch({ type: "share", payload: { roundStartTime: new Date().getTime(), status:gameStates.roundStarting} });
        setTimeout(() => this.props.dispatch({ type: "share", payload: { status: gameStates.roundStarted } }), 10);//todo: another buggy react issue
    }
    restartRound = () => {
        let { ball } = untrackedGameData;
        ball.stop();
        let startRound = this.startRound;
        ball.hide(() => { ball.resetPosition(); ball.show(() => { startRound() }) });
    }

    monitor = () => {
        if (!(this.props.store.status === gameStates.roundStarted)) return;
        clearTimeout(this.state.monitorId)
        console.log("monitoring")
        let { score, gameStartTime, gameTotalDurationSeconds, roundStartTime } = this.props.store;
        if (new Date().getTime() - gameStartTime >= gameTotalDurationSeconds * 1000) {
            this.gameFinished(); return;
        }

        let currentMonitorTimeSeconds = Math.round((new Date().getTime() - roundStartTime) / 1000);
        console.log("current time seconds: ",currentMonitorTimeSeconds)
        let progress;
        let refreshTime = getVelocityRefreshTimeSeconds();
        if (this.props.gameType === gameTypes.SCORE) {
            if (score.red >= score.target || score.blue >= score.target) {
                this.gameFinished(); return;
            }
            if (currentMonitorTimeSeconds - this.state.lastMonitorTimeSeconds > refreshTime) progress = (score.red + score.blue) / (2 * score.target)

        } else if (this.props.gameType === gameTypes.TIME_OUT) {
            if (currentMonitorTimeSeconds - this.state.lastMonitorTimeSeconds > refreshTime) progress = currentMonitorTimeSeconds / gameTotalDurationSeconds;
        }
        else if (this.props.gameType === gameTypes.TIME_OUT) {
            if (Math.abs(score.red - score.blue) >= score.target) {
                this.gameFinished(); return;
            }
            if (currentMonitorTimeSeconds - this.state.lastMonitorTimeSeconds > refreshTime) progress = Math.abs(score.red - score.blue) / score.target
        }
        if (currentMonitorTimeSeconds - this.state.lastMonitorTimeSeconds > refreshTime) {
            this.state.lastMonitorTimeSeconds = currentMonitorTimeSeconds;
            let maxV = getMaximumVelocity(); let initV = getInitialVelocity();
            let vRange = maxV.getR() - initV.getR();
            let maxVR = initV.getR() + (0.6 + 0.2 * progress + 0.2 * Math.random()) * vRange;
            let vR = (currentMonitorTimeSeconds ** 1.2 / 60 ** 1.2) * (maxVR - initV.getR()) + initV.getR();
            console.log("vR: ", vR, "maxVR:", maxV.getR())
            untrackedGameData.ball.getVelocity().setR(vR)

        }
        this.state.monitorId = setTimeout(this.monitor, 800);
    }

    checkBall = () => {
        let { topRacket, bottomRacket, ground, ball } = untrackedGameData;
        topRacket.checkBall(ball);
        bottomRacket.checkBall(ball);
        ground.checkBall(ball);
    }
    trackGroundSize = () => {
        let dimen = untrackedGameData.ground.getDimensions()
        if (dimen) {
            this.props.dispatch({ type: "share", payload: { groundDimensions: dimen } })
        }
    }

}
function Buttons(props) {
    let { game } = untrackedGameData
    let buttons = []
    for (let key in game) {
        if (typeof game[key] === "function") {
            buttons.push(<button key={key} onClick={game[key]}>
                {key}
            </button>)
        }
    }

    return (
        <div style={{ position: "absolute", bottom: "2px" }}>
            {buttons}
        </div>
    )
}

export default connect(mapStoreToProp, mapDispatchToProp)(Game);
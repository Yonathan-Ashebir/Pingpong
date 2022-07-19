import { Button, CircularProgress } from "@mui/material";
import $ from "jquery";
import React from "react";
import { connect } from "react-redux";
import { gameTypes, mapDispatchToProp, mapStoreToProp, untrackedGameData } from "../management/data";
import { gameStates } from "../management/game";
class Controls extends React.Component {
    constructor(props) {
        super(props)
        untrackedGameData.controls = this;
        this.state = { visible: false, hideTimeoutId: undefined }
    }
    render() {
        let style = {}
        let score = { blue: 0, red: 0, target: 0 }
        if (this.props.store && this.props.store.score) { score = this.props.store.score }
        return (
            <div style={{}} id="controls" ref={(el) => this.element = el}>
                {
                    (this.props.gameType === gameTypes.SCORE) ? (
                        <>
                            <div className="scoreDisplay">
                                <CircularProgress variant="determinate" value={score.blue / score.target * 100} about="player 1" color="primary" className="scoreDisplay"></CircularProgress>
                                <p>{score.blue}</p>
                            </div>
                            <GameTimer gameType={this.props.gameType} />
                            <div className="scoreDisplay">
                                <CircularProgress variant="determinate" value={score.red / score.target * 100} about="player 1" color="warning" className="scoreDisplay">55</CircularProgress>
                                <p>{score.red}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <GameTimer />
                            <progress style={{ width: "50%" }} color={(score.blue > score.red) ? "blue" : "orange"} value={Math.abs(score.blue - score.red) / score.target}></progress>
                        </>

                    )
                }

            </div>
        );
    }
    componentDidUpdate() {
        if (this.props.store?.status === gameStates.roundStarting) {
            this._showAndHide();
        }
        if (this.props.store?.status === gameStates.resuming) {
            this._hide();
        }
        if (this.props.store?.status === gameStates.pausing) {
            this._show();
        }
    }

    toggle = () => {
        if (this.props.store?.status === gameStates.roundStarted) {
            this._toggle()
        }
    }

    _showAndHide = () => {
        if (this.state.hideTimeoutId !== undefined) clearTimeout(this.state.hideTimeoutId)
        this._show()
        this.state.hideTimeoutId = setTimeout(this._hide, 2500)
    }

    show = () => {
        if (this.props.store?.status === gameStates.roundStarted) this._show();
    }

    hide = () => {
        if (this.props.store?.status === gameStates.roundStarted) this._hide();
    }


    _toggle = () => {
        if (this.state.visible) this.hide(); else this._showAndHide();
    }

    _show = () => {
        if (this.state.hideTimeoutId !== undefined) clearTimeout(this.state.hideTimeoutId)
        $(this.element).removeClass("hiding").addClass("shown")
        this.state.visible = true;
    }

    _hide = () => {
        let $element = $(this.element).removeClass("shown").addClass("hiding")
        setTimeout((() => { $element.removeClass("hiding") }), 300)
        this.state.visible = false;
    }
}
class _GameTimer extends React.Component {
    constructor(props) {
        super(props)
        this.state = { time: 0, timerClassName: "visible", pauseClassName: "" }
    }
    render() {
        if (!this.props.store || !this.props.store.gameStartTime || this.props.store.status === gameStates.launched||this.props.store.status===gameStates.gameStarting) return (<p className="game-timer">{this.state.time}</p>);
        let { gameStartTime, status, gameTotalDurationSeconds } = this.props.store
        this.state.time = Math.round((new Date().getTime() - gameStartTime) / 1000)
        if (Math.floor(this.state.time / 3) % 2 == 0 || (this.props.gameType === gameTypes.TIME_OUT && gameTotalDurationSeconds - this.state.time < 10)) {
            this.state.timeClassName = "visible"
            this.state.pauseClassName = ""
        } else {
            this.state.timeClassName = ""
            this.state.pauseClassName = "visible"
        }
        if (status === gameStates.roundStarted) {
            let refresh = (() => this.forceUpdate()).bind(this)
            setTimeout(refresh, 1000)
        }
        if (this.props.gameType === gameTypes.TIME_OUT) this.state.time = Math.round(gameTotalDurationSeconds - this.state.time);
        if (this.state.time < 0) this.state.time = 0;
        return (
            <Button variant="text" color="info" onClick={untrackedGameData.game.pauseGame} id="game-timer-container">
                <span id="game-timer" style={{ position: "relative", height: "fit-content" }} className={status === gameStates.roundStarted ? "active" : ""}>
                    <span className={this.state.timeClassName} style={{ fontSize: "6mm" }}>{this.state.time}</span>
                    <span className={this.state.pauseClassName + " centered material-icons"} style={{ fontSize: "12mm" }}>pause_circle</span>
                </span>
            </Button>
        )
    }
}


const GameTimer = connect(mapStoreToProp, mapDispatchToProp)(_GameTimer)

export default connect(mapStoreToProp, mapDispatchToProp)(Controls)

import React from "react";
import { connect } from "react-redux";
import "../css/game.css";
import { mapDispatchToProp, mapStoreToProp, Player, untrackedGameData } from "../management/data";
import { gameStates } from "../management/game";
import Ball from "./ball";
import FullScreenDialog from "./fullScreenDialog";
import { PlayerField } from "./playerField";
import Suspend from "./suspendDialog";
class Ground extends React.Component {
    constructor(params) {
        super(params);
        this.state = {}
        untrackedGameData.ground = this;
    }
    render() {
        let status = this.props.store?.status
        return (
            <div id="ground" ref={(el) => this.element = el} onClick={() => untrackedGameData.controls.toggle()}>
                <Player.Provider value={{}}>
                    <PlayerField position={"top"} />
                </Player.Provider>
                <Player.Provider value={{}}>
                    <PlayerField position={"bottom"} />
                </Player.Provider>
                <Ball></Ball>
                <FullScreenDialog transitionDuration={400} show={(status === gameStates.pausing|| status === gameStates.paused)}>
                    <Suspend />
                </FullScreenDialog>
            </div>)
    }
    componentDidMount() {
        this.element.onresize = untrackedGameData.game.trackGroundSize
    }

    checkBall = (ball) => {
        let rect = this.props.store.groundDimensions;
        let pos = ball.getCenter()
        if (pos.x - ball.getRadius() < rect.left) ball.getVelocity().setX(Math.abs(ball.getVelocity().getX()));
        else if (pos.x + ball.getRadius() > rect.right) ball.getVelocity().setX(Math.abs(ball.getVelocity().getX()) * -1);
        let { score } = this.props.store
        if (pos.y - ball.getRadius() < rect.top) untrackedGameData.game.updateScoreAndRestart({ red: score.red, blue: score.blue + 1 })
        else if (pos.y + ball.getRadius() > rect.bottom) untrackedGameData.game.updateScoreAndRestart({ red: score.red + 1, blue: score.blue })

    }
    getDimensions = () => {
        return this.element?.getBoundingClientRect()
    }
}
export default connect(mapStoreToProp, mapDispatchToProp)(Ground)
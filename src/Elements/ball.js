import anime from "animejs";
import React from "react";
import { connect } from "react-redux";
import { } from "redux";
import toPX from "to-px";
import { Vector } from "y-lib/LayoutBasics";
import { DEFAULT_BALL_RADIUS, getInitialVelocity, mapDispatchToProp, mapStoreToProp, untrackedGameData } from "../management/data";
import { gameStates } from "../management/game";
//Kept as simple as possible for render issues
class Ball extends React.Component {
    constructor(props) {
        super(props)
        this.state = { radius: DEFAULT_BALL_RADIUS }
        this.velocity = new Vector();
        this.untrackedData = { roundCount: -1, restoredStateCode: -1, shouldMove: false, posX: 0, posY: 0, defaultX: 0, defaultY: 0, lastTimePositioned: -1 };
        untrackedGameData.ball = this;
    }
    render() {
        this.adjustPosition();
        let radiusMM = this.state.radius / toPX('mm')
        let style = { height: radiusMM * 2 + "mm", width: radiusMM * 2 + "mm" }
        return (
            <div id="ball" ref={(element) => { this.element = element }} style={style}>
            </div>
        )
    }
    componentDidUpdate() {
        if (this.props.store?.restoredStateCode && this.props.store?.restoredStateCode !== this.untrackedData.restoredStateCode) {
            let data = window.preferences?.getString("ball_data")
            if (typeof data === "string" && data.length > 0) {
                this.untrackedData = data.untrackedData;
                this.setState(data.state, () => {
                    this.setVelocity(new Vector(data.vx, data.vy)) //restoring non state value
                    this.rescalePosition()
                    window.preferences?.setString("ball_data", "")
                });
            }
            this.untrackedData.restoredStateCode = this.props.store?.restoredStateCode
        }
        if (this.untrackedData.state !== this.props.store?.status || this.untrackedData.roundCount !== this.props.store?.roundCount) {
            switch (this.props.store?.status) {
                case gameStates.roundStarted: {
                    if (this.untrackedData.state === gameStates.paused) {
                        setTimeout(() => this.move(), 500);
                        this.show();
                    } else {
                        this.resetPosition();
                        let v = getInitialVelocity()
                        v = new Vector(v.getR())
                        let rad = (Math.random() * 2 - 1) * (Math.PI - 1.2)
                        v.rotate(rad + Math.sign(rad) * (0.6))
                        this.setVelocity(v)
                        this.move();
                        this.show();
                    }
                    break
                } case gameStates.paused: {
                    this.stop();
                    let data = {}
                    data.state = this.state; //saving ball state
                    data.untrackedData = this.untrackedData;
                    /* saving none state values */
                    data.vx = this.getVelocity().getX();
                    data.vy = this.getVelocity().getY();
                    window.preferences?.setString("ball_data", JSON.stringify(data))
                    break;

                }
                case gameStates.finished: {
                    this.stop();
                    break;
                }
            }

        }

        this.untrackedData.state = this.props.store?.status;
        this.untrackedData.roundCount = this.props.store?.roundCount;
    }
    componentDidMount() {
    }
    setVelocity = (velocity) => {
        this.velocity = velocity;
    }
    getVelocity = () => {
        return this.velocity;
    }
    setCenter = (x, y) => {
        if (typeof x == "number") this.untrackedData.posX = x;
        if (typeof y == "number") this.untrackedData.posY = y;
        this.position();
    }
    resetPosition = () => {
        let { groundDimensions } = this.props.store
        this.setCenter(groundDimensions.width / 2, groundDimensions.height / 2);
        this.untrackedData.defaultX = this.untrackedData.posX; this.untrackedData.defaultY = this.untrackedData.posY;
        this.setCenter(this.untrackedData.defaultX, this.untrackedData.defaultY);

    }
    adjustPosition = () => {
        if (this.props.store?.groundDimensions) {
            let dimen = this.props.store.groundDimensions;

            if (this.untrackedData.defaultX && this.untrackedData.defaultY) {
                let fx = dimen.width / 2 / this.untrackedData.defaultX
                let fy = dimen.height / 2 / this.untrackedData.defaultY
                this.untrackedData.posX *= fx;
                this.untrackedData.posY *= fy;
                this.untrackedData.defaultX = dimen.width / 2;
                this.untrackedData.defaultY = dimen.height / 2;
            } else {
                this.resetPosition();
            }

            this.position()
        }
    }
    getCenter = () => {
        return { x: this.untrackedData.posX, y: this.untrackedData.posY }
    }
    setRadius = (r) => {
        this.setState({ radius: r })
    }
    getRadius = () => {
        return this.state.radius
    }
    move = () => {
        this.untrackedData.shouldMove = true;
        this.untrackedData.lastTimePositioned = new Date().getTime();
        requestAnimationFrame(this.motionLoop)
    }
    stop = () => {
        this.untrackedData.shouldMove = false;
    }
    motionLoop = () => {
        if (!this.untrackedData.shouldMove) return;
        let newTime = new Date().getTime(), interval = newTime - this.untrackedData.lastTimePositioned;
        this.untrackedData.posX = this.untrackedData.posX + this.velocity.getX() * interval;
        this.untrackedData.posY = this.untrackedData.posY + this.velocity.getY() * interval;
        this.position();
        this.untrackedData.lastTimePositioned = newTime;
        untrackedGameData.game.checkBall(this)
        requestAnimationFrame(this.motionLoop)
    }
    position = () => {//weird bug
        if (this.element) this.element.style.transform = "translate(" + (this.untrackedData.posX - this.getRadius()) + "px, " + (this.untrackedData.posY - this.getRadius()) + "px)"
    }
    hide = (onComplete) => {
        anime({ targets: this.element, scale: { duration: 300, value: 0.3, easing: "easeOutQuad" }, opacity: { duration: 200, delay: 100, value: 0 } }).complete = onComplete;
    }
    show = (onComplete) => {
        anime({ targets: this.element, scale: { duration: 300, value: 1, easing: "easeOutQuad", delay: 100 }, opacity: { duration: 200, value: 1 } }).complete = onComplete;
    }

}
export default connect(mapStoreToProp, mapDispatchToProp)(Ball);
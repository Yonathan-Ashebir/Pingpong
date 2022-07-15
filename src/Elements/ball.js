import { fontSize } from "@mui/system";
import anime from "animejs";
import $ from "jquery";
import React from "react";
import { connect } from "react-redux";
import { } from "redux";
import toPX from "to-px";
import { Vector } from "y-lib/LayoutBasics";
import { DEFAULT_BALL_RADIUS, DEFAULT_BALL_TRANSFORM, getInitialVelocity, mapDispatchToProp, mapStoreToProp, untrackedGameData } from "../management/data";
import { gameStates } from "../management/game";
//Kept as simple as possible for render issues
class Ball extends React.Component {
    constructor(props) {
        super(props)
        this.state = { shouldMove: false, radius: DEFAULT_BALL_RADIUS, velocity: new Vector(), defaultX: undefined, defaultY: undefined, lastTimePositioned: -1 }
        untrackedGameData.ball = this;
    }
    render() {
        let radiusMM = this.state.radius / toPX('mm')
        let style = { height: radiusMM * 2 + "mm", width: radiusMM * 2 + "mm" }
        return (
            <div id="ball" ref={(element) => { this.element = element }} style={style}>
            </div>
        )
    }
    componentDidUpdate() {
        switch (this.props.store?.status) {
            case gameStates.roundStarting: {
                this.resetPosition();
                let v = getInitialVelocity()
                v = new Vector(v.getR())
                let rad = (Math.random() * 2 - 1) * (Math.PI - 1.2)
                v.rotate(rad + Math.sign(rad) * (0.6))
                this.setVelocity(v)
                this.move(); break
            } case gameStates.pausing: {
                this.stop(); break
            } case gameStates.resuming: {
                this.state.lastTimePositioned = new Date().getTime() + 10;//todo: correction
                this.move(); break
            }
            case gameStates.finished: {
                this.stop();
                break;
            }
        }
        this.rescalePosition();
    }
    setVelocity = (velocity) => {
        this.state.velocity.setX(velocity.getX());
        this.state.velocity.setY(velocity.getY())
    }
    getVelocity = () => {
        return this.state.velocity
    }
    setCenter = (x, y) => {
        if (typeof x == "number") this.state.posX = x;
        if (typeof y == "number") this.state.posY = y
    }
    resetPosition = () => {
        if (this.element && this.props.store.groundDimensions) {
            let $element = $(this.element)
            let { groundDimensions } = this.props.store
            this.setCenter(groundDimensions.width / 2, groundDimensions.height / 2);
            this.state.defaultX = this.state.posX; this.state.defaultY = this.state.posY;
            this.setCenter(this.state.defaultX, this.state.defaultY);
            $element.css("top", "0px").css("left", "0px");
            this.position()
        }
    }
    rescalePosition = () => {
        if (this.props.store.groundDimensions) {
            let dimen = this.props.store.groundDimensions
            let fx = dimen.width / 2 / this.state.defaultX
            let fy = dimen.height / 2 / this.state.defaultY
            this.state.defaultX *= fx;
            this.state.defaultY *= fy;
            this.state.posX *= fx;
            this.state.posY *= fy;
        }
    }
    getCenter = () => {
        return { x: this.state.posX, y: this.state.posY }
    }
    setRadius = (r) => {
        this.setState({ radius: r })
    }
    getRadius = () => {
        return this.state.radius
    }
    move = () => {
        this.state.shouldMove = true;
        this.state.lastTimePositioned = new Date().getTime();
        requestAnimationFrame(this.motionLoop)
    }
    stop = () => {
        this.state.shouldMove = false;
    }
    motionLoop = () => {
        if (!this.state.shouldMove) return;
        let newTime = new Date().getTime(), interval = newTime - this.state.lastTimePositioned;
        this.state.posX = this.state.posX + this.state.velocity.getX() * interval;
        this.state.posY = this.state.posY + this.state.velocity.getY() * interval;
        this.position();
        this.state.lastTimePositioned = newTime;
        untrackedGameData.game.checkBall(this)
        requestAnimationFrame(this.motionLoop)
    }
    position = () => {
        this.element.style.transform = "translate(" + (this.state.posX - this.getRadius()) + "px, " + (this.state.posY - this.getRadius()) + "px)"
    }
    hide = (onComplete) => {
        anime({ targets: this.element, scale: { duration: 300, value: [1, 0.3], easing: "easeOutQuad" }, opacity: { duration: 200, delay: 200, value: [1, 0] } }).complete = onComplete;
    }
    show = (onComplete) => {
        anime({ targets: this.element, scale: { duration: 300, value: [0.3, 1], easing: "easeOutQuad", delay: 100 }, opacity: { duration: 200, value: [0, 1] } }).complete = onComplete;
    }

}
export default connect(mapStoreToProp, mapDispatchToProp)(Ball);
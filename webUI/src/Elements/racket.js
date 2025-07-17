import $ from "jquery";
import React from "react";
import { connect } from "react-redux";
import toPX from "to-px";
import { LineSegment, Point } from "../utils/LayoutBasics";
import { getCoordinatesFromParameters } from "../utils/LayoutBasics";
import {
    DEFAULT_RACKET_LENGTH,
    DEFAULT_RACKET_THICKNESS,
    mapDispatchToProp,
    mapStoreToProp,
    Player,
    untrackedGameData
} from "../management/data";

class Racket extends React.Component {
    static contextType = Player;

    constructor(props) {
        super(props);
        this.state = {
            thick: DEFAULT_RACKET_THICKNESS,
            length: DEFAULT_RACKET_LENGTH
        };
        this.untrackedData = {
            touch: null,
            posX: undefined,
            posY: undefined,
            visible: false
        }
        untrackedGameData[this.props.position + "Racket"] = this;
    }

    render() {
        this.context.racket = this;
        let style = {
            height: this.state.thick / toPX('mm') + "mm",
            width: this.state.length / toPX('mm') + "mm",
            borderRadius: this.state.thick / toPX('mm') / 2 + "mm"
        }
        return (<div className={"racket " + this.props.position}
            style={style}
            ref={(el) => { this.element = el }} >

        </div>
        )
    }

    checkBall = (ball) => {
        if (!this.untrackedData.visible) return
        let pos = ball.getCenter()
        let s = this.lineSegment.to(new Point(pos.x, pos.y))
        console.log(s)

        if (ball.getRadius() + this.state.thick / 2 >= s.getR() - 2) {
            let v = ball.getVelocity()
            v.resetComponent(s, 1);
        }
    }
    setLength = (len) => {
        this.setState({ length: len })
    }
    setThickness = (tk) => {
        this.setState({ thick: tk })
        this.context.racketThickness = tk;
    }
    setPosition = (x, y) => {
        if (typeof x === "number") this.untrackedData.posX = x;
        if (typeof y === "number") this.untrackedData.posY = y;
    }
    getPosition = () => {
        return { x: this.untrackedData.posX, y: this.untrackedData.posY }
    }
    getThickness = () => {
        return this.state.thick
    }
    getLength = () => {
        return this.state.length
    }
    followTouch = (ev) => {
        if (this.untrackedData.touch == null) {
            this.untrackedData.touch = this.selectTouch(ev)
            if (this.untrackedData.touch == null) return;
            this.show();
            this.motionLoop()
        } else {
            if ((this.untrackedData.touch = this.getTouchWithIdentifier(this.untrackedData.touch.identifier, ev.touches)) == null) this.untrackedData.touch = this.selectTouch(ev)
            if (this.untrackedData.touch == null) {
                this.hide();
                return
            }
        }
        if (ev.type === "touchend" || ev.type === "touchcancel") {
            this.untrackedData.touch = null;
            this.hide();
            return
        }

        //Assertion: from now on touch is active with status move or start
        let { pageX, pageY } = this.untrackedData.touch;
        this.setPosition(pageX, pageY)


    }

    show = () => {
        this.untrackedData.visible = true;
        $(this.element).css("opacity", 1)
        this.position()
    }

    hide = () => {
        this.untrackedData.visible = false;
        $(this.element).css("opacity", 0)
        this.position()
    }
    /* *Selects the best touch. i.e. a touch
    - the first changed touch if the event is of type start or move
    - the first unchanged touch otherwise.*/
    selectTouch = (ev) => {
        if (ev.type === "touchstart" || ev.type === "touchmove") {
            return ev.changedTouches.item(0)
        } else {
            return ev.touches.item(0)
        }
    }

    getTouchWithIdentifier(id, list) {
        for (let ind = 0; ind < list.length; ind++) {
            const touch = list[ind];
            if (touch.identifier === id) return touch;
        }
    }

    motionLoop = () => {
        if (this.untrackedData.visible) {
            this.position()
            requestAnimationFrame(this.motionLoop)
        }
    }
    position = () => {
        let bound = this.props.bound
        let left = this.untrackedData.posX - this.element.offsetWidth / 2,
            top = this.untrackedData.posY - this.element.offsetHeight / 2;
        let pos = getCoordinatesFromParameters({
            height: this.element.offsetHeight,
            width: this.element.offsetWidth,
            x: left,
            y: top,
            bound: bound
        })

        this.element.style.transform = `translate(${pos.x - bound.left}px, ${pos.y - bound.top}px) scale(${this.untrackedData.visible ? "1" : "0.7"})`

        let r = this.state.thick / 2
        if (!this.lineSegment) {
            this.lineSegment = new LineSegment(new Point(pos.x + r, pos.y + r), new Point(pos.x + this.state.length - r, pos.y + r))
        } else {
            this.lineSegment.getA().setX(pos.x + r).setY(pos.y + r);
            this.lineSegment.getB().setX(pos.x + this.state.length - r).setY(pos.y + r);
        }
    }
}

export default connect(mapStoreToProp, mapDispatchToProp)(Racket)
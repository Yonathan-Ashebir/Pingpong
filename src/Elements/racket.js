import $ from "jquery";
import React from "react";
import { connect } from "react-redux";
import toPX from "to-px";
import { getCoordinates, LineSegment, Point } from "y-lib/LayoutBasics";
import { DEFAULT_RACKET_LENGTH, DEFAULT_RACKET_THICKNESS, mapDispatchToProp, mapStoreToProp, Player, untrackedGameData } from "../management/data";
class Racket extends React.Component {
    static contextType = Player;
    constructor(props) {
        super(props);
        this.state = {
            thick: DEFAULT_RACKET_THICKNESS,
            length: DEFAULT_RACKET_LENGTH,
            touch: null, 
            posX: undefined,
            posY: undefined,
            visible: false
        };
        untrackedGameData[this.props.position + "Racket"] = this;
    }

    render() {
        this.context.racket = this;
        let style = { height: this.state.thick / toPX('mm') + "mm", width: this.state.length / toPX('mm') + "mm", borderRadius: this.state.thick / toPX('mm') / 2 + "mm" }
        return (
            <div className={"racket " + this.props.position} style={style} ref={(el) => { this.element = el }}>

            </div >
        )
    }
    componentDidUpdate() {
     this.state.bound = this.element.parentElement.getBoundingClientRect()
    }

    checkBall = (ball) => {
        if (!this.state.visible) return
        let pos = ball.getCenter()
        let s = this.lineSegment.to(new Point(pos.x, pos.y))

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
        if (typeof x === "number") this.state.posX = x;
        if (typeof y === "number") this.state.posY = y;
    }
    getPosition = () => {
        return { x: this.state.posX, y: this.state.posY }
    }
    getThickness = () => {
        return this.state.thick
    }
    getLength = () => {
        return this.state.length
    }
    followTouch = (ev) => {
        if (this.state.touch == null) {
            this.state.touch = this.selectTouch(ev)
            if (this.state.touch == null) return;
            this.show();
            this.motionLoop()
        } else {
            if ((this.state.touch = this.getTouchWithIdentifier(this.state.touch.identifier, ev.touches)) == null) this.state.touch = this.selectTouch(ev)
            if (this.state.touch == null) { this.hide(); return }
        }
        if (ev.type === "touchend" || ev.type === "touchcancel") {
            this.state.touch = null;
            this.hide();
            return
        }

        //Assertion: from now on touch is active with status move or start
        let { pageX, pageY } = this.state.touch;
        this.setPosition(pageX - this.element.offsetWidth / 2, pageY - this.element.offsetHeight / 2)
        

    }

    show = () => { 
        this.state.visible = true;
        $(this.element).addClass("visible")  
    }

    hide = () => {
        this.state.visible = false;
        $(this.element).removeClass("visible")
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
        if (this.state.visible) {
            this.position()
            requestAnimationFrame(this.motionLoop)
        }
    }
    position = () => {
        let bound = this.state.bound
        let pos = getCoordinates(this.element, { x: this.state.posX, y: this.state.posY, bound: bound })
        this.element.style.left = pos.x - bound.left + "px"
        this.element.style.top = pos.y - bound.top + "px"
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
import React from "react";
import toPX from "to-px";
import { DEFAULT_RACKET_THICKNESS, Player } from "../management/data";
import Racket from "./racket";

export class PlayerField extends React.Component {
    constructor(props) {
        super(props)
        this.state = { freedom: 0 }
    }
    render() {
        let style = {  flexDirection: (this.props.position === "top") ? "column" : "column-reverse" }
        let rangeStyle = { height: (this.context.racketThickness) ? this.context.racketThickness : DEFAULT_RACKET_THICKNESS/toPX("mm")+ this.state.freedom + "mm" }
        return (
            <div style={style}
                onTouchStart={(ev) => { this.context.racket?.followTouch(ev) }}
                onTouchMove={(ev) => { this.context.racket?.followTouch(ev) }}
                onTouchEnd={(ev) => { this.context.racket?.followTouch(ev) }}
                onTouchCancel={(ev) => { this.context.racket?.followTouch(ev) }}
                className="player-field">
                <div className="racket-range" style={rangeStyle}>
                    <Racket position={this.props.position} />
                </div>
            </div>
        )
    }
}
PlayerField.contextType = Player;

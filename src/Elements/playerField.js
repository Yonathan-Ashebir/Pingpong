import React from "react";
import { connect } from "react-redux";
import toPX from "to-px";
import { DEFAULT_RACKET_THICKNESS, mapDispatchToProp, mapStoreToProp, Player } from "../management/data";
import Racket from "./racket";

 class PlayerField extends React.Component {
    constructor(props) {
        super(props)
        this.state = { freedom: 0 }
        this.untrackedData = { bound: undefined }
    }
    render() {
        let style = { flexDirection: (this.props.position === "top") ? "column" : "column-reverse" }
        let rangeStyle = { height: ((this.context.racketThickness) ? this.context.racketThickness : DEFAULT_RACKET_THICKNESS / toPX("mm")) + this.state.freedom + "mm" }
        if (this.untrackedData.bound != this.props.store?.groundDimensions) this.untrackedData.bound = this.rangeElement?.getBoundingClientRect()
        return (
            <div style={style} 
                onTouchStart={(ev) => { this.context.racket?.followTouch(ev) }}
                onTouchMove={(ev) => { this.context.racket?.followTouch(ev) }}
                onTouchEnd={(ev) => { this.context.racket?.followTouch(ev) }}
                onTouchCancel={(ev) => { this.context.racket?.followTouch(ev) }}
                className="player-field" >
                <div className="racket-range" style={rangeStyle}ref={(el) => this.rangeElement = el}>
                    <Racket position={this.props.position} bound={this.untrackedData.bound} />
                </div>
            </div >
        )
    }
}
PlayerField.contextType = Player;
export default connect(mapStoreToProp,mapDispatchToProp)(PlayerField)

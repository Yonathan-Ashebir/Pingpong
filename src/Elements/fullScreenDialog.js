import React from "react";
import { Transition } from "react-transition-group";
import "../css/fullscreen-dialog.css";
export default function FullScreenDialog(props) {
    let duration = (props.transitionDuration) ? props.transitionDuration : 400;
    if (props.show && props.transitionInDuration) duration = props.transitionInDuration;
    else if (props.transitionOutDuration) duration = props.transitionOutDuration;
    return (
        <Transition in={props.show} timeout={duration}>
            {(state) => {
                return (<div style={ {...(props.style),transitionDuration: duration + "ms" }} className={`fullscreen-dialog ${state} ${props.className}`} id={props.id} >
            {props.children}
                </div>)
}}
        </Transition >
    )
}
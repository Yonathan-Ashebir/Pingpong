import anime from "animejs";
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../css/counters.css";

export function BigCounter(props) {
    let step = Math.sign(props.to - props.from)
    let [count, setCount] = useState(props.from)
    let [done, setDone] = useState(false)
    let [first,setFirst]= useState(true)
    let countFunc = () => { if (Math.abs(props.to - count - step) < Math.abs(props.to - count)) setCount(count + step) }
    let completeFunc = () => {
        if (props.onComplete) props.onComplete();
    }
    if (!done && count === props.to) {
        setDone(true)
        setTimeout(completeFunc, props.messageTime+500+400)
    }
    if(first){setFirst(false);setTimeout(countFunc);}
    return (
        <SwitchTransition mode="out-in">
            <CSSTransition mountOnEnter={true} key={count} classNames={count !== props.to ? "explode" : "fade-in"} onEntered={countFunc} addEndListener={(node, call) => node.addEventListener("transitionend", call, false)}>
                <span style={props.style} className={`big-counter${props.className ? " "+props.className : ""}${count !== props.to ? " count" : ""}`} id={props.id} >
                    {count !== props.to ? count : props.message ? props.message : ""}
                </span>
            </CSSTransition>
        </SwitchTransition>

    )
}
BigCounter.defaultProps = {
    from: 3,
    to: 0,
    messageTime: 800,
}
export function SmallCounter(props) {
    let [element,setElement] = useState(null);
    let [first,setFirst]= useState(true)
    let counter = <span style={props.style} className={`small-counter ${props.className}`} id={props.id} ref={(el) =>setElement(el)}></span>;
    useEffect(() => {
        if (element&&first) {
            setFirst(false)
            let step = Math.sign(props.to - props.from)
            let loop = Math.abs(props.to - props.from) + 1
            let completeFunc = () => {
                Object.assign(element.style, props.countDoneStyle);
                if (props.onComplete) props.onComplete()
            }
            let anim = anime({ targets: element, innerHTML: [props.from - step, props.to], duration: props.timePerDigit * loop, round: 1, easing: `steps(${loop})` })
            anim.complete = completeFunc
        }
    })
    //todo: props are inheritable but targets are not!
    return counter;
}

SmallCounter.defaultProps = {
    from: 0,
    to: 3,
    timePerDigit: 200,
    countDoneStyle: {},
}
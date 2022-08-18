import proptypes from "proptypes";
import { useEffect, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../css/fade-carousel.css";
/**valid props: 
 ** interval - per display
 ** children - children 
 ** startIndex - 0-based index of the image to be displayed first, default random(if specified) otherwise 0
 ** random - whether to randomize order
   */
export function FadeCarousel(props) {
 
    let [index, setIndex] = useState(props.startIndex ? props.startIndex : props.random ? Math.floor(Math.random() * props.children.length) : 0);
    let [firstTime, setFirstTime] = useState(true);
    let change = () => {
        let ind;
        if (props.random) ind = Math.floor(Math.random() * props.children.length);
        else ind = (index >= props.children.length - 1) ? 0 : (index < 0) ? 0 : index + 1;
        setIndex(ind)
    }
    useEffect(()=>{
        if(firstTime){
            setFirstTime(false)
            setTimeout(change, props.interval ? props.interval : 3000)
        }
    })
    return (
        <SwitchTransition mode="out-in">
            <CSSTransition onEntered={() => { setTimeout(change, props.interval ? props.interval : 3000) }} key={index} classNames="fade-carousel" addEndListener={(node, call) => node.addEventListener('transitionend', (ev) => { if (ev.propertyName === "opacity") call() }, false)}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {props.children[index]}
                </div>
            </CSSTransition>
        </SwitchTransition>
    )
}
FadeCarousel.prototype = {
    interval: proptypes.number,
    children: proptypes.any,
    startIndex: proptypes.number,
    random: proptypes.bool
}
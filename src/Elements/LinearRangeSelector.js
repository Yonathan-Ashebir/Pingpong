import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../css/linear-range-selector.css";  

/**valid props:
 ** initial - the initial index otherwise zero would be used
 ** values - array of values or React.Symbols
 ** onSelect - a callback invoked with triggering click event
 ** inside - whether to display navigation arrows inside the option being displayed
 */
export function LinearRangeSelector(props) {
     
     let [index, setIndex] = useState(typeof props.initial === "number" ? props.initial : 0)
     let [direction, setDirection] = useState("right");
     let next = () => { setDirection("right"); if (index < props.values.length - 1) requestAnimationFrame(()=>setIndex(index + 1)) }
     let previous = () => { setDirection("left"); if (index > 0)  requestAnimationFrame(()=>setIndex(index -1))}
     return (
          <div className="linear-range-selector">
               <div className="change"><IconButton className="material-icons" onClick={previous} disabled={index <= 0}>arrow_left</IconButton></div>
               <div className="optionsDisplay">
                    <SwitchTransition mode="out-in">
                         <CSSTransition key={index} classNames={"move-" + direction + (props.inside ? " inside" : "")} addEndListener={(node, call) =>node.addEventListener('transitionend', (ev)=>{if(ev.propertyName==="transform")call()}, false)}>
                              <div className="option" onClick={((ev)=>props.onSelect(ev,index)).bind(this)}>
                                   <Button >
                                        {props.values[index]}
                                   </Button>
                              </div>
                         </CSSTransition>
                    </SwitchTransition>
               </div>
               <div className="change"><IconButton className="material-icons" onClick={next} disabled={index >= props.values.length - 1}>arrow_right</IconButton></div>
          </div>
     )
}
import anime from "animejs";
import "../css/winner-dialog.css";
export function WinnerDialog(props) {
    let context = {}
    let dialog = (
        <div className="winner-dialog">
            {props.winner}
            <p className="wins-message">{props.message ? props.message : "WINS!"}</p>
            <div ref={((el) => context.score = el).bind(context)}>{props.score ? (<small className="score-label">score:</small>) : null}
                {props.score}</div>
            <div ref={((el) => context.others = el).bind(context)}>  {props.others}</div>
        </div>
    )
    let targets = []; if (context.score) targets.push(context.score); if (context.others) targets.push(context.others);
    anime({ targets: targets, opacity: [0, 1], duration: 200, easing: "easeOutQuad", delay: anime.stagger(300, { start: 1 }) })

    return dialog
}
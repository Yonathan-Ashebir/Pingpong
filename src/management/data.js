import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { Vector } from "y-lib/LayoutBasics";

//global constants
export const gameTypes = { SCORE: 0, LEAD_BY: 1, TIME_OUT: 2 }, DEFAULT_DIFFICULTY = 1, DEFAULT_GAME_TYPE = gameTypes.SCORE



//runtime constants1
export const DEFAULT_RACKET_LENGTH = 75.6, DEFAULT_RACKET_THICKNESS = 30.2, DEFAULT_BALL_RADIUS = 15.1, DEFAULT_BALL_TRANSFORM = "translate(-50%,-50%) ",
    DEFAUlT_GAME_STARTED_MESSAGE = <span style={{ color: "darkgreen", fontWeight: 700, fontFamily: "Graduate", fontSize: "20vw" }}>GO!</span>;


export const Player = React.createContext(null)
function shareReducer(store, action) {
    if (action && action.type === "share") {
        return { ...store, ...(action.payload) }
    } else return store;
}

export function mapStoreToProp(store) {
    return { store: store }
}
export function mapDispatchToProp(dispatch) {
    return { dispatch: dispatch }
}

//runtime getters
export function getStore() {
    let store = configureStore({      //Possible: Alternate use of slices and middleware composers...
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    // Ignore these action types
                    ignoredActions: ['share'],
                    // Ignore these field paths in all actions
                    ignoredActionPaths: ['payload'],
                    // Ignore these paths in the state
                    ignoredPaths: ['groundDimensions'],
                }
            }),
        reducer: shareReducer
    });
    return store;
}
//shared libraries
export const untrackedGameData = {

};
window.untrackedGameData = untrackedGameData
//preference getters
export function getInitialVelocity() {
    let maxV = new Vector(0.2, 0.2);
    let minV = new Vector(0.1, 0.1);
    let change = (maxV.getR() - minV.getR()) * getDifficulty() / 5;
    console.log("to return max velocity")
    return minV.setR(minV.getR() + change);
}
export function getGameType() {
    console.log("to return gameType")
    let type = window.preferences.getInteger("game_type");
    if (!(type >= 0 && type <= 2)) {
        type = gameTypes.SCORE
        setGameType(type)
    };
    return type
}
export function getAppreciationMessage() {
    return "Nice Game!"
}
export function getTargetScore() {
    let target = window.preferences.getInteger("target_score");
    if (!getAllowedTargetScores().includes(target)) {
        target = 5
        setTargetScore(target)
    };
    return target
}
export function getTargetLead() {
    let target = window.preferences.getInteger("target_lead");
    if (!getAllowedTargetLeads().includes(target)) {
        target = 3
        setTargetLead(target)
    };
    return target
}
export function getGameDurationSeconds() {
    let duration = window.preferences.getInteger("game_duration");
    if (!getAllowedGameDurationsSeconds().includes(duration)) {
        duration = 60
        setGameDurationSeconds(duration)
    };
    return duration
}
export function getMaximumDurationSeconds() {
    return 999;
}
export function getMaximumVelocity() {
    let maxV = new Vector(1, 1);
    let minV = getInitialVelocity();
    let change = (maxV.getR() - minV.getR()) * getDifficulty() / 5;
    console.log("to return max velocity")
    return minV.setR(minV.getR() + change/2);
}
export function getVelocityRefreshTimeSeconds() {
    return 10;
}
export function getDifficulty() {
    let gameType = getGameType()
    let suffix = (gameType == gameTypes.TIME_OUT) ? "time_out" : (gameType === gameTypes.LEAD_BY) ? "lead_by" : "score";
    let dif =  window.preferences.getInteger("difficulty_" + suffix);
    if(dif>=1&&dif<=5)return dif;
    return 2;
}
export function getAllowedTargetLeads() {
    return [2, 3, 4, 5]
}
export function getAllowedTargetScores() {
    return [...Array(10).keys()].filter((val) => val >= 3)
}
export function getAllowedGameDurationsSeconds() {
    return [...Array(6).keys()].map((val) => 20 * (val + 1))
}
export function getTarget() {
    switch (getGameType()) {
        case gameTypes.SCORE: {
            return getTargetScore()
        }
        case gameTypes.LEAD_BY: {
            return getTargetLead()
        }
        case gameTypes.TIME_OUT: {
            return getGameDurationSeconds()
        }
    }
}

export function getAllowed() {
    switch (getGameType()) {
        case gameTypes.SCORE: {
            return getAllowedTargetScores()
        }
        case gameTypes.LEAD_BY: {
            return getAllowedTargetLeads()
        }
        case gameTypes.TIME_OUT: {
            return getAllowedGameDurationsSeconds()
        }
    }
}
//preference setters 
export function setGameType(type) {
    if (type !== gameTypes.SCORE && type !== gameTypes.LEAD_BY && type !== gameTypes.TIME_OUT) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("game_type", type)
    console.log("game type set: " + type)
}
export function setDifficulty(level) {
    level = Math.round(level)
    if (level < 1 || level > 5) throw new Error("Illegal argument(s) error")
    let gameType = getGameType()
    let suffix = (gameType == gameTypes.TIME_OUT) ? "time_out" : (gameType === gameTypes.LEAD_BY) ? "lead_by" : "score";
    window.preferences.setInteger("difficulty_" + suffix, level)
    console.log("difficulty set: " + level)

}
export function setTarget(target) {
    switch (getGameType()) {
        case gameTypes.SCORE: {
            return setTargetScore(target)
        }
        case gameTypes.LEAD_BY: {
            return setTargetLead(target)
        }
        case gameTypes.TIME_OUT: {
            return setGameDurationSeconds(target)
        }
    }
}
export function contact() {
    console.log("contact requested")
}
export function setGameDurationSeconds(duration) {
    if (!getAllowedGameDurationsSeconds().includes(duration)) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("game_duration", duration);
    console.log("target duration set: " + duration)
}
export function setTargetScore(score) {
    if (!getAllowedTargetScores().includes(score)) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("target_score", score);
    console.log("target score set: " + score)
}
export function setTargetLead(lead) {
    if (!getAllowedTargetLeads().includes(lead)) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("target_lead", lead);
    console.log("target lead set: " + lead)
}

//evals


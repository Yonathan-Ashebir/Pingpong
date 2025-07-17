import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { Vector } from "../utils/LayoutBasics";

//global constants
export const gameTypes = { SCORE: 0, LEAD_BY: 1, TIME_OUT: 2 }, DEFAULT_DIFFICULTY = 1,
    DEFAULT_GAME_TYPE = gameTypes.SCORE


//runtime constants
export const DEFAULT_RACKET_LENGTH = 75.6, DEFAULT_RACKET_THICKNESS = 30.2, DEFAULT_BALL_RADIUS = 15.1,
    DEFAULT_BALL_TRANSFORM = "translate(-50%,-50%) ",
    DEFAUlT_GAME_STARTED_MESSAGE = <span
        style={{ color: "darkgreen", fontWeight: 700, fontFamily: "Graduate", fontSize: "20vw" }}>GO!</span>;


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
export const untrackedGameData = {};

//preference getters
export function getInitialVelocity() {
    let maxV = new Vector(0.2, 0.2);
    let minV = new Vector(0.1, 0.1);
    let change = (maxV.getR() - minV.getR()) * getDifficulty() / 5;
    return minV.setR(minV.getR() + change);
}

export function getGameType() {
    let type = window.preferences.getInteger("game_type");
    if (typeof type !== "number" || type < 0 || type > 2) {
        type = gameTypes.SCORE
        setGameType(type)
    }

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
    }
    ;
    return target
}

export function getTargetLead() {
    let target = window.preferences.getInteger("target_lead");
    if (!getAllowedTargetLeads().includes(target)) {
        target = 3
        setTargetLead(target)
    }
    ;
    return target
}

export function getGameDurationSeconds() {
    let duration = window.preferences.getInteger("game_duration");
    if (!getAllowedGameDurationsSeconds().includes(duration)) {
        duration = 60
        setGameDurationSeconds(duration)
    }
    ;
    return duration
}

export function getMaximumDurationSeconds() {
    return 999;
}

export function getMaximumVelocity() {
    let maxV = new Vector(1, 1);
    let minV = getInitialVelocity();
    let change = (maxV.getR() - minV.getR()) * getDifficulty() / 5;
    return minV.setR(minV.getR() + change / 2);
}

export function getVelocityRefreshTimeSeconds() {
    return 10;
}

export function getDifficulty() {
    let gameType = getGameType()
    let suffix = (gameType == gameTypes.TIME_OUT) ? "time_out" : (gameType === gameTypes.LEAD_BY) ? "lead_by" : "score";
    let dif = window.preferences.getInteger("difficulty_" + suffix);
    if (dif >= 1 && dif <= 5) return dif;
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
}

export function setDifficulty(level) {
    level = Math.round(level)
    if (level < 1 || level > 5) throw new Error("Illegal argument(s) error")
    let gameType = getGameType()
    let suffix = (gameType == gameTypes.TIME_OUT) ? "time_out" : (gameType === gameTypes.LEAD_BY) ? "lead_by" : "score";
    window.preferences.setInteger("difficulty_" + suffix, level)

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

export function setGameDurationSeconds(duration) {
    if (!getAllowedGameDurationsSeconds().includes(duration)) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("game_duration", duration);
}

export function setTargetScore(score) {
    if (!getAllowedTargetScores().includes(score)) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("target_score", score);
}

export function setTargetLead(lead) {
    if (!getAllowedTargetLeads().includes(lead)) throw new Error("Illegal argument(s) error")
    window.preferences.setInteger("target_lead", lead);
}

class Preferences {
    constructor(nativeTarget) {
        if (!nativeTarget) throw new Error("> Illegal arguments Error.")
        this.target = nativeTarget;
    }

    getString(k, otherwise = null) {
        if (!k) return otherwise;
        if (typeof k !== "string") throw new Error("> Preference key can only be a string.")
        try {
            if (!this.target.getString) {
                console.warn("> Unimplemented method");
                return otherwise;
            }
            let result = this.target.getString(k)
            if (typeof result === "string" || result === null) return result; else return otherwise;
        } catch (e) {
            console.error(e);
            return otherwise;
        }
    }

    getBoolean(k, otherwise = null) {
        if (!k) return otherwise;
        if (typeof k !== "string") throw new Error("> Preference key can only be a string.")
        try {
            if (!this.target.getBoolean) {
                console.warn("> Unimplemented method");
                return otherwise;
            }
            let result = this.target.getBoolean(k)
            if (typeof result === "boolean" || result === null) return result; else return otherwise;
        } catch (e) {
            console.error(e);
            return otherwise;
        }
    }

    getInteger(k, otherwise = null) {
        if (!k) return otherwise;
        if (typeof k !== "string") throw new Error("> Preference key can only be a string.")
        try {
            if (!this.target.getInteger) {
                console.warn("> Unimplemented method");
                return otherwise;
            }
            let result = this.target.getInteger(k)
            if (typeof result === "number" || result === null) return result; else return otherwise;
        } catch (e) {
            console.error(e);
            return otherwise;
        }
    }

    getLong(k, otherwise = null) {
        if (!k) return otherwise;
        if (typeof k !== "string") throw new Error("> Preference key can only be a string.")
        try {
            if (!this.target.getLong) {
                console.warn("> Unimplemented method");
                return otherwise;
            }
            let result = this.target.getLong(k)
            if (typeof result === "number" || result === null) return result; else return otherwise;
        } catch (e) {
            console.error(e);
            return otherwise;
        }
    }

    getFloat(k, otherwise = null) {
        if (!k) return otherwise;
        if (typeof k !== "string") throw new Error("> Preference key can only be a string.")
        try {
            if (!this.target.getFloat) {
                console.warn("> Unimplemented method");
                return otherwise;
            }
            let result = this.target.getFloat(k)
            if (typeof result === "number" || result === null) return result; else return otherwise;
        } catch (e) {
            console.error(e);
            return otherwise;
        }
    }

    setString(k, v) {
        if (typeof k !== "string") throw new Error("> Preference key can not be null")
        if (typeof v !== "string") throw new Error("> Invalid value supplied")
        try {
            if (this.target.setString) {
                this.target.setString(k, v);
                return true
            }
            console.warn("> Unimplemented method")
            return false;
        } catch (e) {
            console.error(e);
            return false
        }
    }

    setBoolean(k, v) {
        if (typeof k !== "string") throw new Error("> Preference key can not be null")
        if (typeof v !== "boolean") throw new Error("> Invalid value supplied")
        try {
            if (this.target.setBoolean) {
                this.target.setBoolean(k, v);
                return true
            }
            console.warn("> Unimplemented method")
            return false;
        } catch (e) {
            console.error(e);
            return false
        }
    }

    setInteger(k, v) {
        if (typeof k !== "string") throw new Error("> Preference key can not be null")
        if (typeof v !== "number") throw new Error("> Invalid value supplied")
        try {
            if (this.target.setInteger) {
                this.target.setInteger(k, v);
                return true
            }
            console.warn("> Unimplemented method")
            return false;
        } catch (e) {
            console.error(e);
            return false
        }
    }

    setLong(k, v) {
        if (typeof k !== "string") throw new Error("> Preference key can not be null")
        if (typeof v !== "number") throw new Error("> Invalid value supplied")
        try {
            if (this.target.setLong) {
                this.target.setLong(k, v);
                return true
            }
            console.warn("> Unimplemented method")
            return false;
        } catch (e) {
            console.error(e);
            return false
        }
    }

    setFloat(k, v) {
        if (typeof k !== "string") throw new Error("> Preference key can not be null")
        if (typeof v !== "number") throw new Error("> Invalid value supplied")
        try {
            if (this.target.setFloat) {
                this.target.setFloat(k, v);
                return true
            }
            console.warn("> Unimplemented method")
            return false;
        } catch (e) {
            console.error(e);
            return false
        }
    }

}

{
    let preferences = new Preferences(window.preferences);
    window.preferences = preferences;
}
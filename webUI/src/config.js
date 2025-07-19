if (process.env.NODE_ENV == 'development') {
    window.preferences = { setString: (k, v) => { yonstore[k] = v }, getInteger: (k) => yonstore[k], setInteger: (k, v) => { yonstore[k] = v }, setLong: (k, v) => { yonstore[k] = v }, setFloat: (k, v) => { yonstore[k] = v }, setBoolean: (k, v) => { yonstore[k] = v }, getString: (k) => yonstore[k], getLong: () => yonstore[k], getFloat: () => yonstore[k], getBoolean: () => yonstore[k] }
    window.bridge = { getField: () => { }, invokeMethod: () => { } }
    window.activity = { finish: () => { console.log("finished") }, trackStatus: (int) => { console.log("app status: ", int) } }
    window.yonstore = {
        "ball_data": "{\"state\":{\"radius\":15.1},\"untrackedData\":{\"roundCount\":102,\"restoredStateCode\":1,\"shouldMove\":false,\"posX\":256.7374141548243,\"posY\":253.30982988750168,\"defaultX\":249,\"defaultY\":242.5,\"lastTimePositioned\":1661189317452,\"state\":2},\"vx\":0.16462583308136827,\"vy\":0.22999638058514205}",
        "difficulty_time_out": 5,
        "game_data": "{\"path\":\"/game\",\"store\":{\"status\":3,\"groundDimensions\":{\"x\":0,\"y\":0,\"width\":498,\"height\":485,\"top\":0,\"right\":498,\"bottom\":485,\"left\":0},\"score\":{\"red\":2,\"blue\":0,\"target\":null},\"gameTotalDurationSeconds\":120,\"roundCount\":102,\"gameTime\":3637,\"roundTime\":102,\"restoredStateCode\":1}}",
        "game_duration": 120,
        "game_type": 2,
        "target_lead": 3,
        "target_score": 5
    }
}
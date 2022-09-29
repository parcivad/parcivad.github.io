// Needed Constants
const apiUrl = "https://api.parcivad.de"
const week = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
const nameColors = ["#e5ca6a" ,"#5de36b" ,"#f74b96" ,"#f78d4b" ,"#c567d6" ,"#00BBF9" ,"#9B5DE5" ,"#0EFCB8" ,"#03C3EE" ,"#E21873" ,"#8DFFD9" ,"#D264B6" ,"#FFC3B5" ,"#FA198B" ,"#9CF5BF" ,"#D5573B" ,"#FD96A9" ,"#F7B32B" ,"#A9E5BB" ,"#016FB9" ,"#EC4E20" ,"#A42CD6" ,"#63A375" ,"#227C9D"]

// startup function
setOnlinePlayers();
setConnections();
setPerformance();
setPlayerActivityGraph(true);

// on change
$("#timeBackSelect, #timeViewSelect").change(function () {
    setPlayerActivityGraph($("#timeViewSelect option:selected").val() === "true");
})

/**
 * Returns last Seven days as text
 * @return {*[]}
 */
function getLastSevenDays() {
    let date = new Date(),
        labels = [];

    for (let i=0; i<7; i++) {
        date.setDate(date.getDate() - 1);
        labels.push(week[date.getDay()]);
    }
    return labels.reverse();
}

/**
 * Returns Online series of each player
 * @param playerSession     PlayerSession
 * @return {*[]}            Hours
 */
function getPlayerOnlineTimeSeries(playerSession, limit) {
    let startOfTheDay = new Date(),
        dayPlayTime = 0,
        playerSeries = [];

    startOfTheDay.setUTCDate(startOfTheDay.getDate())
    startOfTheDay.setHours(0);
    startOfTheDay.setMinutes(0);
    startOfTheDay.setSeconds(1);

    for (let i=0; i < playerSession["sessions"].length; i++) {
        // prepare vars
        let session = playerSession["sessions"][
        (playerSession["sessions"].length - 1) - i];

        // set quitTime 0 to current (session still running)
        if (session["quitTime"] === 0) session["quitTime"] = new Date().getTime();

        // calculate only the active time
        let playTime = Math.round(((session["quitTime"] - session["loginTime"])) / 10 / 60 / 60) / 100;

        if (startOfTheDay.getTime() < session["loginTime"]) {
            dayPlayTime += playTime;
            continue;
        }

        playerSeries.push(dayPlayTime);
        dayPlayTime = 0;
        i -= 1;
        // go one day back
        startOfTheDay.setDate(startOfTheDay.getDate() - 1);
    }
    return playerSeries.slice(0, limit).reverse();
}

/**
 * Returns Idle series of each player
 * @param playerSession     PlayerSession
 * @return {*[]}            Hours
 */
function getPlayerIdleTimeSeries(playerSession, limit) {
    let startOfTheDay = new Date(),
        dayPlayTime = 0,
        playerSeries = [];

    startOfTheDay.setUTCDate(startOfTheDay.getDate())
    startOfTheDay.setHours(0);
    startOfTheDay.setMinutes(0);
    startOfTheDay.setSeconds(1);

    for (let i=0; i < playerSession["sessions"].length; i++) {
        // prepare vars
        let session = playerSession["sessions"][
        (playerSession["sessions"].length - 1) - i];

        // set quitTime 0 to current (session still running)
        if (session["quitTime"] === 0) session["quitTime"] = new Date().getTime();

        // calculate only the active time
        let playTime = Math.round(session["idleTime"] / 100 / 60 / 60 ) / 10;

        if (startOfTheDay.getTime() < session["loginTime"]) {
            dayPlayTime += playTime;
            continue;
        }

        playerSeries.push(dayPlayTime);
        dayPlayTime = 0;
        i -= 1;
        // go one day back
        startOfTheDay.setDate(startOfTheDay.getDate() - 1);
    }
    return playerSeries.slice(0, limit).reverse();
}

/**
 * Creates the div list in the player category
 */
function setOnlinePlayers() {
    // start loading animation
    animateLoad("playerView", 320)

    // Create a line chart with responsive options+
    fetch(`${apiUrl}/minecraft/playerSession`)
        .then(response => response.json())
        .then(data => {
            data.forEach(playerSession => {
                // order array for list and random color for name
                let order = {"offline": 2, "idle": 1, "online": 0}
                let color = '#848484';
                if (playerSession['state'] !== "offline") color = nameColors[Math.floor(Math.random() * nameColors.length)]
                if (playerSession['state'] === "idle") color = '#ff9900'

                // create html element and push it under the playerlist div
                $(".player-list").append(`<div onclick="setPlayerGraph('${playerSession["owner"]}')" class="player-item player-${playerSession['state']} order-${order[playerSession['state']]}">
                            <img src="https://minotar.net/avatar/${playerSession['name']}/500.png">
                            <div class="ps-2">
                                <div style="display: flex">
                                    <h2 style="color: ${color}">${playerSession['name']}</h2>
                                    <p style="padding-left: 8px;">• ${playerSession['state']}</p>
                                </div></div></div>`)
            })

            // end loading animation
            animateStop("playerView")
        })
        .catch(error => {
            // display error on loading
            animateError("playerView")
        });
}

/**
 * Creates the div list in the performance category
 */
function setPerformance() {
    // number of data points
    const dataPoints = 31;

    // start loading animation
    animateLoad("performanceView", 164)

    // Create a line chart with responsive options+
    fetch(`${apiUrl}/minecraft/serverPerformance/now`)
        .then(response => response.json())
        .then(data => {

            // set start date of this session
            let startTime = new Date(data["timestamp"]);
            $("#performanceStartTime").text(startTime.toLocaleDateString("de")
                + ` ${startTime.getHours()}:${startTime.getMinutes()}`);

            // set bulb color
            let lastTps = data["records"][data["records"].length-1]["tps"];
            if (lastTps < 10 ) {
                $("#performanceBulb").addClass("red")
            } else if (lastTps < 14) {
                $("#performanceBulb").addClass("orange")
            } else if (lastTps < 17) {
                $("#performanceBulb").addClass("yellow")
            } else {
                $("#performanceBulb").addClass("green")
            }

            // put in data points
            for (let i=dataPoints; i > 0; i--) {
                let performanceEntry = data["records"][data["records"].length - i];
                // check if there is a entry existing
                if (performanceEntry === undefined) {
                    $("#performanceLine").append(
                        `<div class="col">
                                <span class="d-inline-block custom-popover" tabindex="${i}"
                                      data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus"
                                      data-bs-content="not measured" data-bs-original-title title>
                                    <div class="p-1 performanceLineItem" style="color: #293340"></div>
                                </span>
                            </div>`)
                    continue;
                }

                let color = "#848484",
                    content = `${performanceEntry["ticksPerSeconds"]}/20tps ${performanceEntry["memoryUse"]}/12gb`

                if (performanceEntry["ticksPerSeconds"] < 10 ) {
                    color = "#de4803";
                } else if (performanceEntry["ticksPerSeconds"] < 14) {
                    color = "#de6203";
                } else if (performanceEntry["ticksPerSeconds"] < 16) {
                    color = "#de7b03";
                } else if (performanceEntry["ticksPerSeconds"] < 17) {
                    color = "rgba(0,168,150,0.48)";
                } else if (performanceEntry["ticksPerSeconds"] < 19 ) {
                    color = "rgba(0,168,150,0.75)";
                } else {
                    color = "#00A896";
                }

                $("#performanceLine").append(
                    `<div class="col">
                                <span class="d-inline-block custom-popover" tabindex="${i}"
                                      data-bs-toggle="popover"
                                      data-bs-placement="top"
                                      data-bs-trigger="hover focus"
                                      data-bs-content="${content}"
                                      data-bs-original-title title>
                                    <div class="p-1 performanceLineItem" style="color: ${color}"></div>
                                </span>
                            </div>`)
            }

            // end loading animation
            animateStop("performanceView")
        })
        .then(function () {
            const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
            const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
        })
        .catch(error => {
            // display error on loading
            animateError("performanceView")
        });
}

/**
 * Creates the div list in the player category
 */
function setConnections() {
    // start loading animation
    animateLoad("connectionView", 164)

    // Create a line chart with responsive options+
    fetch(`${apiUrl}/minecraft/playerSession`)
        .then(response => response.json())
        .then(data => {
            let averageCollection = 0;
            let count = 0;

            data.forEach(playerSession => {
                // return if there is no ping existing
                if (playerSession["ping"] === null) return;

                // order array for list and random color for name
                let order = {"offline": 2, "idle": 1, "online": 0},
                    color = '#848484',
                    ping = playerSession["ping"],
                    pastTerm = "";

                if (order[playerSession["state"]] < 2) {
                    if (ping < 30) {
                        color = '#00A896';
                    } else if (ping < 50) {
                        color = '#f4c63d';
                    } else if (ping < 100) {
                        color = '#ff8b00'
                    } else if (ping < 300) {
                        color = '#f05b4f';
                    }
                } else {
                    pastTerm = "te";
                }

                // create html element and push it under the playerlist div
                $("#connections").append(`<div class="connection-item order-${order[playerSession["state"]]}">
                        <div style="color: ${color}"></div><p>
                        <span style="font-weight: bolder">${playerSession["name"]}</span>
                         hat${pastTerm} eine Latenz von <span style="font-weight: bolder">${ping} ms</span></p></div>`)

                // add ping to average
                averageCollection += ping;
                count++;
            })

            // calculate average ping and set the text and bulb color
            averageCollection = averageCollection / count;
            $('#averagePing').text(Math.floor(averageCollection * 10) / 10)
            // bulb color
            if (averageCollection < 30) {
                $("#connectionBulb").addClass("green");
            } else if (averageCollection < 50) {
                $("#connectionBulb").addClass("yellow");
            } else if (averageCollection < 100) {
                $("#connectionBulb").addClass("orange");
            } else if (averageCollection < 300) {
                $("#connectionBulb").addClass("red");
            }

            // end loading animation
            animateStop("connectionView")
        })
        .catch(error => {
            // display error on loading
            animateError("connectionView")
        });
}

/**
 * Creates a player activity graph with filled areas
 * @param onlineOrIdle
 */
function setPlayerActivityGraph(onlineOrIdle) {
    // class for colors
    let areaClass = "ct-area",
        labels = getLastSevenDays();
    series = [];
    if (!onlineOrIdle) areaClass = "ct-area-idle";
    if ($("#timeBackSelect option:selected").val() > 7) labels = [];

    // start loading animation
    animateLoad("graphView", 320);

    // Create a line chart with responsive options+
    fetch(`${apiUrl}/minecraft/playerSession`)
        .then(response => response.json())
        .then(data => {
            data.forEach(playerSession => {
                // set graph series of the player sessions
                if (onlineOrIdle)
                    series.push(getPlayerOnlineTimeSeries(playerSession, $("#timeBackSelect option:selected").val()))
                else
                    series.push(getPlayerIdleTimeSeries(playerSession, $("#timeBackSelect option:selected").val()))
            })

            // stop loading animation
            animateStop("graphView");

            new Chartist.Line('.ct-chart', {
                labels: labels,
                series: series
            }, {
                // Options for X-Axis
                axisX: {
                    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
                    labelOffset: {
                        x: -15,
                        y: 5
                    },
                    // Interpolation function that allows you to intercept the value from the axis label
                    labelInterpolationFnc: Chartist.noop,
                    // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
                    type: undefined
                },
                // Options for Y-Axis
                axisY: {
                    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
                    labelOffset: {
                        x: 5,
                        y: 0
                    },
                    // Interpolation function that allows you to intercept the value from the axis label
                    labelInterpolationFnc: function (value) {
                        return Math.floor(value*10)/10 +"h"
                    },
                    // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
                    type: undefined,
                    // This value specifies the minimum height in pixel of the scale steps
                    scaleMinSpace: 20,
                    // Use only integer values (whole numbers) for the scale steps
                    onlyInteger: false
                },
                // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
                width: "100%",
                // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
                height: "100%",
                // If the line should be drawn or not
                showLine: false,
                // If dots should be drawn or not
                showPoint: false,
                // If the line chart should draw an area
                showArea: true,
                // The base for the area chart that will be used to close the area shape (is normally 0)
                areaBase: 0,
                // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
                lineSmooth: true,
                // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
                chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
                fullWidth: true,
                // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
                reverseData: false,
                classNames: {
                    area: areaClass,
                }
            }, [
                ['screen and (min-width: 641px) and (max-width: 1024px)', {
                    showPoint: false,
                    axisX: {
                        labelInterpolationFnc: function(value) {
                            // Will return Mon, Tue, Wed etc. on medium screens
                            return value.slice(0, 3);
                        }
                    }
                }],
                ['screen and (max-width: 640px)', {
                    showLine: false,
                    axisX: {
                        labelInterpolationFnc: function(value) {
                            // Will return M, T, W etc. on small screens
                            return value[0];
                        }
                    }
                }]
            ]).on('draw', function(data) {
                if(data.type === 'area') {
                    data.element.animate({
                        d: {
                            begin: 0,
                            dur: 500,
                            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeOutQuint
                        }
                    });
                }
            });
        })
        .catch(error => {
            // set loading error
            animateError("graphView");
        });
}

/**
 * Creates a player graph with active and inactive line
 * @param playerUUID
 */
function setPlayerGraph(playerUUID) {
    // start loading animation
    animateLoad("graphView", 320);

    // Create a line chart with responsive options+
    fetch(`${apiUrl}/minecraft/playerSession/${playerUUID}`)
        .then(response => response.json())
        .then(playerSession => {
            // stop loading animation
            animateStop("graphView");

            new Chartist.Line('.ct-chart', {
                labels: getLastSevenDays(),
                series: [getPlayerOnlineTimeSeries(playerSession, 7), getPlayerIdleTimeSeries(playerSession, 7)]
            }, {
                // Options for X-Axis
                axisX: {
                    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
                    labelOffset: {
                        x: -15,
                        y: 5
                    },
                    // Interpolation function that allows you to intercept the value from the axis label
                    labelInterpolationFnc: Chartist.noop,
                    // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
                    type: undefined
                },
                // Options for Y-Axis
                axisY: {
                    // Allows you to correct label positioning on this axis by positive or negative x and y offset.
                    labelOffset: {
                        x: 10,
                        y: 0
                    },
                    // Interpolation function that allows you to intercept the value from the axis label
                    labelInterpolationFnc: function (value) {
                        return Math.floor(value*10)/10 +"h"
                    },
                    // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
                    type: undefined,
                    // This value specifies the minimum height in pixel of the scale steps
                    scaleMinSpace: 20,
                    // Use only integer values (whole numbers) for the scale steps
                    onlyInteger: false
                },
                // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
                width: "100%",
                // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
                height: "100%",
                // If the line should be drawn or not
                showLine: true,
                // If dots should be drawn or not
                showPoint: false,
                // set area
                showArea: true,
                // The base for the area chart that will be used to close the area shape (is normally 0)
                areaBase: 0,
                // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
                lineSmooth: true,
                // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
                chartPadding: {
                    top: 0,
                    right: 5,
                    bottom: 0,
                    left: 0
                },
                // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
                fullWidth: true,
                classNames: {
                    area: "ct-area-player",
                }
            }, [
                ['screen and (min-width: 641px) and (max-width: 1024px)', {
                    showPoint: false,
                    axisX: {
                        labelInterpolationFnc: function(value) {
                            // Will return Mon, Tue, Wed etc. on medium screens
                            return value.slice(0, 3);
                        }
                    }
                }],
                ['screen and (max-width: 640px)', {
                    showLine: false,
                    axisX: {
                        labelInterpolationFnc: function(value) {
                            // Will return M, T, W etc. on small screens
                            return value[0];
                        }
                    }
                }]
            ]).on('draw', function(data) {
                if(data.type === 'line' || data.type === "area") {
                    data.element.animate({
                        d: {
                            begin: 0,
                            dur: 500,
                            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeOutQuint
                        }
                    });
                }
            });
        })
        .catch(error => {
            // set loading error
            animateError("graphView");
        });
}
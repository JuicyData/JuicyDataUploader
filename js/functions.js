var app = require("electron").remote;
var dialog = app.dialog;
var fs = require("fs");
var axios = require("axios");

let folderPath;

document.getElementById("findPath").onclick = () => {
  dialog.showOpenDialog({ properties: ["openDirectory"] }, fileNames => {
    if (fileNames === undefined) {
      alert("No folder was selected");
    } else {
      folderPath = fileNames[0];
      document.getElementById("folderPath").value = folderPath;
    }
  });
};

document.getElementById("uploadScheduleButton").onclick = () => {
  fs.readFile(folderPath + "/matches.txt", "utf-8", (err, data) => {
    if (err) {
      alert(err);
      return;
    }

    if (folderPath === undefined) {
      alert(
        "No folder is selected. Please locate the folder that the scoring system is in"
      );
    } else {
      data = data.replace("", "");
      let x = data.split("\n");
      for (let i = 0; i < x.length; i++) {
        if (x[i] === "") {
          x.splice(i, i + 1);
        }
      }
      for (let i = 0; i < x.length; i++) {
        x[i] = x[i].split("|");
      }
      console.table(x);
      let y = [];
      for (let i = 0; i < x.length; i++) {
        y.push({
          matchNumber: i + 1,
          teams: {
            red1: {
              teamNumber: x[i][5],
              surrogate: x[i][23] == 1
            },
            red2: {
              teamNumber: x[i][6],
              surrogate: x[i][24] == 1
            },
            blue1: {
              teamNumber: x[i][8],
              surrogate: x[i][26] == 1
            },
            blue2: {
              teamNumber: x[i][9],
              surrogate: x[i][25] == 1
            }
          }
        });
      }
      schedule = {
        _id: "1718-CAL-GAMES",
        schedule: y
      };
      console.log(schedule);
    }
    axios
      .post("http://127.0.0.1:3000/api/data/uploadSchedule", schedule)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
};

document.getElementById("syncButton").onclick = () => {
  fs.readFile(folderPath + "/matches.txt", "utf-8", (err, data) => {
    if (err) {
      alert(err);
      return;
    }

    if (folderPath === undefined) {
      alert(
        "No folder is selected. Please locate the folder that the scoring system is in"
      );
    } else {
      data = data.replace("", "");
      let x = data.split("\n");
      for (let i = 0; i < x.length; i++) {
        if (x[i] === "") {
          x.splice(i, i + 1);
        }
      }
      for (let i = 0; i < x.length; i++) {
        x[i] = x[i].split("|");
      }
      console.table(x);
      let gameData = [];
      let matchData = [];
      for (let i = 0; i < x.length; i++) {
        if (x[i][29] == 1) { 
        gameData.push({
          _id: {
            toaEventKey: "1718-CAL-GAMES",
            matchInformation: {
              matchNumber: x[i][2],
              robotAlliance: "red",
              teams: [x[i][5], x[i][6]]
            }
          },
          gameInformation: {
            auto: {
              jewel: x[i][30],
              glyphs: x[i][31],
              keys: x[i][32],
              park: x[i][33]
            },
            driver: {
              glyphs: x[i][34],
              rows: x[i][35],
              columns: x[i][36],
              cypher: x[i][37]
            },
            end: {
              relic1: x[i][38],
              relic2: x[i][39],
              relic3: x[i][40],
              relicsUp: x[i][41],
              balanced: x[i][42]
            }
          }
        });
        gameData.push({
          _id: {
            toaEventKey: "1718-CAL-GAMES",
            matchInformation: {
              matchNumber: x[i][2],
              robotAlliance: "blue",
              teams: [x[i][8], x[i][9]]
            }
          },
          gameInformation: {
            auto: {
              jewel: x[i][47],
              glyphs: x[i][48],
              keys: x[i][49],
              park: x[i][50]
            },
            driver: {
              glyphs: x[i][51],
              rows: x[i][52],
              columns: x[i][53],
              cypher: x[i][54]
            },
            end: {
              relic1: x[i][55],
              relic2: x[i][56],
              relic3: x[i][57],
              relicsUp: x[i][58],
              balanced: x[i][59]
            }
          }
        });
        redAuto =
          Number(x[i][30]) * 30 +
          Number(x[i][31]) * 15 +
          Number(x[i][32]) * 30 +
          Number(x[i][33]) * 10;
        blueAuto =
          Number(x[i][47]) * 30 +
          Number(x[i][48]) * 15 +
          Number(x[i][49]) * 30 +
          Number(x[i][50]) * 10;
        redDriver =
          Number(x[i][34]) * 2 +
          Number(x[i][35]) * 10 +
          Number(x[i][36]) * 20 +
          Number(x[i][37]) * 30;
        blueDriver =
          Number(x[i][51]) * 2 +
          Number(x[i][52]) * 10 +
          Number(x[i][53]) * 20 +
          Number(x[i][54]) * 30;
        redEnd =
          Number(x[i][38]) * 10 +
          Number(x[i][39]) * 20 +
          Number(x[i][40]) * 40 +
          Number(x[i][41]) * 15 +
          Number(x[i][42]) * 20;
        blueEnd =
          Number(x[i][55]) * 10 +
          Number(x[i][56]) * 20 +
          Number(x[i][57]) * 40 +
          Number(x[i][58]) * 15 +
          Number(x[i][59]) * 20;
        matchData.push({
          _id: {
            toaEventKey: "1718-CAL-GAMES",
            matchInformation: {
              matchNumber: x[i][2],
              teams: {
                red1: x[i][5],
                red2: x[i][6],
                blue1: x[i][8],
                blue2: x[i][9]
              }
            }
          },
          resultInformation: {
            score: {
              auto: {
                red: redAuto,
                blue: blueAuto
              },
              driver: {
                red: redDriver,
                blue: blueDriver
              },
              end: {
                red: redEnd,
                blue: blueEnd
              },
              total: {
                red: redAuto + redDriver + redEnd,
                blue: blueAuto + blueDriver + blueEnd
              },
              penalty: {
                red: x[i][62] * 10 + x[i][63] * 40,
                blue: x[i][60] * 10 + x[i][61] * 40
              },
              final: {
                red:
                  (x[i][60] * 10) + (x[i][61] * 40) + redAuto + redDriver + redEnd,
                blue:
                  (x[i][62] * 10) +
                  (x[i][63] * 40) +
                  blueAuto +
                  blueDriver +
                  blueEnd
              }
            },
            winner:
              x[i][60] * 10 + x[i][61] * 40 + redAuto + redDriver + redEnd ==
              x[i][62] * 10 + x[i][63] * 40 + blueAuto + blueDriver + blueEnd
                ? "tie"
                : x[i][60] * 10 + x[i][61] * 40 + redAuto + redDriver + redEnd <
                  x[i][62] * 10 +
                    x[i][63] * 40 +
                    blueAuto +
                    blueDriver +
                    blueEnd
                  ? "blue"
                  : "red"
          }
        });
      }
      }
      console.log({gameData});
      console.log({matchData})
      request = {
        gameData: gameData,
        matchData: matchData
      }
      axios
      .post("http://127.0.0.1:3000/api/data/uploadSync", request)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  });
};

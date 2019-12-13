var app = require("electron").remote;
var dialog = app.dialog;
var fs = require("fs");
const { ipcRenderer } = require('electron')

var axios = require("axios");

var OBSSaveFolderInput = document.getElementById("OBSSaveLocation");

OBSSaveFolderInput.addEventListener("change", function() {
  var OBSSaveFolderLocation = OBSSaveFolderInput.files[0].path;
  document.getElementById("OBSSaveLocationText").textContent = OBSSaveFolderLocation;
  document.getElementById("startOBSButton").disabled = false;
  document.getElementById("startOBSButton").classList.replace("btn-secondary", "btn-info");

  document.getElementById("elimStartOBSButton").disabled = false;
  document.getElementById("elimStartOBSButton").classList.replace("btn-secondary", "btn-info");

  document.getElementById("OBSMatchNumber").disabled = false;

  document.getElementById("elimOBSRedAlliance").disabled = false;
  document.getElementById("elimOBSBlueAlliance").disabled = false;

  document.getElementById("loadRankingsOBS").disabled = false;
  document.getElementById("loadRankingsOBS").classList.replace("btn-secondary", "btn-info");

  document.getElementById("OBSLowerThirdsName").disabled = false;
  document.getElementById("OBSLowerThirdsTitle").disabled = false;
  document.getElementById("OBSLowerThirdsButton").disabled = false;
  document.getElementById("OBSLowerThirdsButton").classList.replace("btn-secondary", "btn-info");
});

function setLowerThirds() {
  let lowerThirdsTitle = document.getElementById("OBSLowerThirdsTitle").value;
  let lowerThirdsName = document.getElementById("OBSLowerThirdsName").value;
  let Data = {
    name: lowerThirdsName,
    title: lowerThirdsTitle
  }
  ipcRenderer.send('request-lower-thirds-update', Data)
}

function startOBS() {
  let eventID = document.getElementById("eventID").value;
  var scoringSystemIP = document.getElementById("scoringSystemIP").value;
  let saveLocation = OBSSaveFolderInput.files[0].path;
  axios
    .get(scoringSystemIP + "/apiv1/events/" + eventID + "/matches/")
    .then(function(response) {
      teamList = {
        red: {},
        blue: {}
      };
      teamNumbers = [];
      matches = response.data.matches;
      console.log(response);
      matchNumber = document.getElementById("OBSMatchNumber").value - 1;
      teamList.blue = matches[matchNumber].blue;
      teamList.red = matches[matchNumber].red;
      axios
        .get(scoringSystemIP + "/apiv1/teams/" + teamList.blue.team1)
        .then(function(response) {
          teamList.blue.team1Name = response.data.name;
          axios
            .get(scoringSystemIP + "/apiv1/teams/" + teamList.blue.team2)
            .then(function(response) {
              teamList.blue.team2Name = response.data.name;
              axios
                .get(scoringSystemIP + "/apiv1/teams/" + teamList.red.team1)
                .then(function(response) {
                  teamList.red.team1Name = response.data.name;
                  axios
                    .get(scoringSystemIP + "/apiv1/teams/" + teamList.red.team2)
                    .then(function(response) {
                      teamList.red.team2Name = response.data.name;
                      fs.writeFile(saveLocation + "/b1.txt", teamList.blue.team1 + " " + teamList.blue.team1Name, function(err) {
                        if (err) throw err;
                      });
                      fs.writeFile(saveLocation + "/b2.txt", teamList.blue.team2 + " " + teamList.blue.team2Name, function(err) {
                        if (err) throw err;
                      });
                      fs.writeFile(saveLocation + "/r1.txt", teamList.red.team1 + " " + teamList.red.team1Name, function(err) {
                        if (err) throw err;
                      });
                      fs.writeFile(saveLocation + "/r2.txt", teamList.red.team2 + " " + teamList.red.team2Name, function(err) {
                        if (err) throw err;
                      });
                      console.log("Wrote Text files for match " + (matchNumber + 1));
                    })
                    .catch(function(error) {
                      alert(error);
                    });
                })
                .catch(function(error) {
                  alert(error);
                });
            })
            .catch(function(error) {
              alert(error);
            });
        })
        .catch(function(error) {
          alert(error);
        });
    })
    .catch(function(error) {
      alert(error);
    });
}

function elimStartOBS() {
  let eventID = document.getElementById("eventID").value;
  var scoringSystemIP = document.getElementById("scoringSystemIP").value;
  let saveLocation = OBSSaveFolderInput.files[0].path;
  let redAlliance = document.getElementById("elimOBSRedAlliance").value;
  let blueAlliance = document.getElementById("elimOBSBlueAlliance").value;
  axios
    .get(scoringSystemIP + "/apiv1/events/" + eventID + "/elim/alliances/")
    .then(function(response) {
      teamList = {
        red: {},
        blue: {}
      };
      alliances = response.data.alliances;
      for (let i = 0; i < alliances.length; i++) {
        if (redAlliance - 1 == i) teamList.red = alliances[i];
        if (blueAlliance - 1 == i) teamList.blue = alliances[i];
      }
      console.log(alliances);
      console.log(teamList);
      axios
        .get(scoringSystemIP + "/apiv1/teams/" + teamList.blue.captain)
        .then(function(response) {
          teamList.blue.team1Name = response.data.name;
          axios
            .get(scoringSystemIP + "/apiv1/teams/" + teamList.blue.pick1)
            .then(function(response) {
              teamList.blue.team2Name = response.data.name;
              axios
                .get(scoringSystemIP + "/apiv1/teams/" + teamList.red.captain)
                .then(function(response) {
                  teamList.red.team1Name = response.data.name;
                  axios
                    .get(scoringSystemIP + "/apiv1/teams/" + teamList.red.pick1)
                    .then(function(response) {
                      teamList.red.team2Name = response.data.name;
                      fs.writeFile(saveLocation + "/b1.txt", teamList.blue.captain + " " + teamList.blue.team1Name, function(err) {
                        if (err) throw err;
                      });
                      fs.writeFile(saveLocation + "/b2.txt", teamList.blue.pick1 + " " + teamList.blue.team2Name, function(err) {
                        if (err) throw err;
                      });
                      fs.writeFile(saveLocation + "/r1.txt", teamList.red.captain + " " + teamList.red.team1Name, function(err) {
                        if (err) throw err;
                      });
                      fs.writeFile(saveLocation + "/r2.txt", teamList.red.pick1 + " " + teamList.red.team2Name, function(err) {
                        if (err) throw err;
                      });
                      console.log("Wrote text finals for seeds" + redAlliance + " " + blueAlliance);
                    })
                    .catch(function(error) {
                      alert(error);
                    });
                })
                .catch(function(error) {
                  alert(error);
                });
            })
            .catch(function(error) {
              alert(error);
            });
        })
        .catch(function(error) {
          alert(error);
        });
    })
    .catch(function(error) {
      alert(error);
      console.log(error);
    });
}

function loadRankingsOBS() {
  let eventID = document.getElementById("eventID").value;
  var scoringSystemIP = document.getElementById("scoringSystemIP").value;
  let saveLocation = OBSSaveFolderInput.files[0].path;
  axios.get(scoringSystemIP + "/apiv1/events/" + eventID + "/rankings").then(function(response) {
    rankings = response.data.rankingList
    rankings.sort(function(a, b) {
      return Math.abs(a.ranking) - Math.abs(b.ranking);
    });
    generateRankingsColumn("ranking", rankings);
    generateRankingsColumn("team", rankings);
    generateRankingsColumn("teamName", rankings);
    generateRankingsColumn("rankingPoints", rankings);
    generateRankingsColumn("tieBreakerPoints", rankings);
    generateRankingsColumn("matchesPlayed", rankings);

    // fs.writeFile(saveLocation + "/test.txt", formatRankings(response.data.rankingList), function(err) {
    //   if (err) throw err;
    // });
  });

  function generateRankingsColumn(column, rankings) {
    let parsedColumn = "";

    for (let i = 0; i < rankings.length; i++) {
      if (column === "ranking" && rankings[i].ranking <= 0) {
        rankings[i].ranking = "NP";
      }
      parsedColumn += rankings[i][column] + "\n";
    }

    fs.writeFile(saveLocation + "/" + column + ".txt", parsedColumn, function(err) {
      if (err) throw err;
    });
  }

  // function formatRankings(rankings) {
  //   let parsedRankings = "";
  //   console.log(rankings)
  //   rankings.sort(function(a,b) {
  //     return Math.abs(a.ranking) - Math.abs(b.ranking)
  //   })
  //   for (let i = 0; i < rankings.length; i++) {
  //     team = rankings[i].team;
  //     teamName = rankings[i].teamName;
  //     ranking = Math.abs(rankings[i].ranking);
  //     rankingPoints = rankings[i].rankingPoints;
  //     tieBreakerPoints = rankings[i].tieBreakerPoints;
  //     matchesPlayed = rankings[i].matchesPlayed;
  //     parsedRankings +=  ranking + " " + team + " " + teamName + " " + rankingPoints + " " + tieBreakerPoints + " " + matchesPlayed + "\n"
  //   }
  //   return(parsedRankings)
  // }
}

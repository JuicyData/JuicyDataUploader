var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var axios = require('axios');

// let folderPath;
let ip = '';

document.getElementById('uploadScheduleButton').onclick = () => {
  let eventID = document.getElementById('eventID').value;
  axios
    .get('http://localhost/apiv1/events/' + eventID + '/matches/')
    .then(function(response) {
      console.log(response);
      scoringSystemSchedule = response.data.matches;
      tempSchedule = [];
      for (let i = 0; i < scoringSystemSchedule.length; i++) {
        tempSchedule[i] = {
          matchNumber: scoringSystemSchedule[i].matchNumber,
          teams: {
            red1: {
              teamNumber: scoringSystemSchedule[i].red.team1,
              surrogate: scoringSystemSchedule[i].red.isTeam1Surrogate
            },
            red2: {
              teamNumber: scoringSystemSchedule[i].red.team2,
              surrogate: scoringSystemSchedule[i].red.isTeam2Surrogate
            },
            blue1: {
              teamNumber: scoringSystemSchedule[i].blue.team1,
              surrogate: scoringSystemSchedule[i].blue.isTeam1Surrogate
            },
            blue2: {
              teamNumber: scoringSystemSchedule[i].blue.team2,
              surrogate: scoringSystemSchedule[i].blue.isTeam2Surrogate
            }
          }
        };
      }
      schedule = {
        _id: eventID,
        schedule: tempSchedule
      };
      console.log({schedule});
      axios
        .post('http://' + ip + '/api/events/ftc/event/uploadSchedule', schedule)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          alert(error);
        });
    })
    .catch(function(error) {
      alert(error);
    });
};

document.getElementById('syncButton').onclick = () => {
  let eventID = document.getElementById('eventID').value;
  axios
    .get('http://localhost/apiv1/events/' + eventID + '/matches/')
    .then(function(response) {
      scoringSystemSchedule = response.data.matches;
      tempSchedule = [];
      for (let i = 0; i < scoringSystemSchedule.length; i++) {
        if (scoringSystemSchedule[i].finished) {
          tempSchedule.push({
            matchNumber: scoringSystemSchedule[i].matchNumber,
            teams: {
              red1: scoringSystemSchedule[i].red.team1,
              red2: scoringSystemSchedule[i].red.team2,
              blue1: scoringSystemSchedule[i].blue.team1,
              blue2: scoringSystemSchedule[i].blue.team2
            }
          });
        }
      }
      matchData = [];
      gameData = [];
      for (let i = 0; i < tempSchedule.length; i++) {
        axios
          .get(
            'http://localhost/apiv1/2019/events/' +
              eventID +
              '/matches/' +
              tempSchedule[i].matchNumber
          )
          .then(function(response) {
            response = response.data;
            matchData[i] = {
              matchInformation: {
                matchNumber: tempSchedule[i].matchNumber,
                teams: tempSchedule[i].teams
              },
              resultInformation: {
                score: {
                  penalty: {
                    red: response.blue.penalty,
                    blue: response.red.penalty
                  }
                }
              }
            };
            bluePartial = 0;
            blueFull = 0;
            redPartial = 0;
            redFull = 0;
            if (response.blue.endParking == 15) {
              bluePartial = 1;
            }
            if (response.blue.endParking == 25) {
              blueFull = 1;
            }
            if (response.blue.endParking == 30) {
              bluePartial = 2;
            }
            if (response.blue.endParking == 40) {
              blueFull = 1;
              bluePartial = 1;
            }
            if (response.red.endParking == 50) {
              blueFull = 2;
            }

            if (response.red.endParking == 15) {
              redPartial = 1;
            }
            if (response.red.endParking == 25) {
              redFull = 1;
            }
            if (response.red.endParking == 30) {
              redPartial = 2;
            }
            if (response.red.endParking == 40) {
              redFull = 1;
              redPartial = 1;
            }
            if (response.red.endParking == 50) {
              redFull = 2;
            }

            gameData.push({
              matchInformation: {
                matchNumber: tempSchedule[i].matchNumber,
                robotAlliance: 'blue',
                teams: [
                  tempSchedule[i].teams.blue1,
                  tempSchedule[i].teams.blue2
                ]
              },
              auto: {
                landing: response.blue.landed / 30,
                sampling: response.blue.mineralSample / 25,
                claiming: response.blue.claimedDepot / 15,
                parking: response.blue.autoParking / 10
              },
              driver: {
                goldMineral: response.blue.landerGold / 5,
                silverMineral: response.blue.landerSilver / 5,
                anyMineral: response.blue.depotMinerals / 2
              },
              end: {
                latched: response.blue.latchedLander / 50,
                parkedCrater: bluePartial,
                parkedCompletelyCrater: blueFull
              }
            });
            gameData.push({
              matchInformation: {
                matchNumber: tempSchedule[i].matchNumber,
                robotAlliance: 'red',
                teams: [tempSchedule[i].teams.red1, tempSchedule[i].teams.red2]
              },
              auto: {
                landing: response.red.landed / 30,
                sampling: response.red.mineralSample / 25,
                claiming: response.red.claimedDepot / 15,
                parking: response.red.autoParking / 10
              },
              driver: {
                goldMineral: response.red.landerGold / 5,
                silverMineral: response.red.landerSilver / 5,
                anyMineral: response.red.depotMinerals / 2
              },
              end: {
                latched: response.red.latchedLander / 50,
                parkedCrater: redPartial,
                parkedCompletelyCrater: redFull
              }
            });
            request = {
              seasonId: {
                season: '2018-2019',
                first: 'ftc'
              },
              eventKey: eventID,
              gameData: gameData,
              matchData: matchData
            };
            console.log({request})
            axios
              .post(
                'http://' + ip + '/api/events/ftc/event/uploadSync',
                request
              )
              .then(function(response) {
                console.log(response);
              })
              .catch(function(error) {
                alert(error);
              });
          })
          .catch(function(error) {
            alert(error);
          });
      }
    });
};

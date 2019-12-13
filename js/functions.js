var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var axios = require('axios');

// let folderPath;

function refresh() {
  var x = document.getElementById('eventID');
  x.disabled = true;
  var scoringSystemIP = document.getElementById('scoringSystemIP').value;
  for (let i = 1; x.length > 1; i++) {
    x.remove(1);
  }
  checkEventID();
  axios
    .get(scoringSystemIP + '/apiv1/events/')
    .then(function(response) {
      console.log(response);
      let eventIDList = response.data.eventCodes;
      var x = document.getElementById('eventID');
      for (let i = 0; i < eventIDList.length; i++) {
        var option = document.createElement('option');
        option.text = eventIDList[i];
        x.add(option);
        x.disabled = false;
      }
    })
    .catch(function(error) {
      alert(error);
    });
}

function checkEventID() {
  let eventID = document.getElementById('eventID').value;
  if (eventID != '') {
    document.getElementById('OBSSaveLocation').disabled = false;
  } else {
    document.getElementById('OBSSaveLocation').disabled = true;
  }
}

// document.getElementById('uploadScheduleButton').onclick = () => {
//   let eventID = document.getElementById('eventID').value;
//   var scoringSystemIP = document.getElementById('scoringSystemIP').value;
//   var ip = document.getElementById('apiIP').value;
//   axios
//     .get(scoringSystemIP + '/apiv1/events/' + eventID + '/matches/')
//     .then(function(response) {
//       console.log(response);
//       scoringSystemSchedule = response.data.matches;
//       tempSchedule = [];
//       for (let i = 0; i < scoringSystemSchedule.length; i++) {
//         tempSchedule[i] = {
//           matchNumber: scoringSystemSchedule[i].matchNumber,
//           teams: {
//             red1: {
//               teamNumber: scoringSystemSchedule[i].red.team1,
//               surrogate: scoringSystemSchedule[i].red.isTeam1Surrogate
//             },
//             red2: {
//               teamNumber: scoringSystemSchedule[i].red.team2,
//               surrogate: scoringSystemSchedule[i].red.isTeam2Surrogate
//             },
//             blue1: {
//               teamNumber: scoringSystemSchedule[i].blue.team1,
//               surrogate: scoringSystemSchedule[i].blue.isTeam1Surrogate
//             },
//             blue2: {
//               teamNumber: scoringSystemSchedule[i].blue.team2,
//               surrogate: scoringSystemSchedule[i].blue.isTeam2Surrogate
//             }
//           }
//         };
//       }
//       schedule = {
//         _id: eventID,
//         schedule: tempSchedule
//       };
//       console.log({ schedule });
//       axios
//         .post(ip + '/api/events/ftc/event/uploadSchedule', schedule)
//         .then(function(response) {
//           console.log(response);
//           alert('Upload Successful');
//         })
//         .catch(function(error) {
//           alert(error);
//         });
//     })
//     .catch(function(error) {
//       alert(error);
//     });
// };

// document.getElementById('syncButton').onclick = () => {
//   let eventID = document.getElementById('eventID').value;
//   var scoringSystemIP = document.getElementById('scoringSystemIP').value;
//   var ip = document.getElementById('apiIP').value;
//   axios
//     .get(scoringSystemIP + '/apiv1/events/' + eventID + '/rankings/')
//     .then(function(response) {
//       console.log(response);
//       rankings = response.data.rankingList;

//       axios.get(scoringSystemIP + '/apiv1/events/' + eventID + '/matches/').then(function(response) {
//         console.log(response);
//         scoringSystemSchedule = response.data.matches;
//         tempSchedule = [];
//         for (let i = 0; i < scoringSystemSchedule.length; i++) {
//           if (scoringSystemSchedule[i].finished) {
//             tempSchedule.push({
//               matchNumber: scoringSystemSchedule[i].matchNumber,
//               teams: {
//                 red1: scoringSystemSchedule[i].red.team1,
//                 red2: scoringSystemSchedule[i].red.team2,
//                 blue1: scoringSystemSchedule[i].blue.team1,
//                 blue2: scoringSystemSchedule[i].blue.team2
//               }
//             });
//           }
//         }
//         let matchData = [];
//         let gameData = [];
//         let request = {
//           seasonId: {
//             season: '2018-2019',
//             first: 'ftc'
//           },
//           eventKey: eventID,
//           gameData: gameData,
//           matchData: matchData,
//           rankings: rankings
//         };
//         console.log(tempSchedule);
//         let doneWhen0 = tempSchedule.length;
//         for (let i = 0; i < tempSchedule.length; i++) {
//           axios
//             .get(scoringSystemIP + '/apiv1/2019/events/' + eventID + '/matches/' + tempSchedule[i].matchNumber)
//             .then(function(response) {
//               console.log(tempSchedule[i].matchNumber, response);
//               response = response.data;
//               matchData[i] = {
//                 matchInformation: {
//                   matchNumber: tempSchedule[i].matchNumber,
//                   teams: tempSchedule[i].teams
//                 },
//                 resultInformation: {
//                   score: {
//                     penalty: {
//                       red: response.blue.penalty,
//                       blue: response.red.penalty
//                     }
//                   }
//                 }
//               };
//               bluePartial = 0;
//               blueFull = 0;
//               redPartial = 0;
//               redFull = 0;
//               if (response.blue.endParking === 15) {
//                 bluePartial = 1;
//               }
//               if (response.blue.endParking === 25) {
//                 blueFull = 1;
//               }
//               if (response.blue.endParking === 30) {
//                 bluePartial = 2;
//               }
//               if (response.blue.endParking === 40) {
//                 blueFull = 1;
//                 bluePartial = 1;
//               }
//               if (response.blue.endParking === 50) {
//                 blueFull = 2;
//               }
//               if (response.red.endParking === 15) {
//                 redPartial = 1;
//               }
//               if (response.red.endParking === 25) {
//                 redFull = 1;
//               }
//               if (response.red.endParking === 30) {
//                 redPartial = 2;
//               }
//               if (response.red.endParking === 40) {
//                 redFull = 1;
//                 redPartial = 1;
//               }
//               if (response.red.endParking == 50) {
//                 redFull = 2;
//               }

//               gameData[i * 2] = {
//                 matchInformation: {
//                   matchNumber: tempSchedule[i].matchNumber,
//                   robotAlliance: 'blue',
//                   teams: [tempSchedule[i].teams.blue1, tempSchedule[i].teams.blue2]
//                 },
//                 auto: {
//                   landing: response.blue.landed / 30,
//                   sampling: response.blue.mineralSample / 25,
//                   claiming: response.blue.claimedDepot / 15,
//                   parking: response.blue.autoParking / 10
//                 },
//                 driver: {
//                   goldMineral: response.blue.landerGold / 5,
//                   silverMineral: response.blue.landerSilver / 5,
//                   anyMineral: response.blue.depotMinerals / 2
//                 },
//                 end: {
//                   latched: response.blue.latchedLander / 50,
//                   parkedCrater: bluePartial,
//                   parkedCompletelyCrater: blueFull
//                 }
//               };
//               gameData[i * 2 + 1] = {
//                 matchInformation: {
//                   matchNumber: tempSchedule[i].matchNumber,
//                   robotAlliance: 'red',
//                   teams: [tempSchedule[i].teams.red1, tempSchedule[i].teams.red2]
//                 },
//                 auto: {
//                   landing: response.red.landed / 30,
//                   sampling: response.red.mineralSample / 25,
//                   claiming: response.red.claimedDepot / 15,
//                   parking: response.red.autoParking / 10
//                 },
//                 driver: {
//                   goldMineral: response.red.landerGold / 5,
//                   silverMineral: response.red.landerSilver / 5,
//                   anyMineral: response.red.depotMinerals / 2
//                 },
//                 end: {
//                   latched: response.red.latchedLander / 50,
//                   parkedCrater: redPartial,
//                   parkedCompletelyCrater: redFull
//                 }
//               };
//               doneWhen0--;
//               if (doneWhen0 == 0) {
//                 console.log(request);
//                 axios
//                   .post(ip + '/api/events/ftc/event/uploadSync', request)
//                   .then(function(response) {
//                     console.log(response);
//                     alert('Sync Successful');
//                   })
//                   .catch(function(error) {
//                     alert(error);
//                   });
//               }
//             })
//             .catch(function(error) {
//               alert(error);
//             });
//         }
//       });
//     })
//     .catch(function(error) {
//       alert(error);
//     });
// };

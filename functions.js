var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var axios = require('axios');

let folderPath;

document.getElementById('findPath').onclick = () => {
    dialog.showOpenDialog({properties: ["openDirectory"]}, (fileNames) => {
        if(fileNames === undefined){
            alert('No folder was selected');
        } else {
            folderPath = fileNames[0];
            document.getElementById('folderPath').value = folderPath;
        }
    });
}

document.getElementById('uploadScheduleButton').onclick = () => {
    fs.readFile(folderPath + "/matches.txt", 'utf-8', (err, data) => {
        if(err) {
            alert(err);
            return;
        }

        if(folderPath === undefined) {
            alert('No folder is selected. Please locate the folder that the scoring system is in')
        } else {
            data = data.replace('', '');
            let x = data.split("\n");
            for(let i = 0; i < x.length; i++) {
                if(x[i] === "") {
                    x.splice(i,i+1);
                }
            }
            for(let i = 0; i < x.length; i++) {
                x[i] = x[i].split("|");
            }
            console.table(x)
            let y = [];
            for(let i=0; i < x.length; i++) {
                y.push({
                    matchNumber: i+1,
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
                })
            }
            scheduleArray = {
                _id: '1718-CAL-GAMES',
                schedule: y
            }
        }
        axios.post('http://192.168.1.19:3000/api/data/uploadSchedule', scheduleArray)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    })
}


document.getElementById('syncButton').onclick = () => {
    fs.readFile(folderPath, 'utf-8', (err, data) => {
        if(err) {
            alert(err);
            return;
        }

        if(folderPath === undefined) {
            alert('No folder is selected. Please locate the folder that the scoring system is in')
        } else {
            console.log(data)
        }
    })
}
const request = require('request');

get_random = function (list) {
    return list[Math.floor((Math.random() * list.length))];
}

// test data
const deviceinfo =
{
    "name": "",
    "macAddress": ""
}

const userinfo =
{
    "name": "",
    "password": "",
    "email": "",
    "phone": ""
}


const options = {
    method: 'POST',
    url: 'xxxxxxxx',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGMyYTkzM2JjZDlmYjMxYjg4ZjE4NjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1NzMxODkzNjEsImV4cCI6MTU3MzIxODE2MX0.ILRXisW5OVZEuFLhNGiS8_rfwoAhKvhZiTyrC2i8Fp0"
    },
    json: "xxxxxx",
};

function callback(error, response, body) {
    if (!error) {
        const info = JSON.parse(JSON.stringify(body));
        console.log(info);
    }
    else {
        console.log('Error happened: ' + error);
    }
}

for (let index = 10; index < 100; index++) {

    setTimeout((function (index) {
        return function () {
            /**
             * device 
             */
            // deviceinfo.name = "device" + index
            // deviceinfo.macAddress = "A7:2C:6D:03:8C:" + index
            // deviceinfo.type = "camera"
            // deviceinfo.status = false

            // options.url = "http://localhost:3000/api/v1/device/create"
            // options.json = deviceinfo

            /**
             * user 
             */
            userinfo.name = "useruser" + index
            userinfo.password = "useruser" + index
            userinfo.email = "user" + index + "@qq.com"
            userinfo.phone = "122222222" + index
            userinfo.role = "user"
            userinfo.status = false
            options.url = "http://localhost:3000/api/v1/user/create"
            options.json = userinfo

            request(options, callback)
        }
    })(index), (function (index) {
        return index * 1000
    })(index));

}
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
        'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGM2NWM2ZGVhNjg2NTAxYmNjNDdhMTgiLCJyb2xlIjoiNWRjNjVjOGNjZTU1MDcyNTM4YTc2ZjRjIiwiaWF0IjoxNTc1ODgzMDgzLCJleHAiOjE1NzU5MTE4ODN9.GOjO86VOtQ621-LcOF_GvpL9ZDyNnZh05Y5lA-q7Vnw"
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
            deviceinfo.name = "device" + index
            deviceinfo.macAddress = "A7:2C:6D:03:8C:" + index
            deviceinfo.type = "camera"
            options.url = "http://localhost:3000/api/v1/device/create"
            options.json = deviceinfo

            /**
             * user 
             */
            // userinfo.name = "useruser" + index
            // userinfo.password = "zcl19971222"
            // userinfo.email = "user" + index + "@qq.com"
            // userinfo.phone = "122222222" + index
            // userinfo.role = "5dd5361dc1e9260b74a24c89"
            // options.url = "http://localhost:3000/api/v1/user/create"
            // options.json = userinfo

            request(options, callback)
        }
    })(index), (function (index) {
        return index * 1000
    })(index));

}
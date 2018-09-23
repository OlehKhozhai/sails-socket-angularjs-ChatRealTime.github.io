angular.module('messages', [])
  .controller('messageFun', ['$http', '$scope', function ($http, $scope) {

    $scope.connect = function (channelName) {
      $http
        .get('http://localhost:1337/messages?where={"channelName":{"contains":"' + channelName + '"}}')
        .then(function (dataArray) {
          $scope.data[channelName] = dataArray.data;
        })

      io.socket.post('/on-connect', {
        channelName: channelName
      });
    }

    $scope.data = {
      it: [],
      sport: [],
      food: []
    };

    $scope.sendMessage = function (channelName) {
      let form = document.getElementById(channelName);
      let data = {
        channelName: channelName,
        text: form.elements["text"].value,
        userName: form.elements["userName"].value
      };

      io.socket.post('/send', data);
      form.reset();
    };

    io.socket.on('message', function (msg) {
      $scope.data[msg.channelName].push({
        userName: msg.userName,
        text: msg.text
      });
      $scope.$digest();
    });

    $scope.deleteMessage = function (message) {
      console.log(message)
    }

  }]);

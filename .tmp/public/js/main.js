angular.module('messages', [])
  .controller('messageFun', ['$http', '$scope', function ($http, $scope) {

    $scope.data = {
      it: [],
      sport: [],
      food: []
    };

    $scope._csrf = null
    $scope.getCSRFToken = (function () {
      $http.get('http://localhost:1337/csrfToken')
        .then(response => $scope._csrf = response.data._csrf);
    }());

    $scope.connect = function (channelName) {
      $http.get('http://localhost:1337/messages?where={"channelName":{"contains":"' + channelName + '"}}')
        .then(dataArray => $scope.data[channelName] = dataArray.data);

      io.socket.post('/on-connect', {
        channelName: channelName,
        _csrf: $scope._csrf
      });
    }; 

    $scope.sendMessage = function (channelName) {
      let form = document.getElementById(channelName);
      let data = {
        channelName: channelName,
        text: form.elements["text"].value,
        userName: form.elements["userName"].value,
        _csrf: $scope._csrf
      };

      if (data.text && data.userName != '') {
        io.socket.post('/send', data); 
        form.reset();
      };
    };

    $scope.deleteMessage = function (message, channelName) {
      io.socket.delete('/delete', {
        id: message.id,
        channelName: channelName,
        _csrf: $scope._csrf
      });
    }

    io.socket.on('message', function (msg) {
      $scope.data[msg.channelName].push({
        userName: msg.userName,
        text: msg.text,
        id: msg.id
      });
      $scope.$digest();
    });

    io.socket.on('delete', function (msg) {
      let i = $scope.data[msg.channelName].findIndex(obj => obj.id === msg.id);
      $scope.data[msg.channelName].splice(i, 1);
      $scope.$digest();
    });

  }]);
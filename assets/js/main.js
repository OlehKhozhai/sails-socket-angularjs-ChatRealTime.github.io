angular.module('messages', [])
  .controller('messageFun', ['$http', '$scope', function ($http, $scope) {

    $scope.data = {
      it: [],
      sport: [],
      food: []
    };

    $scope._csrf = null
    $scope.getCSRFToken = (function () {
      $http.get('/csrfToken')
        .then(response => $scope._csrf = response.data._csrf);
    })();

    $scope.connect = function (channelName) {
      $http.get('/messages?where={"channelName":{"contains":"' + channelName + '"}}')
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

      $scope.validationForm = (function (data) {
        if ((data.userName === '') || (data.text === '')) {
          alert('The field user name or text are empty');
        } else if ((data.text.length > 255) || (data.userName.length > 20)) {
          alert('User name more then 20 symbols or Your text more then 255 symbol');
        } else {
          io.socket.post('/send', data);
          form.reset();
        };
      });

      $scope.validationForm(data);

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
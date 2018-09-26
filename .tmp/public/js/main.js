angular.module('messages', [])
  .controller('messageFun', ['$http', '$scope', function ($http, $scope) {

    /*
        Метод connect приймає рядком назву каналу
        відправляє http get запит щоб отримати дані з монго
        отримані дані записуємо в масив і виводимо на екран 
        відправляємо post(socket) запит на routes.js файл з назвою метода та об'єктом з ключем та назвою каналу 
    */
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

    /* створюємо об'єкт data де будемо зберігати дані з чатів */

    $scope.data = {
      it: [],
      sport: [],
      food: []
    };

    /*
       Метод sendMessage приймає рядком назву каналу
       в змінну form записуємо об'єкт потрібної нам форми
       створюємо об'єкт data де будемо зберігати дані з форми 
       відправляємо post(socket) запит на routes.js файл з назвою метода та об'єктом форми
       reset() очищуємо поля форми і прирівнюємо їх до null для валідації
    */
    $scope.sendMessage = function (channelName) {
      let form = document.getElementById(channelName);
      let data = {
        channelName: channelName,
        text: form.elements["text"].value,
        userName: form.elements["userName"].value
      };

      io.socket.post('/send', data);
      form.reset();
      $scope.sportText = null;
      $scope.sportText1 = null;
      $scope.foodText = null;
      $scope.foodText1 = null;
      $scope.itText = null;
      $scope.itText1 = null;
    };

    /*
        отримуємо об'єкт з MessagesController зі змінами які записуємо в data[msg.channelName]
        $digest() дивиться за змінами в scope і викликає слухачів для рендерінгу
    */
    io.socket.on('message', function (msg) {
      $scope.data[msg.channelName].push({
        userName: msg.userName,
        text: msg.text,
        id: msg.id
      });
      $scope.$digest();
    });
    
    /*
        Метод deleteMessage приймає об'єкт повідомлення та назву каналу
        відправляємо delete(socket) запит на routes.js файл з назвою метода та об'єктом 
    */
    $scope.deleteMessage = function (message, channelName) {
      io.socket.delete('/delete', {
        id: message.id,
        channelName: channelName
      });
    }

    /*
       отримуємо об'єкт msg з MessagesController
       в зміну і записуємо index елемента з msg
       видаляємо з data[msg.channelName] елемент з index і
       $digest() дивиться за змінами в scope і викликає слухачів для рендерінгу
     */
    io.socket.on('delete', function (msg) {
      let i = $scope.data[msg.channelName].findIndex(obj => obj.id === msg.id);
      $scope.data[msg.channelName].splice(i, 1);
      $scope.$digest();
    });

  }]);
module.exports = {
  /*
        метод onConnect отримує request та response
        перевіряємо чи це isSocket
        якщо Socket, то підписуємось на request та назву каналу
  */
  onConnect: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest('Only socket accepted');
    }

    sails.sockets.join(req, req.param('channelName'));

  },

  /*
        метод send асинхронний, отримує request та response
        перевіряємо чи це isSocket
        якщо Socket, то підписуємось на request та назву каналу
        створюємо об'єкт message аналогічний тому що прийшов в request
        в змінній newMessage створюється об'єкт в БД
        метод broadcast отримує назву каналу та відправляє по ньому об'єкт повідомлення 
  */
  send: async function (req, res) {
      if (!req.isSocket) {
        return res.badRequest('Only socket accepted');
      }

      let message = {
        channelName: req.param('channelName'),
        text: req.param('text'),
        userName: req.param('userName')
      };

      let newMessage = await Messages.create(message).fetch();

      sails.sockets.broadcast(req.param('channelName'), newMessage);
    },

    /*
            метод delete асинхронний, отримує request та response
            перевіряємо чи це isSocket
            якщо Socket, то підписуємось на request та назву каналу
            метод destroy видаляє по id повідомлення з БД
            метод broadcast отримує назву каналу та відправляє об'єкт з id яке потрібно видалити
    */
    delete: async function (req, res) {
      if (!req.isSocket) {
        return res.badRequest('Only socket accepted');
      }

      await Messages.destroy({id: req.param('id')});
      let data = {
        id: req.param('id'),
        channelName: req.param('channelName')
      }
      sails.sockets.broadcast(req.param('channelName'), 'delete', data);
    }
};
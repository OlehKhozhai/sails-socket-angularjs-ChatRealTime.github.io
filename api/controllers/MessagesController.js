module.exports = {
  onConnect: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest('Only socket accepted');
    }

    sails.sockets.join(req, req.param('channelName'));
  
  },

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
    
    delete: async function (req, res) {
      if (!req.isSocket) {
        return res.badRequest('Only socket accepted');
      }
      
      await Messages.destroy({id: req.param('id') });
        let data = {
          id: req.param('id'),
          channelName: req.param('channelName')
        }
      sails.sockets.broadcast(req.param('channelName'), 'delete', data);
    }     
};

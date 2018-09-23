module.exports = {
  onConnect: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest('Only socket accepted');
    }

    sails.sockets.join(req, req.param('channelName'));

    return res.ok('Successfully connected to channel name - ' + req.param('channelName'));
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

    await Messages.create(message).fetch();
    
    sails.sockets.broadcast(req.param('channelName'), message);

    return res.ok();
  },
};

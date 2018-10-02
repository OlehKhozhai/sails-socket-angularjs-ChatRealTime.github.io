/**
 * Messages.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */   
 
module.exports = {   
  attributes: {
    channelName: {type: 'string', required: true},   
    text:  { type: 'string', required: true, maxLength: 255 },
    userName: { type: 'string', required: true, maxLength: 20 }   
  },
};
   
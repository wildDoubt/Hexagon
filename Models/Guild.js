const {model, Schema} = require('mongoose');

module.exports = model("Guild", new Schema({

    // Basic Information
    id:     String,
    prefix: { type: String, default: '!'},
    users : [{type:Schema.Types.ObjectId, ref: 'USER'}]

}));

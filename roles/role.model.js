const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    roleName: { type: String, required: true },
    hash: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Role', schema);
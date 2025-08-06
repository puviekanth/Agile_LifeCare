const mongoose = require('mongoose');

const NMRAschema = new mongoose.Schema({
 genericname:String,
 brandname:String,
 dosagecode:{ type: String, required: false },
});

const NMRAmodel = mongoose.model('nrma-list', NMRAschema);
module.exports = NMRAmodel;
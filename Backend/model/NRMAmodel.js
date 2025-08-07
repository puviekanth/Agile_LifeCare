const mongoose = require('mongoose');

const NMRAschema = new mongoose.Schema({
 genericname:String,
 brandname:String,
 dosagecode:{ type: String, required: false },
 filepath:String,
});

const NMRAmodel = mongoose.model('nrma-list', NMRAschema);
module.exports = NMRAmodel;
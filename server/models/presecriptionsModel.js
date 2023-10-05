const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const presecriptionsSchema = new Schema({
    PatientID : {
        type: String,
        required: true,
    },
    DoctorID : {
        type: String,
        required: true,
    },
    location : {
        type: [String],
        default : [],
    },
    
},{ timestamps: true });

const presecriptions = mongoose.model('presecriptions', presecriptionsSchema);

module.exports = presecriptions;
const {Schema, model} = require('mongoose');

const addressSchema = new Schema({
    street: {type: String, required: true, trim: true, maxlength: [100, 'street name must be less than  100 characters']},
    city: {type: String, required: true, trim: true, maxlength: [50, 'city must be less than 50 character']},
    region: {type: String, required: true, trim: true, maxlength: [50, 'city name msut be less than 100 characters']},
    postalCode: {type: String, required: true, trim:true, maxlength: [10, 'Postal code must be less than 10 characters']},
    country: {type:String, required: true, trim: true, maxlength: [50, 'Country name must be less than 50 characters']},
    IsActive: {type: Boolean, default: true}

}, {timestamps: true});

const Address = model('Address', addressSchema);
module.exports =Address;
const Joi = require('joi'); // Use Joi for complex rules

const validateIfNumber = (value,errMsg) => {
    const schema = Joi.number().required();
    const { error } = schema.validate(value);
    if (error) {
        throw new Error(errMsg)
    }
};

const validateIfString = (value,errMsg) => {
    const schema = Joi.string().required();
    const { error } = schema.validate(value);
    if (error) {
        throw new Error(errMsg)
    }
};

const validateIfEmail = (value,errMsg) => {
    const schema = Joi.string().email().required();
    const { error } = schema.validate(value);
    if (error) {
        throw new Error(errMsg)
    }
};

const validateMultipleStrings = (values, errMsg) => {
    if (!Array.isArray(values)) {
        throw new Error('The input should be an array');
    }
    values.forEach(value => {
        const schema = Joi.string().required();
        
        const {error} = schema.validate(value)
        if(error) {
            throw new Error(errMsg)
        }
    })
    

}
const validateMultipleNumbers = (values, errMsg) => {
    if (!Array.isArray(values)) {
        throw new Error('The input should be an array');
    }

    values.forEach(value => {
        const schema = Joi.number().required();
        
        const {error} = schema.validate(value)
        if(error) {
            throw new Error(errMsg)
        }
    })
    
}

module.exports = {
    validateIfNumber,
    validateIfString,
    validateIfEmail,
    validateMultipleNumbers,
    validateMultipleStrings
};

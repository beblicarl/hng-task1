const Joi = require('joi')

const nonOpenAiSchema = Joi.object({

        operation_type : Joi.string()
                .required()
                .valid('addition', 'subtraction', 'multiplication'),
        x : Joi.number()
            .required(),
        y : Joi.number()
            .required()

})

const openAiSchema = Joi.object({

        operation_type : Joi.string()
                .required()
            
})


const validate = (schema, data) => {
    const validationOptions = {
		abortEarly: false, // abort after the last validation error
		allowUnknown: true, // allow unknown keys that will be ignored
		stripUnknown: true // remove unknown keys from the validated data
	}
   return schema.validateAsync(data, validationOptions)
} 

module.exports = {
    validate,
    nonOpenAiSchema,
    openAiSchema
}
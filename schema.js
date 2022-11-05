const Joi = require('joi')

const validationSchema = Joi.object({
    operation_type : Joi.string().required(),
    x : Joi.number(),
    y : Joi.number()

})
.when(
    Joi.object({ x: Joi.exist(), y: Joi.exist() }), {
    then: Joi.object({
        operation_type: Joi.string().valid('addition', 'subtraction', 'multiplication')
    })
})
.with('x','y')



const validate = (schema, data) => {
    const validationOptions = {
		abortEarly: false, // abort after the last validation error
		allowUnknown: true, // allow unknown keys that will be ignored
		stripUnknown: true // remove unknown keys from the validated data
	}
  return schema.validate(data, validationOptions)
} 

module.exports = {
    validate,
    validationSchema
}

const JoiError = (error) => {

 const result = {
    status: 'failed',
    error: {
        original: error._object,                  
        message : error.details.map(({ message }) => (
            message.replace(/['"]/g, '')             
        )).join(', ')
    }
}
 return result
}
module.exports = JoiError
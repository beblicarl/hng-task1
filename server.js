const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const {
  validationSchema,
  validate
} = require('./schema')
const JoiError = require('./utils')

const app = express()
const PORT = 3000
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Hello World")
  })

app.post('/' ,  async (req, res) => {
  const {operation_type , x , y} = req.body
  const {value, error} = validate(validationSchema, {operation_type, x, y})
  let { x: a, y: b , operation_type: operationType } = value
        if (error) { 
          const result = JoiError(error)
            return res.status(400)
                .json(result)
        }
 
  let response
  
  if ( a || b ){
    const basicOp = (operation_type, x, y) => 
      ({
        "addition": x + y,
        "add" : x + y,
        "sum" : x + y,
        "subtraction": x - y,
        "minus": x -y,
        "multiplication": x * y
      }[operation_type])
  response = basicOp(operationType, a, b)
 }
 else {      
  response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: operationType,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  if (/add/.test(operationType)) {
    operationType = "addition"
    }
  else if (/subtract/.test(operationType)) {
    operationType = "subtraction"
    } 
  else if (/multiply/.test(operationType)) {
    operationType = "multiplication"
    }
   else {
    "invalid operation type"
   }
 
  const data = response.data.choices[0].text.trimStart()
  const split = data.split(" ")
  response = parseInt(split[split.length - 1])
}
  res.status(200).json({ 
    'slackUsername': 'beblicarl' , 
    "operation_type" : operationType , 
    result : response})
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
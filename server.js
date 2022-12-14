const express = require('express');
const app = express()
const cors = require('cors')
require('dotenv').config()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration);


app.get('/', (req, res) => {
    res.send("Hello World")
  })

app.post('/' ,  async (req, res) => {
  let {operation_type , x , y} = req.body
 
  let response
  
  if( x && y ){
    const basicOp = (operation_type, x, y) =>
        ({
          "addition": x + y,
          "add" : x + y,
          "sum" : x + y,
          "subtraction": x - y,
          "minus": x -y,
          "multiplication": x * y
        }[operation_type])

  response = basicOp(operation_type, x, y)
  }
  else {
    
  
  response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: operation_type,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  if (/add/.test(operation_type)) {
    operation_type = "addition"
    }
  else if (/subtract/.test(operation_type)) {
    operation_type = "subtraction"
    } 
  else if (/multiply/.test(operation_type)) {
    operation_type = "multiplication"
    }
   else {
    "invalid operation_type"
   }
 

  const data = response.data.choices[0].text.trimStart()
  const split = data.split(" ")
  response = parseInt(split[split.length - 1])
  
}


  res.status(200).json({ 'slackUsername': 'beblicarl' , "operation_type" : operation_type , result : response})
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
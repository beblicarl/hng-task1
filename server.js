const express = require('express');
const app = express();
const cors = require('cors')
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello World")
  })

app.post('/calculation' , (req, res) => {
  const {operation_type , x , y} = req.body
  const basicOp = (operation_type, x, y) =>
  ({
    "addition": x + y,
    "subtraction": x - y,
    "multiplication": x * y,
    "division": x / y,
  }[operation_type])


  res.json({ 'slackUsername': 'beblicarl', "operation_type" : operation_type, result: basicOp(operation_type, x, y) })
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
  })
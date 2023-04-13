const express = require('express');
const cors = require("cors") 
const app = express();
const port = 4040;

app.use(express.static('public'));
app.use(cors())
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
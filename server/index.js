const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const Routes = require('./routes/routes')

const PORT = process.env.PORT || 3000;

// Allow requests from any origin
app.use(cors());
// Configure body limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/', Routes);

// Server starting
app.listen(PORT, () => {
  console.log(`[*] Server started on: http://localhost:${PORT}`)
});
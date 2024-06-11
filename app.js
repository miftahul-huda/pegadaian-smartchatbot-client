const express = require('express');
const path = require('path');  // Required for path manipulation

const app = express();

// Set the static folder path
const staticPath = path.join(__dirname, 'public');  // Assuming 'public' folder stores your static files

// Serve static files from the 'public' directory
app.use(express.static(staticPath));

// Any remaining routes (not static files) can be handled here

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

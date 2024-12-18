import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname from import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all other requests by serving the index.html file
app.get('*', (req, res) => {
  const indexFile = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexFile);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

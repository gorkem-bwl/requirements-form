const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Read JSON file
function readJsonFile() {
  const filePath = path.join(__dirname, 'requirements.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

// Write JSON file
function writeJsonFile(data) {
  const filePath = path.join(__dirname, 'requirements.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/requirements', (req, res) => {
  const data = readJsonFile();
  res.json(data);
});

app.get('/api/requirements/:category/:index', (req, res) => {
  const data = readJsonFile();
  const { category, index } = req.params;
  const categoryData = data.euAiActRequirements[category][index];
  res.json(categoryData);
});

app.post('/api/save/:category/:index', (req, res) => {
  const data = readJsonFile();
  const { category, index } = req.params;
  const updatedData = req.body;
  data.euAiActRequirements[category][index] = updatedData;
  writeJsonFile(data);
  res.json({ message: 'Data saved successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

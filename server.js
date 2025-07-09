
const express = require('express');
const cors = require('cors');
const { CohereClient } = require('cohere-ai');

const app = express();
const port = 3000;

const cohere = new CohereClient({
  token: 'F47WO9r5jXZtIsJw1dwmnh9wZR1htEpIZXqNYXju' 
});

app.use(cors());
app.use(express.json());

app.post('/explain', async (req, res) => {
  const sqlQuery = req.body.query;
  if (!sqlQuery) {
    return res.status(400).json({ error: 'No SQL query provided' });
  }

  try {
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `Explain this SQL query in simple English:\n\n${sqlQuery}`,
      max_tokens: 150,
      temperature: 0.5
    });

    const explanation = response.generations[0].text.trim();
    res.json({ explanation });

  } catch (err) {
    console.error('Cohere error:', err);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

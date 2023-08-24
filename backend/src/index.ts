import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes

let drawnNumbers: number[] = []; // List to store drawn numbers
let generatedCards: number[][][] = [];

const getRandomNumber = (min: number, max: number, exclude: number[] = []): number => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (exclude.includes(randomNumber));
  return randomNumber;
};

app.get('/getNumber', (req, res) => {
  if (drawnNumbers.length >= 75) {
    return res.status(400).json({ error: 'All numbers have been drawn' });
  }
  
  const number = getRandomNumber(1, 75, drawnNumbers);
  drawnNumbers.push(number); // Storing the drawn number
  res.json({ number });
});

app.get('/generateCard', (req, res) => {
  const card: number[][] = [];

  for (let i = 0; i < 5; i++) {
    const column: number[] = [];
    const min = i * 15 + 1;
    const max = min + 14;

    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2) {
        column.push(0);
        continue;
      }

      column.push(getRandomNumber(min, max, column));
    }

    card.push(column);
  }

  generatedCards.push(card);
  res.json({ card });
});

app.post('/generateNCards', express.json(), (req, res) => {
    const numberOfCards = req.body.n;
    
    if (typeof numberOfCards !== 'number' || numberOfCards <= 0) {
      return res.status(400).json({ error: 'Invalid input. Please provide a positive integer for N.' });
    }
  
    const cards: number[][][] = [];
    generatedCards = [];
    for (let k = 0; k < numberOfCards; k++) {
      const card: number[][] = [];
      for (let i = 0; i < 5; i++) {
        const column: number[] = [];
        const min = i * 15 + 1;
        const max = min + 14;
  
        for (let j = 0; j < 5; j++) {
          if (i === 2 && j === 2) {
            column.push(0);
            continue;
          }
  
          column.push(getRandomNumber(min, max, column));
        }
        card.push(column);
      }
      cards.push(card);
      generatedCards.push(card);  // Save the card in the generatedCards array
    }
  
    res.json(generatedCards);
  });

// Endpoint to clear the list of drawn numbers
app.get('/clearDrawnNumbers', (req, res) => {
  drawnNumbers = [];
  res.json({ message: 'List of drawn numbers cleared' });
});

// Endpoint to view the list of drawn numbers
app.get('/getDrawnNumbers', (req, res) => {
  res.json(drawnNumbers);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
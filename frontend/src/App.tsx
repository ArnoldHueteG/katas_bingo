import React, { useState } from 'react';
import './App.css';

type Card = number[][];

const BingoApp: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [numberOfCards, setNumberOfCards] = useState<number>(2); // default to 2
  const [hasGeneratedCards, setHasGeneratedCards] = useState<boolean>(false); // New state
  const [winningCards, setWinningCards] = useState<number[]>([]);


  const generateCards = async () => {
    try {
      const response = await fetch('http://localhost:3001/generateNCards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ n: numberOfCards }),
      });

      const data = await response.json();
      setCards(data);
      setHasGeneratedCards(true); // set to true after generating cards
    } catch (error) {
      console.error("Error generating cards:", error);
    }
  };

  const checkWin = (card: Card): boolean => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (card[i].every(num => calledNumbers.includes(num) || num === 0)) {
        return true;
      }
    }
  
    // Check columns
    for (let i = 0; i < 5; i++) {
      if (card.every(row => calledNumbers.includes(row[i]) || row[i] === 0)) {
        return true;
      }
    }
  
    // Check diagonals
    const diagonal1 = card.every((row, index) => calledNumbers.includes(row[index]) || row[index] === 0);
    const diagonal2 = card.every((row, index) => calledNumbers.includes(row[4 - index]) || row[4 - index] === 0);
  
    return diagonal1 || diagonal2;
  };

  const callNumber = async () => {
    try {
      const response = await fetch('http://localhost:3001/getNumber');
      const { number } = await response.json();
      setLastCalledNumber(number);

      const drawnNumbersResponse = await fetch('http://localhost:3001/getDrawnNumbers');
      const drawnNumbers = await drawnNumbersResponse.json();
      setCalledNumbers(drawnNumbers);
      const newWinningCards = cards.map((card, index) => checkWin(card) ? index : null)
                                  .filter(index => index !== null)
                                  .map(index => index as number); // Cast null to number

    setWinningCards(prevState => [...new Set([...prevState, ...newWinningCards])]);
    } catch (error) {
      console.error("Error calling number:", error);
    }

  };

  const clearNumbers = async () => {
    try {
      await fetch('http://localhost:3001/clearDrawnNumbers', { method: 'GET' });
      setCalledNumbers([]);
      setLastCalledNumber(null);
    } catch (error) {
      console.error("Error clearing numbers:", error);
    }
  };

  return (
    <div>
      {!hasGeneratedCards ? (
        <>
          <label>
            Number of Cards:
            <input 
              type="number" 
              value={numberOfCards} 
              onChange={(e) => setNumberOfCards(Number(e.target.value))} 
            />
          </label>
          <button onClick={generateCards}>Generate Cards</button>
        </>
      ) : (
        <>
          <button onClick={callNumber}>Call Number</button>
          <button onClick={clearNumbers}>Clear Numbers</button>
          
          <div>
            {lastCalledNumber !== null && <p>Last Called Number: {lastCalledNumber}</p>}
            <p>Called Numbers: {calledNumbers.join(", ")}</p>
          </div>

          <div className="cards-container">
            {cards.map((card, index) => (
              <div key={index} className={`bingo-card ${winningCards.includes(index) ? 'winning-card' : ''}`}>
                {card.flat().map((number, cellIndex) => {
                  const isMarked = calledNumbers.includes(number);
                  return (
                    <div 
                      key={cellIndex} 
                      className={`bingo-cell ${number === 0 ? "center-cell" : ""} ${isMarked ? "marked-number" : ""}`}
                    >
                      {number !== 0 ? number : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
}

export default BingoApp;

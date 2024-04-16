import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/style.css";

const Card = ({ card }) => (
  <img src={card.image} alt={card.code} />
);

const Score = ({ score }) => (
  <div className="score-container">
    <p>Score: {score}</p>
  </div>
);

const App = () => {
  const [deckId, setDeckId] = useState("");
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchDeckId = async () => {
      try {
        const response = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        setDeckId(response.data.deck_id);
      } catch (error) {
        console.error("Error fetching deck ID:", error.message);
      }
    };

    fetchDeckId();
  }, []);

  const fetchCards = async (deckId) => {
    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
      );
      setCards(response.data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error.message);
    }
  };

  const drawCards = () => {
    setShowScore(true);
    fetchCards(deckId);
  };

  useEffect(() => {
    if (deckId) {
      fetchCards(deckId);
    }
  }, [deckId]);

  useEffect(() => {
    if (cards.length > 0) {
      const values = cards.map((card) => {
        switch (card.value) {
          case "KING":
          case "QUEEN":
          case "JACK":
            return 10;
          case "ACE":
            return 11;
          default:
            return parseInt(card.value) || 0;
        }
      });
      const totalScore = values.reduce((acc, curr) => acc + curr, 0);
      setScore(totalScore);
    }
  }, [cards]);

  return (
    <div className="App">
      <div className="buttonDiv">
        <button onClick={drawCards}>Draw Cards</button>
      </div>

      <div className="card-container">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>

      {showScore && <Score score={score} />}
    </div>
  );
};

export default App;

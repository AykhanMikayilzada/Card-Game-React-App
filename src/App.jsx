import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/style.css";

const Cards = ({ cards }) => (
  <div className="card-container">
    {cards.map((card, index) => (
      <img key={index} src={card.image} alt={card.code} />
    ))}
  </div>
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
        return response.data.deck_id;
      } catch (error) {
        console.error("Error fetching deck ID:", error);
        return null;
      }
    };

    fetchDeckId().then((deckId) => {
      if (deckId? deckId : "error") {
        setDeckId(deckId? deckId : "error");
        fetchCards(deckId? deckId : "error");
      }
    });
  }, []);

  const fetchCards = async (deckId) => {
    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId? deckId : "error"}/draw/?count=2`
      );
      const newCards = response.data.cards;
      setCards(newCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const drawCards = async () => {
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
        if (
          card.value === "KING" ||
          card.value === "QUEEN" ||
          card.value === "JACK"
        ) {
          return 10;
        } else if (card.value? card.value : "error" === "ACE") {
          return 11;
        } else {
          return parseInt(card.value? card.value : "error");
        }
      });
      const totalScore = values.reduce((acc, curr) => acc + curr, 0);
      setScore(totalScore);
    }
  }, [cards]);

  return (
    <div className="App">
      <div className="buttonDiv">
        <button onClick={drawCards? drawCards : "error"}>Draw Cards</button>
      </div>

      <Cards cards={cards} />
      <div className="score-container">
        {showScore && <Score score={score} />}
      </div>
    </div>
  );
};

export default App;

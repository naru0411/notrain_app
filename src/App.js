import React, { useState, useEffect } from 'react';
import './App.css';

const hands = ['グー', 'チョキ', 'パー'];
const instructions = ['勝って', '負けて', 'あいこ'];

// じゃんけんの手に対応する画像
const handImages = {
  'グー': '/images/rock.png',
  'チョキ': '/images/scissors.png',
  'パー': '/images/paper.png',
};

function App() {
  const [opponentHand, setOpponentHand] = useState('');
  const [instruction, setInstruction] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);

  // ランダムな問題を生成
  const generateQuestion = () => {
    const randomHand = hands[Math.floor(Math.random() * hands.length)];
    const randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];
    setOpponentHand(randomHand);
    setInstruction(randomInstruction);
  };

  // 正誤判定
  const judge = (user, opponent, instruction) => {
    const win = (u, o) =>
      (u === 'グー' && o === 'チョキ') ||
      (u === 'チョキ' && o === 'パー') ||
      (u === 'パー' && o === 'グー');

    if (instruction === '勝って') return win(user, opponent);
    if (instruction === '負けて') return win(opponent, user);
    return user === opponent;
  };

  // ユーザーが手を選んだとき
  const handleSelect = (userHand) => {
    if (isGameOver) return;

    const correct = judge(userHand, opponentHand, instruction);
    if (correct) setScore((prev) => prev + 100);
    generateQuestion();
  };

  // タイマー処理
  useEffect(() => {
    generateQuestion();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <h1>じゃんけんゲーム</h1>
      <p>残り時間: {timeLeft}秒</p>
      <p>スコア: {score}</p>

      {!isGameOver ? (
        <>
          <h2>相手の手:</h2>
          <img src={handImages[opponentHand]} alt={opponentHand} width={120} />

          <h2>指示: {instruction}</h2>

          <div className="hands">
            {hands.map((hand) => (
              <button key={hand} onClick={() => handleSelect(hand)}>
                <img src={handImages[hand]} alt={hand} width={100} />
                <div>{hand}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>終了！</h2>
          <p>あなたのスコアは {score} 点です</p>
          <button onClick={() => window.location.reload()}>もう一度</button>
          <br />
          <button onClick={() => window.location.href = '/calendar'}>
            カレンダーページへ
          </button>
        </>
      )}
    </div>
  );
}

export default App;



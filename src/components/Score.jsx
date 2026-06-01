import "./Score.css";
export default function Score({ score }) {
  console.log("Score component received score:", score);
  return <div className="score">Score: {score}</div>;
}

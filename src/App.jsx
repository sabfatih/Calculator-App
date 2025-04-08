import "./App.css";
import Calculator from "./components/Calculator";

function App() {
  return (
    <>
      <header className="text-center my-5">
        <span className="text-5xl font-extrabold bg-gradient-to-l from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Calculator
        </span>
      </header>
      <Calculator />
    </>
  );
}

export default App;

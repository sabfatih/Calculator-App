import "./App.css";
import Calculator from "./components/Calculator";

function App() {
  return (
    <>
      <div className="-z-10 w-full min-h-screen absolute inset-0 bg-gradient-to-b from-slate-600 to-purple-700"></div>
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

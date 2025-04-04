import React, { useEffect, useRef, useState } from "react";

const Calculator = () => {
  // const inputRef = useRef(null);

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  const [inputUser, setInputUser] = useState("0");
  const [result, setResult] = useState("0");

  const checkOperators = (calculation, percentCalcsArgs) => {
    const operators = ["+", "-", "*", "/"];

    if (operators.includes(calculation.slice(-1))) {
      const result = calculation.slice(0, -1);
      return checkOperators(result);
    } else {
      let percentCalcs = percentCalcsArgs || [];

      const divideByZeroRegex = /\/0/;
      const isDivideByZero = calculation.match(divideByZeroRegex);

      if (isDivideByZero) {
        setResult("Error");
        return false;
      }

      const percentNumberRegex = /(\d+)%/;
      const hasPercentCalculation = calculation.match(percentNumberRegex);

      if (hasPercentCalculation) {
        const splitInIndex = operators
          .map((operator) => calculation.lastIndexOf(operator))
          .sort((a, b) => b - a)[0];

        const calc = calculation.slice(0, splitInIndex);
        const percentCalc = calculation.slice(splitInIndex);
        percentCalcs.push(percentCalc);

        return checkOperators(calc, percentCalcs);
      } else {
        const calculate1 = (calcYee) => {
          const calculate = new Function(`return ${calcYee}`)();
          if (percentCalcs.length > 0) {
            const percent = percentCalcs[0].replace("%", "/100");

            let result;
            if (percent[0] == "*" || percent[0] == "/") {
              const percentLogic = new Function(
                `return ${calculate + percent}`
              )();

              result = percentLogic;
            } else {
              const percentLogic = new Function(
                `return ${calculate + "*" + percent}`
              )();
              result = calculate + percentLogic;
            }
            percentCalcs.shift();
            return calculate1(result);
          } else {
            return calculate;
          }
        };

        const finalResult = calculate1(calculation);
        console.log(" checkOperators ~ finalResult", finalResult);
        return finalResult;
      }
    }
  };

  useEffect(() => {
    const calculation = checkOperators(
      inputUser.replaceAll("×", "*").replaceAll("--", "+").replaceAll("+-", "-")
    );
    console.log(" useEffect ~ calculation", calculation);

    setResult(calculation);
  }, [inputUser]);

  return (
    <div className="mx-4 px-3 py-4">
      <div className="mx-auto w-72 rounded-md bg-purple-400 px-5 py-6">
        {/* <label className="text-right flex flex-col pt-8 px-3">
          <input
            type="text"
            ref={inputRef}
            className="bg-none text-xl ml-auto outline-none text-neutral-800"
          />
          <p className="">123</p>
        </label> 
        */}

        <div className="flex flex-col">
          <p className="ml-auto text-2xl font-semibold">{inputUser}</p>
          <p className="ml-auto text-xl">{result}</p>
        </div>
        <hr className="border-t-1 my-1" />
        {/* Buttons */}
        <div className="mt-3 grid grid-cols-4 grid-rows-5 gap-3 place-items-center">
          <ClearButton setInputUser={setInputUser} />
          <Button input={"%"} setInputUser={setInputUser} />
          <BackspaceButton setInputUser={setInputUser} />
          <Button input={"/"} setInputUser={setInputUser} />

          <Button input={"7"} setInputUser={setInputUser} />
          <Button input={"8"} setInputUser={setInputUser} />
          <Button input={"9"} setInputUser={setInputUser} />
          <Button input={"+"} setInputUser={setInputUser} />

          <Button input={"4"} setInputUser={setInputUser} />
          <Button input={"5"} setInputUser={setInputUser} />
          <Button input={"6"} setInputUser={setInputUser} />
          <Button input={"-"} setInputUser={setInputUser} />

          <Button input={"1"} setInputUser={setInputUser} />
          <Button input={"2"} setInputUser={setInputUser} />
          <Button input={"3"} setInputUser={setInputUser} />
          <Button input={"×"} setInputUser={setInputUser} />

          <Button input={<IconExpand />} />
          <Button input={"0"} setInputUser={setInputUser} />
          <EqualButton setInputUser={setInputUser} result={result} />
        </div>
      </div>
    </div>
  );
};

const Button = ({ input, setInputUser }) => {
  return (
    <button
      onClick={() => {
        const operators = ["+", "-", "×", "/"];

        setInputUser((prev) => {
          if (prev == "0") {
            if (operators.includes(input) || input == "%") {
              return "0";
            } else {
              return input;
            }
          } else {
            if (
              (operators.includes(prev.slice(-1)) &&
                (input == "+" ||
                  input == "×" ||
                  input == "/" ||
                  input == "%")) ||
              (operators.includes(prev.slice(-1)) &&
                operators.includes(prev.slice(-2, -1)) &&
                input == "-")
            ) {
              return prev;
            } else {
              return prev + input;
            }
          }
        });
      }}
      className="w-full h-12 text-2xl rounded-md bg-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
    >
      {input}
    </button>
  );
};

const ClearButton = ({ setInputUser }) => {
  return (
    <button
      onClick={() => {
        setInputUser("0");
      }}
      className="w-full h-12 text-2xl rounded-md bg-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
    >
      C
    </button>
  );
};

const BackspaceButton = ({ setInputUser }) => {
  return (
    <button
      onClick={() => {
        setInputUser((prev) => {
          if (prev.length == 1) {
            return "0";
          } else {
            return prev.slice(0, -1);
          }
        });
      }}
      className="w-full h-12 text-2xl rounded-md bg-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
    >
      <IconBackspace />
    </button>
  );
};

const EqualButton = ({ setInputUser, result }) => {
  return (
    <button
      onClick={() => {
        setInputUser(result.toString());
      }}
      className="w-full h-12 text-2xl col-span-2 rounded-md bg-orange-400 text-slate-300 cursor-pointer hover:bg-orange-500 transition-colors"
    >
      =
    </button>
  );
};

const IconExpand = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 m-auto"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  );
};
const IconBackspace = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 m-auto"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
      />
    </svg>
  );
};

export default Calculator;

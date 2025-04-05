import React, { useEffect, useRef, useState } from "react";

const Calculator = () => {
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);
  const button3Ref = useRef(null);
  const button4Ref = useRef(null);
  const button5Ref = useRef(null);
  const button6Ref = useRef(null);
  const button7Ref = useRef(null);
  const button8Ref = useRef(null);
  const button9Ref = useRef(null);
  const button0Ref = useRef(null);
  const buttonDotRef = useRef(null);
  const buttonPercentRef = useRef(null);
  const buttonPlusRef = useRef(null);
  const buttonMinusRef = useRef(null);
  const buttonMultipleRef = useRef(null);
  const buttonDivideRef = useRef(null);
  const buttonClearRef = useRef(null);
  const buttonBackspaceRef = useRef(null);
  const buttonEqualRef = useRef(null);

  useEffect(() => {
    const keyHandler = (e) => {
      const key = e.key;

      if (key === "0") button0Ref.current?.click();
      else if (key === "1") button1Ref.current?.click();
      else if (key === "2") button2Ref.current?.click();
      else if (key === "3") button3Ref.current?.click();
      else if (key === "4") button4Ref.current?.click();
      else if (key === "5") button5Ref.current?.click();
      else if (key === "6") button6Ref.current?.click();
      else if (key === "7") button7Ref.current?.click();
      else if (key === "8") button8Ref.current?.click();
      else if (key === "9") button9Ref.current?.click();
      else if (key === ".") buttonDotRef.current?.click();
      else if (key === "%") buttonPercentRef.current?.click();
      else if (key === "+") buttonPlusRef.current?.click();
      else if (key === "-") buttonMinusRef.current?.click();
      else if (key === "*") buttonMultipleRef.current?.click();
      else if (key === "/") buttonDivideRef.current?.click();
      else if (key === "Enter" || key === "=") buttonEqualRef.current?.click();
      else if (key === "Backspace") buttonBackspaceRef.current?.click();
      else if (key.toLowerCase() === "c") buttonClearRef.current?.click();
    };

    window.addEventListener("keydown", (e) => keyHandler(e));

    return window.removeEventListener("keydown", (e) => keyHandler(e));
  }, []);
  const [inputUser, setInputUser] = useState("");
  const [result, setResult] = useState("0");
  // const inputRef = useRef(null);

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  const checkOperators = (calculation, percentCalcsArgs) => {
    const removeLastChar = ["+", "-", "*", "/", "."];
    const operators = ["+", "-", "*", "/"];

    if (removeLastChar.includes(calculation.slice(-1))) {
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
        const lastOperator = operators
          .map((operator) => calculation.lastIndexOf(operator))
          .sort((a, b) => b - a)[0];

        const calc = calculation.slice(0, lastOperator);
        const percentCalc = calculation.slice(lastOperator);
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
        // console.log(calculation);
        const finalResult = calculate1(calculation);
        // console.log(" checkOperators ~ finalResult", finalResult);
        return finalResult;
      }
    }
  };

  useEffect(() => {
    const calculation = checkOperators(
      inputUser
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replaceAll("--", "+")
        .replaceAll("+-", "-")
    );
    // console.log(" useEffect ~ calculation", calculation);

    setResult(calculation);
  }, [inputUser]);

  return (
    <div className="mx-4 px-3 py-4">
      <div className="mx-auto w-72 rounded-md bg-purple-400 px-5 py-6">
        <div className="flex flex-col">
          <p
            className={`text-right outline-none text-3xl font-semibold h-10 ${
              !inputUser.length > 0 ? "border-r" : ""
            }`}
          >
            {inputUser}
          </p>
          <p className="ml-auto text-xl mt-1 opacity-60 min-h-7">{result}</p>
        </div>
        <hr className="border-t-1 my-1" />
        {/* Buttons */}
        <div className="mt-3 grid grid-cols-4 grid-rows-5 gap-3 place-items-center">
          <ClearButton setInputUser={setInputUser} buttonRef={buttonClearRef} />
          <Button
            input={"%"}
            setInputUser={setInputUser}
            buttonRef={buttonPercentRef}
          />
          <BackspaceButton
            setInputUser={setInputUser}
            buttonRef={buttonBackspaceRef}
          />
          <Button
            input={"÷"}
            setInputUser={setInputUser}
            buttonRef={buttonDivideRef}
          />

          <Button
            input={"7"}
            setInputUser={setInputUser}
            buttonRef={button7Ref}
          />
          <Button
            input={"8"}
            setInputUser={setInputUser}
            buttonRef={button8Ref}
          />
          <Button
            input={"9"}
            setInputUser={setInputUser}
            buttonRef={button9Ref}
          />
          <Button
            input={"+"}
            setInputUser={setInputUser}
            buttonRef={buttonPlusRef}
          />

          <Button
            input={"4"}
            setInputUser={setInputUser}
            buttonRef={button4Ref}
          />
          <Button
            input={"5"}
            setInputUser={setInputUser}
            buttonRef={button5Ref}
          />
          <Button
            input={"6"}
            setInputUser={setInputUser}
            buttonRef={button6Ref}
          />
          <Button
            input={"-"}
            setInputUser={setInputUser}
            buttonRef={buttonMinusRef}
          />

          <Button
            input={"1"}
            setInputUser={setInputUser}
            buttonRef={button1Ref}
          />
          <Button
            input={"2"}
            setInputUser={setInputUser}
            buttonRef={button2Ref}
          />
          <Button
            input={"3"}
            setInputUser={setInputUser}
            buttonRef={button3Ref}
          />
          <Button
            input={"×"}
            setInputUser={setInputUser}
            buttonRef={buttonMultipleRef}
          />

          <Button
            input={"."}
            setInputUser={setInputUser}
            buttonRef={buttonDotRef}
          />
          <Button
            input={"0"}
            setInputUser={setInputUser}
            buttonRef={button0Ref}
          />
          <EqualButton
            setInputUser={setInputUser}
            result={result}
            buttonRef={buttonEqualRef}
          />
        </div>
      </div>
    </div>
  );
};

const Button = ({ input, setInputUser, buttonRef }) => {
  const buttonHandler = (input) => {
    const operators = ["+", "-", "×", "÷"];

    setInputUser((prev) => {
      let acceptedInput = "";
      let finalResult = "";

      if (prev == "") {
        if (input == "+" || input == "×" || input == "÷" || input == "%") {
          acceptedInput = "";
        } else {
          acceptedInput = input;
        }

        // return acceptedInput;
        finalResult = acceptedInput;
      } else {
        const splitIndex = operators
          .map((operator) => prev.lastIndexOf(operator))
          .sort((a, b) => b - a)[0];
        const lastNumber = prev.slice(splitIndex + 1);

        if (
          (operators.includes(prev.slice(-1)) &&
            (input == "+" || input == "×" || input == "÷" || input == "%")) ||
          // all of these 4, operators(except "-") and "%" can't be inputted after operators
          (operators.includes(prev.slice(-1)) &&
            operators.includes(prev.slice(-2, -1)) &&
            input == "-") || // preventing repeated "-" because previous logic
          (prev.slice(-1) == "." && input == ".") || // no coma repeated
          (lastNumber.indexOf(".") > 0 && input == ".") // no more than 1 coma in decimal
        ) {
          // return prev;
        } else {
          acceptedInput = input;
        }

        // return prev + acceptedInput;
        finalResult = prev + acceptedInput;
      }

      console.log(" setInputUser ~ finalResult", finalResult);
      return finalResult;
    });
  };

  return (
    <button
      onClick={() => {
        buttonHandler(input);
      }}
      ref={buttonRef}
      className="button_style bg-slate-600 hover:bg-slate-700"
    >
      {input}
    </button>
  );
};

const ClearButton = ({ setInputUser, buttonRef }) => {
  return (
    <button
      onClick={() => {
        setInputUser("");
      }}
      ref={buttonRef}
      className="button_style bg-red-500 hover:bg-red-600"
    >
      C
    </button>
  );
};

const BackspaceButton = ({ setInputUser, buttonRef }) => {
  return (
    <button
      onClick={() => {
        setInputUser((prev) => {
          if (prev.length == 1) {
            return "";
          } else {
            return prev.slice(0, -1);
          }
        });
      }}
      ref={buttonRef}
      className="button_style bg-rose-500 hover:bg-rose-600"
    >
      <IconBackspace />
    </button>
  );
};

const EqualButton = ({ setInputUser, result, buttonRef }) => {
  return (
    <button
      onClick={() => {
        if (result.toString().length > 0) {
          setInputUser(result.toString());
        }
      }}
      ref={buttonRef}
      className="button_style bg-orange-400 hover:bg-orange-500 col-span-2"
    >
      =
    </button>
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

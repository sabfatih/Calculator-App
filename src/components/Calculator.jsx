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
      else if (key === "=") buttonEqualRef.current?.click();
      else if (key === "Backspace") buttonBackspaceRef.current?.click();
      else if (e.shiftKey && key.toLowerCase() === "c")
        buttonClearRef.current?.click();
    };

    window.addEventListener("keydown", (e) => keyHandler(e));

    return window.removeEventListener("keydown", (e) => keyHandler(e));
  }, []);
  const [inputUser, setInputUser] = useState("");
  const [result, setResult] = useState("0");

  const calculate = (input) => {
    const removeLastChar = ["+", "-", "*", "/", "."];

    if (removeLastChar.includes(input.slice(-1))) {
      const result = input.slice(0, -1);
      return calculate(result);
    } else {
      const divideByZeroRegex = /\/0/;
      const isDivideByZero = input.match(divideByZeroRegex);

      if (isDivideByZero) {
        return "Can't divide by 0";
      }

      // percent logic
      // also the calculation itself
      const operatorsRegex = /(?<![*/])(?=[+\-])/;
      const plusMinusPercentNumberRegex = /([+\-]\d+%)/;

      let result = "";
      let calculations = input
        .split(operatorsRegex) // split the number
        ?.filter((item) => item != ""); // clean the data

      console.log(" calculate ~ calculations", calculations);
      const convertPercentRegex = /([+\-]?\d+)%/;
      const calculateNum = new Function(
        "calculation",
        "convertPercentRegex",
        `return eval(calculation?.replace(convertPercentRegex, "($1/100)"))?.toString()`
      );

      let temporResult =
        calculateNum(calculations[0], convertPercentRegex) || "";

      while (calculations?.length > 1) {
        const first = calculateNum(calculations[0], convertPercentRegex);
        const second =
          calculations[1].includes("*") || calculations[1].includes("/")
            ? calculateNum(calculations[1], convertPercentRegex)
            : calculations[1];

        console.log(" calculate ~ calculations", calculations);

        if (second.match(plusMinusPercentNumberRegex)) {
          let percentNumber = new Function(
            `return ${first + "*" + second.replace("%", "/100")}`
          )().toString();

          if (percentNumber[0] != "-") {
            percentNumber = "+" + percentNumber;
          } // prevent the number didn't have an operator like just "100"

          result = new Function(`return ${first + percentNumber}`)().toString();
        } else {
          const operators = ["+", "-", "*", "/"];
          let secondNumber = second;
          if (!operators.includes(secondNumber[0].toString())) {
            secondNumber = "+" + secondNumber;
          }

          result = new Function(
            `return ${first + secondNumber.replace("%", "/100")}`
          )().toString();
          console.log(first);
          console.log(secondNumber);
        }
        calculations = calculations.slice(2);
        calculations.unshift(result);
      }
      if (calculations?.length == 1) {
        if (result.length < 1) {
          calculations.unshift(temporResult);
        }
        const finalResult = calculations[0];
        return finalResult;
      }
    }
  };

  useEffect(() => {
    const calculation = calculate(
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
            className={`text-right outline-none text-3xl font-semibold min-h-10 ${
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
      let finalInput = "";

      if (prev == "") {
        if (input == "+" || input == "×" || input == "÷" || input == "%") {
          acceptedInput = "";
        } else {
          acceptedInput = input;
        }

        // return acceptedInput;
        finalInput = acceptedInput;
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
          (lastNumber.indexOf(".") > 0 && input == ".") || // no more than 1 coma in decimal
          (lastNumber.indexOf("%") > 0 && !operators.includes(input)) // no number after a percent number
        ) {
          // return prev;
        } else {
          acceptedInput = input;
        }

        // return prev + acceptedInput;
        finalInput = prev + acceptedInput;
      }

      return finalInput;
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
        if (result == "Can't divide by 0") {
          return false;
        } else {
          if (result?.toString().length > 0) {
            setInputUser(result.toString());
          }
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

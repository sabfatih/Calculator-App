import React, { useEffect, useState } from "react";
import { CalculatorContainer } from "./Elements";

const Calculator = () => {
  const [inputUser, setInputUser] = useState("");
  const [result, setResult] = useState("0");

  const calculate = (input) => {
    const removeLastChar = ["+", "-", "*", "/", "."];

    if (removeLastChar.includes(input.slice(-1))) {
      const result = input.slice(0, -1);
      return calculate(result);
    } else {
      const divideByZeroRegex = /\/0(?!\d|\.)/;
      const isDivideByZero = input.match(divideByZeroRegex);

      if (isDivideByZero) {
        return "Can't divide by 0";
      }

      // percent logic
      // also the calculation itself
      const operatorsRegex = /(?<![*/])(?=[+\-])/;
      const plusMinusPercentNumberRegex = /([+\-]\d+(?:\.\d+)?%)/;

      let result = "";
      let calculations = input
        .split(operatorsRegex) // split the number
        ?.filter((item) => item != ""); // clean the data

      console.log(" calculate ~ calculations", calculations);
      const convertPercentRegex = /([+\-*/])(\d+(?:\.\d+)?)%/g;

      const calculateNum = new Function(
        "calculation",
        "convertPercentRegex",
        `return eval(calculation?.replaceAll(convertPercentRegex, "$1($2/100)"))?.toString()`
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
            `return ${
              first + "*" + second.replaceAll(convertPercentRegex, "$1($2/100)")
            }`
          )().toString();
          console.log("loooh", first + "*" + second);

          if (percentNumber[0] != "-") {
            percentNumber = "+" + percentNumber;
          } // prevent the number didn't have an operator like just "100"

          result = new Function(`return ${first + percentNumber}`)().toString();
        } else {
          const operators = ["+", "-", "*", "/"];
          let secondNumber = second.replaceAll(
            convertPercentRegex,
            "$1($2/100)"
          );
          if (!operators.includes(secondNumber[0].toString())) {
            secondNumber = "+" + secondNumber;
          }

          result = new Function(`return ${first + secondNumber}`)().toString();
          console.log("satuuuu", first);
          console.log("dueeeeeee", secondNumber);
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
    <CalculatorContainer
      inputUser={inputUser}
      setInputUser={setInputUser}
      result={result}
    />
  );
};

export const Button = ({ input, setInputUser, buttonRef }) => {
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
        const lastNumberPrev = prev.slice(splitIndex + 1);
        console.log(" setInputUser ~ lastNumberPrev", lastNumberPrev);

        if (
          (operators.includes(prev.slice(-1)) &&
            (input == "+" || input == "×" || input == "÷" || input == "%")) ||
          // all of these 4, operators(except "-") and "%" can't be inputted after operators
          (operators.includes(prev.slice(-1)) &&
            operators.includes(prev.slice(-2, -1)) &&
            input == "-") || // preventing repeated "-" because previous logic
          (prev.slice(-1) == "." && input == ".") || // no coma repeated
          (lastNumberPrev.indexOf(".") > 0 && input == ".") || // no more than 1 coma in decimal
          (lastNumberPrev.indexOf("%") > 0 &&
            (!operators.includes(input) || input == ".")) || // no number or coma after a percent number
          (lastNumberPrev == "0" && input == "0")
        ) {
          // return prev;
        } else {
          acceptedInput = input;
        }

        // return prev + acceptedInput;
        finalInput = prev + acceptedInput;
      }

      return finalInput
        .replace(/([+\-×÷*/])\./g, "$10.") // replace "10+.5" to "10+0.5"
        .replace(/\.([+\-×÷*/])/g, "$1") // replace "5.+10" to "5+10"
        .replace(/([+\-×÷])0+(\d+)/g, "$1$2"); // replace "+00012" to "12"
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

export default Calculator;

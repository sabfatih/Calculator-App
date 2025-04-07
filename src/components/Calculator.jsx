import React, { useEffect, useState } from "react";
import { CalculatorContainer } from "./Elements";

const Calculator = () => {
  const [inputUser, setInputUser] = useState("");
  const [result, setResult] = useState("0");

  const calculate = (inputFromUser) => {
    let input = inputFromUser;
    input = input.replaceAll(",", ""); // to remove any coma for thousands number so it can be calculated

    const notationChecker = (params) => {
      const hasNotationCheckRegex = /\d+(\.\d+)?e[+-]?\d+/gi;
      if (hasNotationCheckRegex.test(params)) {
        const acceptedInput = params.replace(
          hasNotationCheckRegex,
          (matchedItem) =>
            Number(matchedItem).toLocaleString("fullwide", {
              useGrouping: false,
            })
        );
        return acceptedInput;
      } else {
        return params;
      }
    };
    const removeLastChar = ["+", "-", "*", "/", "."];

    input = notationChecker(input);

    if (removeLastChar.includes(input.slice(-1))) {
      const slicedInput = input.slice(0, -1);
      return calculate(slicedInput);
    } else {
      const divideByZeroRegex = /\/0(?!\d|\.)/;
      const isDivideByZero = input.match(divideByZeroRegex);

      if (isDivideByZero) {
        return "Can't divide by 0";
      }

      // percent logic
      // also the calculation itself
      const plusMinusOperatorsRegex = /(?<![*/])(?=[+\-])/;
      const plusMinusPercentNumberRegex = /([+\-]\d+(?:\.\d+)?%)/;

      let result = "";
      let calculations = input
        .split(plusMinusOperatorsRegex) // split the number
        ?.filter((item) => item != ""); // clean the data

      console.log(" calculate ~ calculations", calculations);
      const convertPercentRegex = /([+\-*/]?)(\d+(?:\.\d+)?)%/g;

      const calculateNum = new Function(
        "calculation",
        "convertPercentRegex",
        `return eval(calculation?.replaceAll(convertPercentRegex, "$1($2/100)"))?.toString()`
      );

      let temporResult =
        calculateNum(calculations[0], convertPercentRegex) || "";

      while (calculations?.length > 1) {
        calculations[0] = notationChecker(calculations[0]);

        let first = calculateNum(calculations[0], convertPercentRegex);
        first = notationChecker(first);
        const second =
          calculations[1].includes("*") || calculations[1].includes("/")
            ? calculateNum(calculations[1], convertPercentRegex)
            : calculations[1];

        if (second.match(plusMinusPercentNumberRegex)) {
          let percentNumber = new Function(
            `return ${
              first + "*" + second.replaceAll(convertPercentRegex, "$1($2/100)")
            }`
          )().toString();

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
          // console.log("satuuuu", first);
          // console.log("dueeeeeee", secondNumber);
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

export const Button = ({ input, buttonRef, buttonHandler }) => {
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

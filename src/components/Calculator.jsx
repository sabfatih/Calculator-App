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
    let result = calculation || "";
    if (result === "Infinity") {
      setResult(result);
    } else {
      const formatNumber = (number) => {
        // for formatting purpose(so thousands number can have coma(,))
        let cuttedNumber = number;
        let formattedInputNumber = [];

        for (let i = number.length; i > 3; i -= 3) {
          let x = i - 3;
          let y = i;

          cuttedNumber = number.slice(0, x);
          formattedInputNumber.push(number.slice(x, y));
        }

        formattedInputNumber.push(cuttedNumber);
        return formattedInputNumber.reverse().join(",");
      };

      const splitWithOperatorRegex = /(?<=[+\-×÷*%/])|(?=[+\-×÷*%/])/g;
      const splittedInput = result.split(splitWithOperatorRegex);

      result = splittedInput
        .map((rawNumber) => {
          const operators = ["+", "-", "×", "÷"];
          if (operators.includes(rawNumber)) {
            // make sure that there's no operator and "%" because the array will like ["10","%", "+", "5"]
            return rawNumber; // and return the operator
          }

          const dotIndex = rawNumber.indexOf("."); // to check if the number is decimal and get the index
          let decimalValue = ""; // initial value that will be used if the number is not decimal

          if (dotIndex > 0) {
            decimalValue = rawNumber.slice(dotIndex); // to get the decimal value "12.034" ---> ".034"
            rawNumber = rawNumber.slice(0, dotIndex); // to remove the decimal value "12.034" ---> "12"
          }

          const formattedNumber = formatNumber(rawNumber);
          const finalNumber = formattedNumber + decimalValue;
          return finalNumber;
        })
        .join("");

      setResult(result);
    }
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

import React, { useEffect, useState } from "react";
import { CalculatorContainer } from "./Elements";

const Calculator = () => {
  const [inputUser, setInputUser] = useState("");
  const [result, setResult] = useState("0");

  const calculate = (inputFromUser) => {
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

    let input = notationChecker(inputFromUser);

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
      const convertPercentRegex = /([+\-*/])(\d+(?:\.\d+)?)%/g;

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

        finalInput = acceptedInput;
      } else {
        const splitIndex = operators
          .map((operator) => prev.lastIndexOf(operator))
          .sort((a, b) => b - a)[0];
        const lastNumberPrev = prev.slice(splitIndex + 1);

        if (
          (operators.includes(prev.slice(-1)) &&
            (input == "+" || input == "×" || input == "÷" || input == "%")) ||
          // all of these 4, operators(except "-") and "%" can't be inputted after operators
          (operators.includes(prev.slice(-1)) &&
            operators.includes(prev.slice(-2, -1)) &&
            input == "-") || // preventing repeated "-" because previous logic
          (prev.slice(-1) == "." && input == ".") || // no dot repeated
          (lastNumberPrev.indexOf(".") > 0 && input == ".") || // no more than 1 dot in decimal
          (lastNumberPrev.indexOf("%") > 0 &&
            (!operators.includes(input) || input == ".")) || // no number or dot after a percent number
          (lastNumberPrev == "0" && input == "0")
        ) {
        } else {
          acceptedInput = input;
        }

        finalInput = prev + acceptedInput;
      }

      finalInput = finalInput
        .replace(/([+\-×÷*/])\./g, "$10.") // replace "10+.5" to "10+0.5"
        .replace(/\.([+\-×÷*/])/g, "$1") // replace "5.+10" to "5+10"
        .replace(/([+\-×÷*/])0+(\d+)/g, "$1$2"); // replace "+00012" to "12"

      // const hasNotationCheckRegex = /\d+(\.\d+)?e[+-]?\d+/i;

      // ------------------------UNSOLVED------------------------
      // remove the operators, "10+20*-30" ---> ["10", "20", "30"]

      const numbersOnlyRegex = /\d+(\.\d+)?/g;
      const tes = finalInput.replaceAll(numbersOnlyRegex, (match) => {
        let styledNumber = match.toString();
        let decimalValue = "";
        const indexOfDot = match.indexOf(".");

        const styleHandler = (number) => {
          const temporResultYe = [];
          for (let i = 0; i < number.length; i += 3) {
            let x = -i;
            let y = x + 3;
            if (y > 0) {
              y = 0;
            }

            temporResultYe.push(number.slice(x, y));
          }

          return temporResultYe.sort((a, b) => b - a);
        };

        if (indexOfDot > 0) {
          styledNumber = styledNumber.slice(0, indexOfDot + 1);
          decimalValue = styledNumber.slice(indexOfDot);
        }

        if (styledNumber.length > 3) {
          styleHandler(styledNumber);
        }

        console.log("daiman", styledNumber + decimalValue);
        return styledNumber + decimalValue;
      });
      // for styling purpose(so thousands number can have coma(,))
      console.log(" setInputUser ~ tes", tes);

      // if (hasNotationCheckRegex.test(finalInput)) {

      // }
      // ------------------------UNSOLVED------------------------

      console.log(finalInput);
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

export default Calculator;

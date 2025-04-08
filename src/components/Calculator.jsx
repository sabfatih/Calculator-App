import React, { useEffect, useState } from "react";
import { CalculatorContainer } from "./Elements";

const Calculator = () => {
  const [inputUser, setInputUser] = useState("");
  const [result, setResult] = useState("0");

  const calculate = (inputFromUser) => {
    let rawInput = inputFromUser;
    rawInput = rawInput.replaceAll(",", ""); // to remove any coma for thousands number so it can be calculated

    const convertScienceNotation = (numbers) => {
      const notationRegex = /\d+(\.\d+)?e[+-]?\d+/gi; // regex to find number that is scientific notation
      if (notationRegex.test(numbers)) {
        const convertedNumber = numbers.replace(notationRegex, (matchedItem) =>
          Number(matchedItem).toLocaleString("fullwide", {
            useGrouping: false,
          })
        ); // replace the matched number with the "real" number

        return convertedNumber;
      } else {
        return numbers;
      }
    };

    let input = convertScienceNotation(rawInput);

    const lastCharCheck = ["+", "-", "*", "/", "."];
    if (lastCharCheck.includes(input.slice(-1))) {
      // check if the calculations last char is operator or "." with the array
      const slicedInput = input.slice(0, -1);
      return calculate(slicedInput);
    } else {
      const isDivideByZeroRegex = /\/0(?!\d|\.)/; // regex to find "/0" ("01" or "0.1" doesn't match)
      const isDivideByZero = input.match(isDivideByZeroRegex);

      if (isDivideByZero) {
        return "Can't divide by 0";
      }

      // ----------------- percent logic -----------------
      // also the calculation itself

      const plusMinusOperatorsRegex = /(?<![*/])(?=[+\-])/; // used to split the number with "+" or "-"(except if that is begin with "*" or "/") so it can be calculated with the modern percent logic
      const plusMinusPercentNumberRegex = /([+\-]\d+(?:\.\d+)?%)/; // used to check if the number is splitted number percent value like "+20%" or "-50.45%"

      let result = "";
      let calculations = input
        .split(plusMinusOperatorsRegex) // split the number
        ?.filter((item) => item != ""); // clean the data so it wont be any empty string ("") inside the array
      // the whole calculation that splitted into array like this:
      // "100*-20.45+30%" ---> ["100*-20.45", "+30%"]

      const convertPercentRegex = /([+\-*/]?)(\d+(?:\.\d+)?)%/g; // used to convert percent number, change "%" to "/100" if it have "*" or "/" operator

      const calculateNum = new Function(
        "calculation",
        "convertPercentRegex",
        `return eval(calculation?.replaceAll(convertPercentRegex, "$1($2/100)"))?.toString()`
      );
      // calculate numbers and also convert percent number like:
      // "+20*-40.5%"
      // so the $1 is operator "*" or "-" and the $1 is the number before the percent symbol
      // so the regex is captured the "-40.5%" and replaced it with "-(40.5/100)", so the final numbers is:
      // "+20*-(40.5/100)"

      let first = calculateNum(calculations[0], convertPercentRegex) || "";
      // calculate the first calculation/number so it will be 1 number only, not a calculation
      // also temporary result

      while (calculations?.length > 1) {
        // while calculations is have more than 1 element, indicated that is still have number to be calculated
        first = convertScienceNotation(first); // make sure the number is a real number
        const second =
          calculations[1].includes("*") || calculations[1].includes("/")
            ? calculateNum(calculations[1], convertPercentRegex)
            : // calculate if it's include "*" or "/"(indicated that it's a multiplication/division)
              calculations[1];

        if (second.match(plusMinusPercentNumberRegex)) {
          // check if the second is a percent number like "-20%" or "30.45%"

          let percentNumber = new Function(
            `return ${
              first + "*" + second.replaceAll(convertPercentRegex, "$1($2/100)")
            }`
            // modern percent logic that multiply a number before it with it
            // can made result = firstNumber + (firstNumber * secondNumber)
            // this block is acted like (firstNumber * secondNumber)
          )().toString();

          if (percentNumber[0] != "-") {
            percentNumber = "+" + percentNumber;
          } // prevent the number didn't have an operator like just "100", it's a positive so add the "+" before it

          result = new Function(`return ${first + percentNumber}`)().toString();
          //               result = firstNumber + (firstNumber * secondNumber)
        } else {
          const operators = ["+", "-", "*", "/"];
          let secondNumber = second.replaceAll(
            convertPercentRegex,
            "$1($2/100)"
          ); // replace "%" to "/100" like function calculateNum

          if (!operators.includes(secondNumber[0].toString())) {
            secondNumber = "+" + secondNumber; // prevent the number didn't have an operator
          }

          result = new Function(`return ${first + secondNumber}`)().toString(); // it can be like ("100") + ("-40")
        }
        calculations = calculations.slice(2);
        calculations.unshift(result);
        // removing the first 2 element on the array and added the calculated one
        // process repeated until calculations.length == 1, indicated that is the final result
      }
      if (calculations?.length == 1) {
        if (result.length < 1) {
          // check if there's no calculation, like when user only input a number
          calculations.unshift(first); // insert the temporary value
        }
        const finalResult = calculations[0];
        if (finalResult == rawInput) {
          return "";
          // to make sure user is calculate something like 9%, not just typing number. So the result would be the real result of a calculation
        } else {
          return finalResult;
        }
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
    ); // replace the invalid operator
    let result = calculation || "";
    if (result === "Infinity") {
      setResult(result); // set result as "Infinity" straight away so it's not get formatted to "In,fin,ity"
    } else {
      const formatNumber = (number) => {
        // for formatting purpose(so thousands number can have coma (,) )
        let cuttedNumber = number; // initial value
        let formattedInputNumber = []; // initial array

        // for example : "12345678"
        for (let i = number.length; i > 3; i -= 3) {
          let x = i - 3;
          let y = i;

          cuttedNumber = number.slice(0, x); // the rest of the number("12")
          formattedInputNumber.push(number.slice(x, y)); // slice the number backwards after every 3 index
          // the array would be ["678", "345"]
        }

        formattedInputNumber.push(cuttedNumber); // the array would be ["678", "345", "12"]
        return formattedInputNumber
          .reverse() // the array would be ["12","345","678"]
          .join(","); // turn the array into string and added "," to separated it: "12,345,678"
      };

      const splitWithNonNumberRegex = /(?<=[+\-×÷*%/])|(?=[+\-×÷*%/])/g; // splitted the non-number so it wont be formatted and can be combined again later
      const splittedInput = result.split(splitWithNonNumberRegex); // splitted the number with the non-number:
      // "1234*-56.78%" ---> ["1234", "*", "-", "56.78", "%"]

      result = splittedInput
        .map((rawNumber) => {
          const operators = ["+", "-", "×", "÷"];
          if (operators.includes(rawNumber) || rawNumber == "%") {
            // check if it's a non-number
            return rawNumber; // and return that without formatted it
          }

          let number = rawNumber;
          const dotIndex = number.indexOf("."); // to check if the number is decimal and get the index of the dot
          let decimalValue = ""; // initial value that will be used if the number is not decimal

          if (dotIndex > 0) {
            // check if the number has dot, indicated that is a decimal number
            decimalValue = number.slice(dotIndex); // to get the decimal value: "12.034" ---> ".034"
            number = number.slice(0, dotIndex); // to remove the decimal value: "12.034" ---> "12"
          }

          const formattedNumber = formatNumber(number); // format the number
          const finalNumber = formattedNumber + decimalValue; // combine the number with it's decimal value
          return finalNumber;
        })
        .join(""); // combined all of them: ["1234", "*", "-", "56.78", "%"] ---> "1,234*-56.78%"

      setResult(result); // set the result
    }
  }, [inputUser]);

  return (
    <CalculatorContainer
      inputUser={inputUser}
      setInputUser={setInputUser}
      result={result}
    /> // the actual calculator, contains html elements
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

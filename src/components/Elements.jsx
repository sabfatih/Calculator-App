import { Button } from "./Calculator";
import { useRef, useEffect, useState } from "react";

export const CalculatorContainer = ({ inputUser, setInputUser, result }) => {
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
    if (resultRef?.current) {
      resultRef.current.scrollLeft = resultRef.current.scrollWidth;
    }
  }, [inputUser]); // auto scroll to right, so when user inputted too many numbers user auto see the end of the numbers, and they can scroll to the left so see the rest

  const [animateResult, setAnimateResult] = useState(false);

  return (
    <div className="mx-4 px-3 py-4">
      <div className="mx-auto w-72 rounded-md bg-purple-400 px-5 py-6">
        <div className="flex flex-col">
          <div
            className="min-w-full overflow-x-scroll scrollbar_hide overflow-y-hidden relative min-h-10"
            ref={inputRef}
          >
            <span
              className={`block absolute right-0 text-right text-3xl font-semibold min-h-10 whitespace-nowrap ${
                !inputUser.length > 0 ? "border-r animate_blinked" : ""
              } ${
                animateResult
                  ? "-translate-y-full transition-all duration-250"
                  : ""
              }`}
            >
              {inputUser}
            </span>
          </div>
          <div
            className={`min-w-full overflow-x-scroll scrollbar_hide overflow-y-visible relative h-10 ${
              animateResult
                ? "-translate-y-full transition-all duration-250"
                : ""
            }`}
            ref={resultRef}
          >
            <p
              className={`block absolute right-0 text-right font-semibold whitespace-nowrap ${
                animateResult
                  ? "text-3xl opacity-100 transition-all duration-250"
                  : "text-lg opacity-60 mt-1"
              }`}
            >
              {result}
            </p>
          </div>
        </div>
        {/* </div> */}
        <hr className="border-t-1 -mt-2 mb-1" />
        {/* Buttons */}
        <Buttons
          setInputUser={setInputUser}
          result={result}
          setAnimateResult={setAnimateResult}
          animateResult={animateResult}
        />
      </div>
    </div>
  );
};

const Buttons = ({ setInputUser, result, setAnimateResult, animateResult }) => {
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
  // refs to handle keyboard click

  useEffect(() => {
    const keyHandler = (e) => {
      const key = e.key;

      if (key === "0") {
        button0Ref.current?.click();
      } else if (key === "1") {
        button1Ref.current?.click();
      } else if (key === "2") {
        button2Ref.current?.click();
      } else if (key === "3") {
        button3Ref.current?.click();
      } else if (key === "4") {
        button4Ref.current?.click();
      } else if (key === "5") {
        button5Ref.current?.click();
      } else if (key === "6") {
        button6Ref.current?.click();
      } else if (key === "7") {
        button7Ref.current?.click();
      } else if (key === "8") {
        button8Ref.current?.click();
      } else if (key === "9") {
        button9Ref.current?.click();
      } else if (key === ".") {
        buttonDotRef.current?.click();
      } else if (key === "%") {
        buttonPercentRef.current?.click();
      } else if (key === "+") {
        buttonPlusRef.current?.click();
      } else if (key === "-") {
        buttonMinusRef.current?.click();
      } else if (key === "*") {
        buttonMultipleRef.current?.click();
      } else if (key === "/") {
        buttonDivideRef.current?.click();
      } else if (key === "=") {
        buttonEqualRef.current?.click();
      } else if (e.ctrlKey && key === "Backspace") {
        setInputUser("");
      } else if (!e.crtlKey && key === "Backspace") {
        buttonBackspaceRef.current?.click();
      } else if (e.shiftKey && key.toLowerCase() === "c") {
        buttonClearRef.current?.click();
      }
    };

    window.addEventListener("keydown", (e) => keyHandler(e));

    return window.removeEventListener("keydown", (e) => keyHandler(e));
  }, []); // keyboard click handler

  const buttonHandler = (inputFromUser, isBackSpace) => {
    // inputFromUser is just a single char string, like "1", "-", and "."

    const operators = ["+", "-", "×", "÷"];

    setInputUser((previous) => {
      let prev = previous.replaceAll(",", ""); // reset the format of prev calculation

      if (isBackSpace) {
        prev = prev.slice(0, -1); // remove the last char of the prev input
        if (prev.slice(-2, -1).toLowerCase() == "e") {
          // check if the result of backspaced number is is an invalid scientific notation number like "1.23e+"
          prev = prev.slice(0, -2); // remove the "e+"
        }
        // the inputFromUser will be "" and it's okay
      }

      let input = inputFromUser.replaceAll(",", ""); // reset the format of prev data
      let acceptedInput = ""; // initial value
      let finalCalculation = ""; // initial value

      if (prev == "") {
        // check if the prev is exactly "", indicated it's the first inputted character from user
        if (input == "+" || input == "×" || input == "÷" || input == "%") {
          // prevent user from input those character as the first char of their input
          acceptedInput = "";
        } else {
          acceptedInput = input;
          if (input == ".") {
            acceptedInput = "0."; // so user can understand that ".XXX" is "0.XXX"
          }
        }

        finalCalculation = acceptedInput;
      } else if (prev == "0") {
        if (
          !(operators.includes(input) || input == "%" || input == ".") &&
          input.length > 0
        ) {
          // check if the input is number
          finalCalculation = input;
          // prevent weird number like "01234" or even "0000123"
        } else {
          finalCalculation = "0" + input;
        }
      } else {
        const splitIndex = operators
          .map((operator) => prev.lastIndexOf(operator))
          .sort((a, b) => b - a)[0];
        const lastNumberPrev = prev.slice(splitIndex + 1); // get the last number from the prev input

        const notationRegex = /^-?\d+(\.\d+)?e[+-]?\d+$/i; // used to check if a string is EXACTLY a scientific notation number:
        // "1.23e+23" is matched
        // "1.23e+2+" is not matched

        if (
          (operators.includes(prev.slice(-1)) &&
            (input == "+" || input == "×" || input == "÷" || input == "%")) ||
          // prevent user input one of these 3 operators and "%" after an operator
          (operators.includes(prev.slice(-1)) &&
            operators.includes(prev.slice(-2, -1)) &&
            input == "-") ||
          // prevent repeated "-" because prev logic
          (prev.slice(-1) == "." && input == ".") ||
          // prevent dot repeated
          (lastNumberPrev.indexOf(".") > 0 && input == ".") ||
          // prevent more than 1 dot in decimal
          (lastNumberPrev.indexOf("%") > 0 &&
            (!operators.includes(input) || input == ".")) ||
          // prevent number or dot after a percent symbol
          (lastNumberPrev == "0" && input == "0") ||
          // prevent zero repeated like "000023"
          (notationRegex.test(prev) && input == ".")
          // prevent dot after scientific notation
        ) {
          acceptedInput = "";
        } else {
          if (
            prev.slice(-1) == "." &&
            (operators.includes(input) || input == "%") // check if the last char of prev calculation is a dot
          ) {
            prev = prev.slice(0, -1);
            // prevent dot at the end of a number after user input operator or "%" like "10.+5" and "10.%"
          }

          acceptedInput = input;
        }

        finalCalculation = prev + acceptedInput; // combine the prev calculation with the input
      }

      finalCalculation = finalCalculation
        .replace(/([+\-×÷*/])\./g, "$10.")
        // "+." ---> "+0."
        // replace "+.5" to "+0.5" ($1 is "+" in this example)
        .replace(/\.([+\-×÷*/])/g, "$1");
      // "5.-10" ---> "5-10"
      // replace ".-" to "-" ($1 is "-" in this example)

      const formatNumber = (number) => {
        // for formatting purpose(so thousands number can have coma(,))
        let cuttedNumber = number; // initial value
        let splittedNumber = []; // initial array

        // for example : "12345678"
        for (let i = number.length; i > 3; i -= 3) {
          let x = i - 3;
          let y = i;

          cuttedNumber = number.slice(0, x); // the rest of the number: ("12")
          splittedNumber.push(number.slice(x, y)); // slice the number backwards after every 3 index and pushed it into the array: ["678", "345"]
        }

        splittedNumber.push(cuttedNumber); // the array would be ["678", "345", "12"]
        return splittedNumber
          .reverse() // the array would be ["12","345","678"]
          .join(","); // turn the array into string and added "," to separated it: "12,345,678"
      };

      const nonNumberRegex = /(?<=[+\-×÷*%/])|(?=[+\-×÷*%/])/g; // used to split the non-number symbols so it wont be formatted and can be combined again later
      const splittedInput = finalCalculation
        .split(nonNumberRegex)
        // splitted the number with minus symbol:
        // "-1234*-5678%" ---> ["-", "1234", "*", "-", "5678", "%"]
        .filter(Boolean); // make sure there is no empty string ("")

      const formattedInput = splittedInput
        .map((rawNumber) => {
          if (operators.includes(rawNumber) || rawNumber == "%") {
            // check if it's a non-number
            return rawNumber; // and return it
          }
          let number = rawNumber; // initial value
          const dotIndex = number.indexOf("."); // to check if the number is decimal and get the index of the dot
          let decimalValue = ""; // initial value that will be used if the number is not decimal

          if (dotIndex > 0) {
            // check if the number has dot, indicated that is a decimal number
            decimalValue = number.slice(dotIndex); // to get the decimal value "12.034" ---> ".034"
            number = number.slice(0, dotIndex); // to remove the decimal value "12.034" ---> "12"
          }

          const formattedNumber = formatNumber(number); // format the number
          const finalNumber = formattedNumber + decimalValue; // combine the number with it's decimal value
          return finalNumber;
        })
        .join(""); // combined all of them: ["-", "1234.5678"] ---> "-1,234.5678"

      finalCalculation = formattedInput;
      return finalCalculation;
    });
  };

  return (
    <div className="mt-3 grid grid-cols-4 grid-rows-5 gap-3 place-items-center">
      <ClearButton setInputUser={setInputUser} buttonRef={buttonClearRef} />
      <Button
        input={"%"}
        buttonRef={buttonPercentRef}
        buttonHandler={buttonHandler}
      />
      <BackspaceButton
        buttonRef={buttonBackspaceRef}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"÷"}
        buttonRef={buttonDivideRef}
        buttonHandler={buttonHandler}
      />

      <Button
        input={"7"}
        buttonRef={button7Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"8"}
        buttonRef={button8Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"9"}
        buttonRef={button9Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"+"}
        buttonRef={buttonPlusRef}
        buttonHandler={buttonHandler}
      />

      <Button
        input={"4"}
        buttonRef={button4Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"5"}
        buttonRef={button5Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"6"}
        buttonRef={button6Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"-"}
        buttonRef={buttonMinusRef}
        buttonHandler={buttonHandler}
      />

      <Button
        input={"1"}
        buttonRef={button1Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"2"}
        buttonRef={button2Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"3"}
        buttonRef={button3Ref}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"×"}
        buttonRef={buttonMultipleRef}
        buttonHandler={buttonHandler}
      />

      <Button
        input={"."}
        buttonRef={buttonDotRef}
        buttonHandler={buttonHandler}
      />
      <Button
        input={"0"}
        buttonRef={button0Ref}
        buttonHandler={buttonHandler}
      />
      <EqualButton
        setInputUser={setInputUser}
        result={result}
        buttonRef={buttonEqualRef}
        setAnimateResult={setAnimateResult}
        animateResult={animateResult}
      />
    </div> // HTML elemets of buttons
  );
};

const ClearButton = ({ setInputUser, buttonRef }) => {
  return (
    <button
      onClick={() => {
        setInputUser(""); // clear the input
      }}
      ref={buttonRef}
      className="button_style bg-red-500 hover:bg-red-600"
    >
      C
    </button>
  );
};

const BackspaceButton = ({ buttonRef, buttonHandler }) => {
  const isBackSpaceButton = true;
  return (
    <button
      onClick={() => {
        buttonHandler("", isBackSpaceButton);
      }}
      ref={buttonRef}
      className="button_style bg-rose-500 hover:bg-rose-600"
    >
      <IconBackspace />
    </button>
  );
};

const EqualButton = ({
  setInputUser,
  result,
  buttonRef,
  setAnimateResult,
  animateResult,
}) => {
  return (
    <button
      onClick={() => {
        if (result == "Infinity" || result == "Can't divide by 0") {
          return false;
          // prevent animation if the result is "Infinity" or "Can't divide by 0"
        } else {
          if (!animateResult && result?.toString().length > 0) {
            // only do the equal if animation is being stopped and the result isn't empty
            setAnimateResult(true);
            setTimeout(() => {
              setAnimateResult(false);
              setInputUser(result);
            }, 250); // stopped the animation after 250ms and set the inputUser
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
  // Icon for backspace button
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

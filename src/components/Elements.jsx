import { Button } from "./Calculator";
import { useRef, useEffect } from "react";

export const CalculatorContainer = ({ inputUser, setInputUser, result }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [inputUser]);

  return (
    <div className="mx-4 px-3 py-4">
      <div className="mx-auto w-72 rounded-md bg-purple-400 px-5 py-6">
        <div className="flex flex-col">
          {/* <div className="min-w-full"> */}
          <div
            className="min-w-full overflow-x-scroll scrollbar_hide"
            ref={inputRef}
          >
            <span
              className={`block text-right outline-none text-3xl font-semibold min-h-10 whitespace-nowrap ${
                !inputUser.length > 0 ? "border-r animate_blinked" : ""
              }`}
            >
              {inputUser}
            </span>
          </div>
          <p className="ml-auto mt-1 text-xl opacity-60 min-h-7 text-right">
            {result}
          </p>
        </div>
        {/* </div> */}
        <hr className="border-t-1 my-1" />
        {/* Buttons */}
        <Buttons setInputUser={setInputUser} result={result} />
      </div>
    </div>
  );
};

const Buttons = ({ setInputUser, result }) => {
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
  }, []);

  const buttonHandler = (inputFromUser, isBackSpace) => {
    const operators = ["+", "-", "×", "÷"];

    setInputUser((previous) => {
      let prev = previous.replaceAll(",", "");

      if (isBackSpace) {
        prev = prev.slice(0, -1);
      }

      let input = inputFromUser.replaceAll(",", "");
      let acceptedInput = "";
      let finalInput = "";

      if (prev == "") {
        if (input == "+" || input == "×" || input == "÷" || input == "%") {
          acceptedInput = "";
        } else {
          acceptedInput = input;
          if (input == ".") {
            acceptedInput = "0.";
          }
        }

        finalInput = acceptedInput;
      } else if (prev == "0") {
        if (
          !(operators.includes(input) || input == "%" || input == ".") &&
          input.length > 0
        ) {
          finalInput = input;
        } else {
          finalInput = "0" + input;
        }
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
            input == "-") || // prevent repeated "-" because previous logic
          (prev.slice(-1) == "." && input == ".") || // prevent dot repeated
          (lastNumberPrev.indexOf(".") > 0 && input == ".") || // prevent more than 1 dot in decimal
          (lastNumberPrev.indexOf("%") > 0 &&
            (!operators.includes(input) || input == ".")) || // prevent number or dot after a percent number
          (lastNumberPrev == "0" && input == "0") // prevent zero repeated like "000023"
        ) {
          // idk
        } else {
          acceptedInput = input;
        }

        finalInput = prev + acceptedInput;
      }

      finalInput = finalInput
        .replace(/([+\-×÷*/])\./g, "$10.") // replace "10+.5" to "10+0.5"
        .replace(/\.([+\-×÷*/])/g, "$1") // replace "5.+10" to "5+10"
        .replace(/([+\-×÷*/])0+(\d+)/g, "$1$2"); // replace "+00012" to "12"

      const formatNumber = (number) => {
        // for formatting purpose(so thousands number can have coma(,))
        let cuttedNumber = number;
        let temporResultYe = [];

        for (let i = number.length; i > 3; i -= 3) {
          let x = i - 3;
          let y = i;

          cuttedNumber = number.slice(0, x);
          temporResultYe.push(number.slice(x, y));
        }

        temporResultYe.push(cuttedNumber);
        return temporResultYe.reverse().join(",");
      };

      const splitWithOperatorRegex = /(?<=[+\-×÷*%/])|(?=[+\-×÷*%/])/g;
      const splittedInput = finalInput.split(splitWithOperatorRegex);

      const formattedInput = splittedInput
        .map((rawNumber) => {
          if (operators.includes(rawNumber) || rawNumber == "%") {
            // make sure that there's no operator and "%" because the array will like ["10","%", "+", "5"]
            return rawNumber; // and return the operator
          }
          let number = rawNumber;
          const dotIndex = number.indexOf("."); // to check if the number is decimal and get the index
          let decimalValue = ""; // initial value that will be used if the number is not decimal

          if (dotIndex > 0) {
            decimalValue = number.slice(dotIndex); // to get the decimal value "12.034" ---> ".034"
            number = number.slice(0, dotIndex); // to remove the decimal value "12.034" ---> "12"
          }

          // const numberToBeFormatted = number.replace("%", "");

          const formattedNumber = formatNumber(number);
          const finalNumber = formattedNumber + decimalValue;
          return finalNumber;
        })
        .join("");

      finalInput = formattedInput;
      return finalInput;
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
      />
    </div>
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

import { Button } from "./Calculator";
import { useRef, useEffect } from "react";

export const CalculatorContainer = ({ inputUser, setInputUser, result }) => {
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

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [inputUser]);

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
                !inputUser.length > 0 ? "border-r" : ""
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

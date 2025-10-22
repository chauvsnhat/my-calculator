import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [currentOperand, setCurrentOperand] = useState("0");
  const [previousOperand, setPreviousOperand] = useState("");
  const [operation, setOperation] = useState("");
  const [displayExpression, setDisplayExpression] = useState("");
  const [previousExpression, setPreviousExpression] = useState("");
  const [isResult, setIsResult] = useState(false);

  const appendNumber = (num) => {
    if (isResult) {
      setCurrentOperand(num);
      setIsResult(false);
      return;
    }
    if (currentOperand === "0" && num !== ".") {
      setCurrentOperand(num);
    } else {
      if (num === "." && currentOperand.includes(".")) return;
      setCurrentOperand(currentOperand + num);
    }
  };

  const chooseOperation = (op) => {
    if (currentOperand === "" && previousOperand === "") return;
    if (previousOperand !== "") {
      compute();
      setOperation(op);
      return;
    }
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand("");
    setDisplayExpression(`${currentOperand} ${op}`);
    setIsResult(false);
  };

  const compute = () => {
    let result;
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(curr)) return;

    switch (operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "×":
        result = prev * curr;
        break;
      case "÷":
        result = curr === 0 ? "Error" : prev / curr;
        break;
      default:
        return;
    }

    if (result === "Error") {
      setCurrentOperand("Error");
      setDisplayExpression("");
      setPreviousOperand("");
      setOperation("");
      setIsResult(false);
      return;
    }

    setDisplayExpression(`${previousOperand} ${operation} ${currentOperand}`);
    setPreviousExpression(`${previousOperand} ${operation} ${currentOperand}`);
    setCurrentOperand(result.toString());
    setPreviousOperand("");
    setOperation("");
    setIsResult(true);
  };

  const handleUnaryOperator = (op) => {
    const current = parseFloat(currentOperand);
    if (isNaN(current) && op !== "±") return;

    let expr = "";
    let result;

    // ✅ Nếu vừa bấm "=", coi kết quả là toán hạng mới, reset biểu thức cũ
    const baseOperand = currentOperand;
    const baseExpression = isResult ? "" : displayExpression;

    switch (op) {
      case "%":
        expr = `${baseOperand}%`;
        const prev = parseFloat(previousOperand);
        if (!isNaN(prev)) result = prev * (current / 100);
        else result = current / 100;
        break;

      case "±":
        if (currentOperand === "0" || currentOperand === "") {
          setCurrentOperand("-0");
          return;
        }
        setCurrentOperand(
          currentOperand.startsWith("-")
            ? currentOperand.substring(1)
            : `-${currentOperand}`
        );
        return;

      case "√x":
        expr = `√(${baseOperand})`;
        result = current < 0 ? "Error" : Math.sqrt(current);
        break;

      case "x²":
        expr = `sqr(${baseOperand})`;
        result = Math.pow(current, 2);
        break;

      case "1/x":
        if (current === 0) {
          result = "Error";
        } else {
          result = 1 / current;
        }

        // ✅ Nếu đang trong phép toán thì nối tiếp biểu thức
        if (previousOperand && operation) {
          expr = `${previousOperand} ${operation} 1/(${currentOperand})`;
        } else {
          expr = `1/(${baseOperand})`;
        }
        break;

      default:
        return;
    }

    if (result === "Error") {
      setCurrentOperand("Error");
      setDisplayExpression("");
      setPreviousExpression("");
      setIsResult(false);
      return;
    }

    setDisplayExpression(expr);
    setPreviousExpression(expr);
    setCurrentOperand(result.toString());
    setIsResult(true);
  };

  const clear = () => {
    setCurrentOperand("0");
    setPreviousOperand("");
    setOperation("");
    setDisplayExpression("");
    setPreviousExpression("");
    setIsResult(false);
  };

  const del = () => {
    if (isResult) return;
    setCurrentOperand(
      currentOperand.length === 1 ? "0" : currentOperand.slice(0, -1)
    );
  };

  return (
    <div className="calculator">
      <div className="display">
        <div className="expression">{displayExpression}</div>
        <div className="operand">{currentOperand}</div>
      </div>

      <div className="buttons">
        <button onClick={clear}>C</button>
        <button onClick={del}>⌫</button>
        <button onClick={() => handleUnaryOperator("%")}>%</button>
        <button onClick={() => chooseOperation("÷")}>÷</button>

        <button onClick={() => appendNumber("7")}>7</button>
        <button onClick={() => appendNumber("8")}>8</button>
        <button onClick={() => appendNumber("9")}>9</button>
        <button onClick={() => chooseOperation("×")}>×</button>

        <button onClick={() => appendNumber("4")}>4</button>
        <button onClick={() => appendNumber("5")}>5</button>
        <button onClick={() => appendNumber("6")}>6</button>
        <button onClick={() => chooseOperation("-")}>-</button>

        <button onClick={() => appendNumber("1")}>1</button>
        <button onClick={() => appendNumber("2")}>2</button>
        <button onClick={() => appendNumber("3")}>3</button>
        <button onClick={() => chooseOperation("+")}>+</button>

        <button onClick={() => handleUnaryOperator("√x")}>√x</button>
        <button onClick={() => appendNumber("0")}>0</button>
        <button onClick={() => appendNumber(".")}>.</button>
        <button onClick={compute}>=</button>

        <button onClick={() => handleUnaryOperator("x²")}>x²</button>
        <button onClick={() => handleUnaryOperator("1/x")}>1/x</button>
        <button onClick={() => handleUnaryOperator("±")}>±</button>
      </div>
    </div>
  );
}

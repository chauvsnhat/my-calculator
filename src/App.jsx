import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(null);
  const [displayExpression, setDisplayExpression] = useState('');
  const [previousExpression, setPreviousExpression] = useState(''); // Lưu biểu thức trước đó
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState(null);
  const [isResult, setIsResult] = useState(false);

  const handleDigitClick = (digit) => {
    if (isResult) {
      setCurrentOperand(digit);
      setPreviousOperand('');
      setOperation(null);
      setDisplayExpression('');
      setPreviousExpression(''); // Reset khi bắt đầu lại
      setIsResult(false);
    } else if (currentOperand === 'Error') {
      setCurrentOperand(digit);
    } else if (digit === '.' && currentOperand.includes('.')) {
      return;
    } else if (currentOperand === '0' || currentOperand === '-0') {
      if (digit === '.') {
        setCurrentOperand(currentOperand + digit);
      } else {
        setCurrentOperand(currentOperand.startsWith('-') ? `-${digit}` : digit);
      }
    } else {
      setCurrentOperand((prev) => prev + digit);
    }
  };

  const calculate = (prev, curr, op) => {
    prev = parseFloat(prev);
    curr = parseFloat(curr);
    if (isNaN(prev) || isNaN(curr)) return '';
    let result;
    switch (op) {
      case '+':
        result = prev + curr;
        break;
      case '−':
        result = prev - curr;
        break;
      case '×':
        result = prev * curr;
        break;
      case '÷':
        if (curr === 0) return 'Error';
        result = prev / curr;
        break;
      default:
        return curr;
    }
    return Number(result.toFixed(10)).toString();
  };

  const handleOperationClick = (op) => {
    if (currentOperand === '' || currentOperand === '-0') {
      setOperation(op);
      setDisplayExpression(`${currentOperand || '0'} ${op}`);
      return;
    }
    if (isResult) {
      setPreviousOperand(currentOperand);
      setDisplayExpression(`${currentOperand} ${op}`);
      setOperation(op);
      setCurrentOperand('0');
      setIsResult(false);
    } else if (previousOperand !== '' && currentOperand !== '') {
      const result = calculate(previousOperand, currentOperand, operation);
      if (result === 'Error') {
        setCurrentOperand('Error');
        setPreviousOperand('');
        setOperation(null);
        setDisplayExpression('');
        setPreviousExpression(''); // Reset khi lỗi
        setIsResult(false);
        return;
      }
      setHistory([...history, { expression: `${displayExpression} ${currentOperand} =`, result }]);
      setPreviousOperand(result);
      setDisplayExpression(`${result} ${op}`);
      setOperation(op);
      setCurrentOperand('0');
      setIsResult(false);
    } else {
      setPreviousOperand(currentOperand);
      setDisplayExpression(`${currentOperand} ${op}`);
      setOperation(op);
      setCurrentOperand('0');
    }
  };

  const handleEqualsClick = () => {
    if (!operation && !displayExpression.includes('%') && !displayExpression.includes('±') && !displayExpression.includes('√') && !displayExpression.includes('sqr') && !displayExpression.includes('1/')) {
      return;
    }
    if (operation && previousOperand !== '' && currentOperand !== '') {
      const result = calculate(previousOperand, currentOperand, operation);
      if (result === 'Error') {
        setCurrentOperand('Error');
        setIsResult(false);
        return;
      }
      const fullExpr = `${displayExpression} ${currentOperand} =`;
      setDisplayExpression(fullExpr); // Hiển thị dấu = trên thanh nhỏ
      setCurrentOperand(result);
      setHistory([...history, { expression: fullExpr, result }]); // Lưu vào lịch sử với dấu =
      setIsResult(true);
    } else if (displayExpression) {
      const result = parseFloat(currentOperand);
      setHistory([...history, { expression: `${displayExpression} =`, result }]);
      setDisplayExpression(`${displayExpression} =`); // Hiển thị dấu = trên thanh nhỏ
      setIsResult(true);
    }
    setPreviousOperand('');
    setOperation(null);
  };

  const handleClear = () => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(null);
    setDisplayExpression('');
    setPreviousExpression(''); // Reset previousExpression
    setIsResult(false);
  };

  const handleClearEntry = () => {
    setCurrentOperand('0');
    if (previousOperand && operation) {
      setDisplayExpression(`${previousOperand} ${operation}`);
    } else {
      setDisplayExpression('');
    }
    setIsResult(false);
  };

  const handleBackspace = () => {
    if (currentOperand === 'Error' || currentOperand.length === 1) {
      setCurrentOperand('0');
    } else if (currentOperand !== '0') {
      setCurrentOperand((prev) => prev.slice(0, -1));
    }
  };

  const handleUnaryOperator = (op) => {
    const current = parseFloat(currentOperand);
    if (isNaN(current) && op !== '±') return;

    let expr = '';
    let result;
    switch (op) {
      case '%':
        expr = `${currentOperand}%`;
        const prev = parseFloat(previousOperand);
        if (!isNaN(prev)) {
          result = prev * (current / 100);
        } else {
          result = current / 100;
        }
        break;
      case '±':
        if (currentOperand === '0' || currentOperand === '') {
          setCurrentOperand('-0');
          return;
        }
        if (currentOperand.startsWith('-')) {
          setCurrentOperand(currentOperand.substring(1));
        } else {
          setCurrentOperand(`-${currentOperand}`);
        }
        return;
      case '√x':
        if (displayExpression && (displayExpression.includes('√') || displayExpression.includes('sqr') || displayExpression.includes('1/') || displayExpression.includes('%'))) {
          expr = `√(${previousExpression || displayExpression})`;
          if (current < 0) {
            result = 'Error';
          } else {
            result = Math.sqrt(current);
          }
        } else {
          expr = `√(${currentOperand})`;
          if (current < 0) {
            result = 'Error';
          } else {
            result = Math.sqrt(current);
          }
        }
        break;
      case 'x²':
        if (displayExpression && (displayExpression.includes('sqr') || displayExpression.includes('√') || displayExpression.includes('1/') || displayExpression.includes('%'))) {
          expr = `sqr(${previousExpression || displayExpression})`;
          result = Math.pow(current, 2); // Tính lũy thừa tiếp
        } else {
          expr = `sqr(${currentOperand})`; // Dùng sqr() ngay từ đầu
          result = Math.pow(current, 2);
        }
        break;
      case '1/x':
        if (current === 0) {
          result = 'Error';
        } else {
          result = 1 / current;
        }
        
        // Nếu đang trong phép toán, thì hiển thị kèm phép toán hiện tại
        if (previousOperand && operation) {
          expr = `${previousOperand} ${operation} 1/(${currentOperand})`;
        } else if (displayExpression && (displayExpression.includes('1/') || displayExpression.includes('sqr') || displayExpression.includes('√') || displayExpression.includes('%'))) {
          expr = `1/(${previousExpression || displayExpression})`;
        } else {
          expr = `1/(${currentOperand})`;
        }
        break;
        
      default:
        return;
    }
    if (result === 'Error') {
      setCurrentOperand('Error');
      setDisplayExpression('');
      setPreviousExpression(''); // Reset khi lỗi
      setIsResult(false);
      return;
    }
    setDisplayExpression(expr);
    setPreviousExpression(expr); // Lưu biểu thức hiện tại để lồng khi bấm tiếp
    setCurrentOperand(result.toString());
    setIsResult(true);
  };

  const handleMemory = (type) => {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    switch (type) {
      case 'MC':
        setMemory(null);
        break;
      case 'MR':
        if (memory !== null) {
          setCurrentOperand(memory.toString());
          setIsResult(false);
        }
        break;
      case 'M+':
        setMemory((prev) => (prev ?? 0) + current);
        break;
      case 'M-':
        setMemory((prev) => (prev ?? 0) - current);
        break;
      case 'MS':
        setMemory(current);
        break;
      case 'M▼':
        alert(`Memory: ${memory ?? 'empty'}`);
        break;
      default:
        break;
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleDigitClick(e.key);
      if (e.key === '.') handleDigitClick('.');
      if (e.key === 'Enter' || e.key === '=') handleEqualsClick();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Escape') handleClear();
      if (e.key === '+') handleOperationClick('+');
      if (e.key === '-') handleOperationClick('−');
      if (e.key === '*') handleOperationClick('×');
      if (e.key === '/') handleOperationClick('÷');
      if (e.key === '%') handleUnaryOperator('%');
      if (e.key.toUpperCase() === 'R') handleUnaryOperator('1/x');
      if (e.key.toUpperCase() === 'Q') handleUnaryOperator('x²');
      if (e.key === '@') handleUnaryOperator('√x');
      if (e.key === 'F9') handleUnaryOperator('±');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentOperand, previousOperand, operation, history, isResult]);

  let displayClass = 'current-operand';
  const len = currentOperand.toString().length;
  if (len > 16) {
    displayClass += ' font-small';
  } else if (len > 10) {
    displayClass += ' font-medium';
  }

  return (
    <div className="calculator-wrapper">
      <div className="calculator">
        <div className="header">
          <span style={{ fontWeight: 'bold' }}>My Calculator</span>
          <span className="history-toggle" onClick={toggleHistory}>
            <FontAwesomeIcon icon={faHistory} />
          </span>
        </div>
        <div className="display">
          {memory !== null && <div className="memory-label">M</div>}
          <div className="previous-operand">{displayExpression}</div>
          <div className={displayClass}>{currentOperand}</div>
        </div>
        <div className="memory-row">
          <span onClick={() => handleMemory('MC')}>MC</span>
          <span onClick={() => handleMemory('MR')}>MR</span>
          <span onClick={() => handleMemory('M+')}>M+</span>
          <span onClick={() => handleMemory('M-')}>M-</span>
          <span onClick={() => handleMemory('MS')}>MS</span>
          <span onClick={() => handleMemory('M▼')}>M▼</span>
        </div>
        <div className="buttons">
          <button onClick={() => handleUnaryOperator('%')}>%</button>
          <button onClick={handleClearEntry}>CE</button>
          <button onClick={handleClear}>C</button>
          <button onClick={handleBackspace}>⌫</button>
          <button onClick={() => handleUnaryOperator('1/x')}>1/x</button>
          <button onClick={() => handleUnaryOperator('x²')}>x²</button>
          <button onClick={() => handleUnaryOperator('√x')}>√x</button>
          <button className="operator" onClick={() => handleOperationClick('÷')}>÷</button>
          <button onClick={() => handleDigitClick('7')}>7</button>
          <button onClick={() => handleDigitClick('8')}>8</button>
          <button onClick={() => handleDigitClick('9')}>9</button>
          <button className="operator" onClick={() => handleOperationClick('×')}>×</button>
          <button onClick={() => handleDigitClick('4')}>4</button>
          <button onClick={() => handleDigitClick('5')}>5</button>
          <button onClick={() => handleDigitClick('6')}>6</button>
          <button className="operator" onClick={() => handleOperationClick('−')}>−</button>
          <button onClick={() => handleDigitClick('1')}>1</button>
          <button onClick={() => handleDigitClick('2')}>2</button>
          <button onClick={() => handleDigitClick('3')}>3</button>
          <button className="operator" onClick={() => handleOperationClick('+')}>+</button>
          <button onClick={() => handleUnaryOperator('±')}>±</button>
          <button onClick={() => handleDigitClick('0')}>0</button>
          <button onClick={() => handleDigitClick('.')}>.</button>
          <button className="equals" onClick={handleEqualsClick}>=</button>
        </div>
      </div>
      {showHistory && (
        <div className="history-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-panel" onClick={(e) => e.stopPropagation()}>
            {history.length === 0 ? (
              <p>There's no history yet.</p>
            ) : (
              <div className="history-content">
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="expr">{item.expression}</div>
                    <div className="res">{item.result}</div>
                  </div>
                ))}
              </div>
            )}
            {history.length > 0 && (
              <div className="history-footer">
                <span className="clear-history" onClick={() => setHistory([])}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
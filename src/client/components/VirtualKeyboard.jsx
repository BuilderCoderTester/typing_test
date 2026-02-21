// client/src/components/VirtualKeyboard.js
import React from 'react';

const VirtualKeyboard = ({ activeKey, isShiftPressed }) => {
  // Standard QWERTY layout
  const rows = [
    [
      { key: '`', shift: '~', code: 'Backquote' },
      { key: '1', shift: '!', code: 'Digit1' },
      { key: '2', shift: '@', code: 'Digit2' },
      { key: '3', shift: '#', code: 'Digit3' },
      { key: '4', shift: '$', code: 'Digit4' },
      { key: '5', shift: '%', code: 'Digit5' },
      { key: '6', shift: '^', code: 'Digit6' },
      { key: '7', shift: '&', code: 'Digit7' },
      { key: '8', shift: '*', code: 'Digit8' },
      { key: '9', shift: '(', code: 'Digit9' },
      { key: '0', shift: ')', code: 'Digit0' },
      { key: '-', shift: '_', code: 'Minus' },
      { key: '=', shift: '+', code: 'Equal' },
      { key: 'Backspace', code: 'Backspace', width: 'wide' }
    ],
    [
      { key: 'Tab', code: 'Tab', width: 'wide' },
      { key: 'q', shift: 'Q', code: 'KeyQ' },
      { key: 'w', shift: 'W', code: 'KeyW' },
      { key: 'e', shift: 'E', code: 'KeyE' },
      { key: 'r', shift: 'R', code: 'KeyR' },
      { key: 't', shift: 'T', code: 'KeyT' },
      { key: 'y', shift: 'Y', code: 'KeyY' },
      { key: 'u', shift: 'U', code: 'KeyU' },
      { key: 'i', shift: 'I', code: 'KeyI' },
      { key: 'o', shift: 'O', code: 'KeyO' },
      { key: 'p', shift: 'P', code: 'KeyP' },
      { key: '[', shift: '{', code: 'BracketLeft' },
      { key: ']', shift: '}', code: 'BracketRight' },
      { key: '\\', shift: '|', code: 'Backslash', width: 'wide' }
    ],
    [
      { key: 'Caps', code: 'CapsLock', width: 'wider' },
      { key: 'a', shift: 'A', code: 'KeyA' },
      { key: 's', shift: 'S', code: 'KeyS' },
      { key: 'd', shift: 'D', code: 'KeyD' },
      { key: 'f', shift: 'F', code: 'KeyF' },
      { key: 'g', shift: 'G', code: 'KeyG' },
      { key: 'h', shift: 'H', code: 'KeyH' },
      { key: 'j', shift: 'J', code: 'KeyJ' },
      { key: 'k', shift: 'K', code: 'KeyK' },
      { key: 'l', shift: 'L', code: 'KeyL' },
      { key: ';', shift: ':', code: 'Semicolon' },
      { key: "'", shift: '"', code: 'Quote' },
      { key: 'Enter', code: 'Enter', width: 'wider' }
    ],
    [
      { key: 'Shift', code: 'ShiftLeft', width: 'widest' },
      { key: 'z', shift: 'Z', code: 'KeyZ' },
      { key: 'x', shift: 'X', code: 'KeyX' },
      { key: 'c', shift: 'C', code: 'KeyC' },
      { key: 'v', shift: 'V', code: 'KeyV' },
      { key: 'b', shift: 'B', code: 'KeyB' },
      { key: 'n', shift: 'N', code: 'KeyN' },
      { key: 'm', shift: 'M', code: 'KeyM' },
      { key: ',', shift: '<', code: 'Comma' },
      { key: '.', shift: '>', code: 'Period' },
      { key: '/', shift: '?', code: 'Slash' },
      { key: 'Shift', code: 'ShiftRight', width: 'widest' }
    ],
    [
      { key: 'Ctrl', code: 'ControlLeft', width: 'wide' },
      { key: 'Win', code: 'MetaLeft', width: 'wide' },
      { key: 'Alt', code: 'AltLeft', width: 'wide' },
      { key: 'Space', code: 'Space', width: 'space' },
      { key: 'Alt', code: 'AltRight', width: 'wide' },
      { key: 'Win', code: 'MetaRight', width: 'wide' },
      { key: 'Menu', code: 'ContextMenu', width: 'wide' },
      { key: 'Ctrl', code: 'ControlRight', width: 'wide' }
    ]
  ];

  const isKeyActive = (keyObj) => {
    if (!activeKey) return false;
    
    // Check by code first (most reliable)
    if (keyObj.code === activeKey.code) return true;
    
    // Check by key value
    const keyToCheck = activeKey.key.toLowerCase();
    const displayKey = isShiftPressed && keyObj.shift ? keyObj.shift : keyObj.key;
    
    if (displayKey.toLowerCase() === keyToCheck) return true;
    if (keyObj.key.toLowerCase() === keyToCheck) return true;
    
    // Special keys
    if (keyObj.key === 'Space' && activeKey.code === 'Space') return true;
    if (keyObj.key === 'Enter' && activeKey.code === 'Enter') return true;
    if (keyObj.key === 'Backspace' && activeKey.code === 'Backspace') return true;
    if (keyObj.key === 'Tab' && activeKey.code === 'Tab') return true;
    if (keyObj.key === 'Caps' && activeKey.code === 'CapsLock') return true;
    if (keyObj.key === 'Shift' && activeKey.code?.includes('Shift')) return true;
    if (keyObj.key === 'Ctrl' && activeKey.code?.includes('Control')) return true;
    if (keyObj.key === 'Alt' && activeKey.code?.includes('Alt')) return true;
    if (keyObj.key === 'Win' && activeKey.code?.includes('Meta')) return true;
    
    return false;
  };

  const getKeyDisplay = (keyObj) => {
    if (isShiftPressed && keyObj.shift) {
      return keyObj.shift;
    }
    return keyObj.key;
  };

  return (
    <div className="virtual-keyboard">
      <h3>⌨️ Virtual Keyboard</h3>
      <div className="keyboard-container">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyObj, keyIndex) => (
              <div
                key={keyIndex}
                className={`key ${keyObj.width || ''} ${isKeyActive(keyObj) ? 'active' : ''} ${keyObj.key === 'Space' ? 'space-key' : ''}`}
              >
                {getKeyDisplay(keyObj)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="keyboard-hint">Press keys on your physical keyboard to see them highlight here</p>
    </div>
  );
};

export default VirtualKeyboard;
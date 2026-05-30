// src/Input.js
// Centralised keyboard input manager — exported as a singleton
// so every module (Car, UI, etc.) shares the same key state.

class InputManager {
  constructor() {
    this.keys = {}

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true
      // Prevent arrow keys / space from scrolling the page
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault()
      }
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
    })

    // Clear all keys when window loses focus (prevents stuck keys)
    window.addEventListener('blur', () => {
      this.keys = {}
    })
  }

  /** Returns true while a key is held. */
  isPressed(code) {
    return !!this.keys[code]
  }

  /** Returns true if ANY of the given key codes are currently held. */
  isAnyPressed(...codes) {
    return codes.some((code) => this.isPressed(code))
  }
}

// Single shared instance — import { input } from './Input.js' anywhere
export const input = new InputManager()

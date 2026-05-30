// src/Loader.js
// Thin wrapper around THREE.LoadingManager that exposes progress/complete
// callbacks and a minimum display time so the loading screen never flashes.

import * as THREE from 'three'

export class Loader {
  constructor() {
    this.manager = new THREE.LoadingManager()
    this._assetsLoaded    = false
    this._minTimeElapsed  = false
    this._onFinish        = null   // called when both conditions met

    this.manager.onProgress = (url, loaded, total) => {
      if (this.onProgress) this.onProgress(loaded / total)
    }

    this.manager.onLoad = () => {
      this._assetsLoaded = true
      this._tryFinish()
    }

    this.manager.onError = (url) => {
      console.warn('[Loader] Failed to load:', url)
      // Still proceed — placeholder visuals handle missing assets
      this._assetsLoaded = true
      this._tryFinish()
    }

    // Minimum 1.8 s so the loading screen doesn't just flash
    setTimeout(() => {
      this._minTimeElapsed = true
      this._tryFinish()
    }, 1800)
  }

  /** Called when loading is fully complete and min-time is satisfied. */
  set onComplete(fn) {
    this._onFinish = fn
    // In case loading already finished before handler was attached
    if (this._assetsLoaded && this._minTimeElapsed) fn()
  }

  _tryFinish() {
    if (this._assetsLoaded && this._minTimeElapsed && this._onFinish) {
      this._onFinish()
    }
  }
}

;(function (root) {
  function _isFunction(v) {
    return typeof v === 'function'
  }

  function _result(v) {
    return _isFunction(v) ? v() : v
  }

  const { toString } = Object.prototype

  function Spectrogram(canvas, options) {
    if (!(this instanceof Spectrogram)) {
      return new Spectrogram(canvas, options)
    }

    const baseCanvasOptions = options.canvas || {}
    this._baseCanvas = canvas
    this._baseCanvasContext = this._baseCanvas.getContext('2d')
    this._canvasContext = null

    this._baseCanvas.width =
      _result(baseCanvasOptions.width) || this._baseCanvas.width
    this._baseCanvas.height =
      _result(baseCanvasOptions.height) || this._baseCanvas.height

    window.onresize = function () {
      this._baseCanvas.width =
        _result(baseCanvasOptions.width) || this._baseCanvas.width
      this._baseCanvas.height =
        _result(baseCanvasOptions.height) || this._baseCanvas.height
    }.bind(this)

    let colors = []

    if (typeof options.colors === 'function') {
      colors = options.colors(275)
    } else {
      colors = this._generateDefaultColors(275)
    }

    this._colors = colors

    this._baseCanvasContext.fillStyle = 'rgba(0, 0, 0, 0)'
    this._baseCanvasContext.fillRect(
      0,
      0,
      this._baseCanvas.width,
      this._baseCanvas.height
    )
  }

  Spectrogram.prototype.draw = function (array) {
    const { canvas } = this._canvasContext
    const { width } = canvas
    const { height } = canvas
    const tempCanvasContext = this._canvasContext._tempContext
    const tempCanvas = tempCanvasContext.canvas
    tempCanvasContext.drawImage(canvas, 0, 0, width, height)

    for (let i = 0; i < array.length; i++) {
      const value = array[i]
      this._canvasContext.fillStyle = this._getColor(value)

      this._canvasContext.fillRect(i, 1, 1, 1)
    }

    this._canvasContext.translate(0, 1)
    // draw prev canvas before translation
    this._canvasContext.drawImage(
      tempCanvas,
      0,
      0,
      width,
      height,
      0,
      0,
      width,
      height
    )
    this._canvasContext.drawImage(
      tempCanvas,
      0,
      0,
      width,
      height,
      0,
      0,
      width,
      height
    )
    // reset transformation matrix
    this._canvasContext.setTransform(1, 0, 0, 1, 0, 0)

    this._baseCanvasContext.drawImage(canvas, 0, 0, width, height)
  }

  Spectrogram.prototype.init = function () {
    const canvas = document.createElement('canvas')
    canvas.width = this._baseCanvas.width
    canvas.height = this._baseCanvas.height
    this._canvasContext = canvas.getContext('2d')

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height

    this._canvasContext._tempContext = tempCanvas.getContext('2d')
  }

  Spectrogram.prototype.clear = function () {
    const { canvas } = this._canvasContext
    this._canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    this._canvasContext._tempContext.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    )
    this._baseCanvasContext.clearRect(0, 0, canvas.width, canvas.height)
  }

  Spectrogram.prototype._generateDefaultColors = function (steps) {
    const colors = []
    let r = 0
    let g = 0
    let b = 255

    for (var i = 0; i < 256; i++) {
      colors.push(`rgba(${[r, g++, b, 1].toString()})`)
    }

    g = 255

    for (var i = 0; i < 256; i++) {
      colors.push(`rgba(${[r, g, b--, 1].toString()})`)
    }

    b = 0

    for (var i = 0; i < 256; i++) {
      colors.push(`rgba(${[r++, g, b, 1].toString()})`)
    }

    r = 255

    for (var i = 0; i < 256; i++) {
      colors.push(`rgba(${[r, g--, b, 1].toString()})`)
    }

    return colors
  }

  Spectrogram.prototype._getColor = function (value) {
    value = Math.ceil((102.4 + value) * 10)
    if (value > 0 && value < 1024) {
      return this._colors[value - 376]
    }
    if (value > 1024) {
      return this._colors[this._colors.length - 1]
    }
    return this._colors[0]
  }

  Spectrogram.prototype.getColors = function () {
    return this._colors
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Spectrogram
    }
    exports.Spectrogram = Spectrogram
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return Spectrogram
    })
  } else {
    root.Spectrogram = Spectrogram
  }
})(this)

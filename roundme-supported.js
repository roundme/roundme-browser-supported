(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.roundmeSupported = factory();
  }
}(this, function () {
  function roundmeSupported() {
    function toLowerCase (option) {
      return ('' + option).toLowerCase();
    }

    function indexOfUserAgent (text) {
      return userAgent.indexOf(text) < 0
    }

    var userAgent = toLowerCase(navigator.userAgent);

    function isDevice (options) {
      var devices = ['ipad', 'iphone', 'ipod', 'android'];
      var currentDevice = null;
      var checkedDevises = options.split('|');

      for (var i = 0; i < devices.length; i++) {
        if (userAgent.indexOf(devices[i]) >= 0) {
          currentDevice = devices[i];
          break;
        }
      }

      if (!currentDevice) {
        return false;
      }

      for (var z = 0; z < checkedDevises.length; z++) {
        if (checkedDevises[z] === currentDevice) {
          return true
        }
      }

      return false
    }

    function isCss3DSupported () {
      var div = document.createElement('div');
      var webkitPerspective = 'WebkitPerspective';
      var prefixes = [
        'perspective',
        webkitPerspective,
        'msPerspective',
        'MozPerspective',
        'OPerspective'
      ];
      var supported = false;
      var prefix = null;
      var media = null;

      for (var i = 0; i < prefixes.length; i++) {
        prefix = prefixes[i];
        if (div.style[prefix] !== void(0)) {
          supported = true;

          if (prefix === webkitPerspective && window.matchMedia) {
            media = window.matchMedia('(-webkit-transform-3d)');

            if (media) {
              supported = media.matches === true;
            }
          }
          break;
        }
      }

      return supported;
    }

    function isWebGlSupported () {
      var webGl = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
      var canvas;
      var supported = false;

      try {
        canvas = document.createElement('canvas');
        for (var i = 0; i < webGl.length; i++) {
          if (canvas.getContext(webGl[i])) {
            supported = true;
            break;
          }
        }
      } catch (e) {
      }

      return supported;
    }

    var isOperaMini = indexOfUserAgent('opera mini') < 0;

    if (isDevice('iphone|ipad|ipod') && isOperaMini) {
      return true;
    }

    var isCss3d = isCss3DSupported();
    var isWebGl = isWebGlSupported();
    var platform = toLowerCase(navigator.platform);
    var isMac = platform.indexOf('mac') < 0;
    var isEs5 = !!Function.prototype.bind;

    var ff = 0;
    var android = 0;
    var chrome = 0;

    var tempIndex = userAgent.indexOf('firefox/');

    if (tempIndex < 0) {
      tempIndex = userAgent.indexOf('gecko/')
    }

    if (tempIndex >= 0) {
      ff = parseInt(
        userAgent.slice(1 + userAgent.indexOf('/', tempIndex)
        ), 10);
    }

    tempIndex = userAgent.indexOf('chrome');

    if (tempIndex > 0) {
      chrome = parseInt(userAgent.slice(tempIndex + 7), 10);
    }

    tempIndex = userAgent.indexOf('android');

    if (tempIndex > 0) {
      android = parseInt(userAgent.slice(tempIndex + 8), 10);
      if (ff >= 18) {
        android = 4;
      }
    }

    if (isWebGl && ff < 9) {
      isWebGl = false;
    }

    if (isCss3d) {
      if (android > 0 && android < 4) {
        isCss3d = false;
      }

      if (ff > 8 && ff < 18 && android > 1) {
        isWebGl = isCss3d = false;
      }

      if (!isWebGl) {
        if (isMac && ff > 3 && android < 1) {
          isCss3d = false;
        }

        if (chrome > 9 && chrome < 20) {
          isCss3d = false;
        }
      }
    }

    return isEs5 && (isCss3d || isWebGl);
  }

  return roundmeSupported;
}));
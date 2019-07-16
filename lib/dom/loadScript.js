const loadScript = (src = '', { callback = () => {}, id, async = false }) => {
  const didNotLoaded = !document.getElementById(id);

  if (didNotLoaded) {
    let script = document.createElement('script');
    script.src = src;
    script.id = id || `script_${+new Date()}`;
    script.async = async;

    script.onerror = function() {
      console.error('error loading' + this.src);
    };

    document.body.appendChild(script);

    script.onload = function() {
      if (typeof callback === 'function') {
        callback();
      }
    };
  } else {
    if (typeof callback === 'function') {
      callback();
    }
  }
};

export default loadScript;

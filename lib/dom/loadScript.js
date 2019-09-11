const loadScript = (
  src = '',
  { onLoad = () => {}, id, async = false } = {}
) => {
  const didNotLoaded = !document.getElementById(id);

  if (didNotLoaded) {
    let script = document.createElement('script');
    script.src = src;
    script.id = id || `script_${+new Date()}`;
    script.async = async;

    script.onload = function() {
      if (typeof onLoad === 'function') {
        onLoad();
      }
    };

    script.onerror = function() {
      console.error('error on loading' + this.src);
    };

    document.body.appendChild(script);
  } else {
    if (typeof onLoad === 'function') {
      onLoad();
    }
  }
};

export default loadScript;

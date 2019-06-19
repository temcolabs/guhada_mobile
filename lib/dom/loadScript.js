const loadScript = (src, callback) => {
  let script = document.createElement('script');
  script.src = src;
  script.id = 'naverLoginInit';
  script.onload = function() {
    callback(script);
  };
  document.body.appendChild(script);
};

export default loadScript;

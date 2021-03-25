import loadScript, { scriptIds } from '../../dom/loadScript';

const script = `(function(w, d, a){
  w.__beusablerumclient__ = {
      load : function(src){
          var b = d.createElement("script");
          b.src = src; b.async=true; b.type = "text/javascript";
          d.getElementsByTagName("head")[0].appendChild(b);
      }
  };w.__beusablerumclient__.load(a);
})(window, document, "//rum.beusable.net/script/b210310e150402u581/f1b987dd0b");`;

export const beusableTracker = () => {
  if (typeof window === 'object') {
    loadScript(null, {
      innerHTML: script,
      id: scriptIds.BEUSABLE_TRACKER,
      replaceExisting: true,
    });
  }
};

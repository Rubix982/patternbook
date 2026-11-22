/* treatments/lumenary/lumenary.js: moved. The styles are in engine/styles/, bundled with the rest of the engine in
   engine/engine.js (window.PatternbookEngine; the studio API is PatternbookEngine.studio). This file stays so pages that
   load it keep working: it loads engine/engine.js in its place and names the studio window.Lumenary, as before. */
(function () {
  var me = document.currentScript, base = me ? me.src.replace(/treatments\/lumenary\/lumenary\.js(\?.*)?$/, '') : '../../';
  document.write('<script src="' + base + 'engine/engine.js"><\/script><script>window.Lumenary = PatternbookEngine.studio;<\/script>');
})();

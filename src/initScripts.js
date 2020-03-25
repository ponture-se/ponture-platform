import loadScript from "utils/loadScript";

export default function initScripts() {
  if (process.env.REACT_APP_ENABLE_CHAT === "true") {
    loadScript("//code.tidio.co/txtwqfpyw2wwumoqftw0v2ejphnagywz.js", () => {
      if (document.tidioChatLang) document.tidioChatLang = "sv";
    });
  }
  if (process.env.REACT_APP_ENABLE_LIVE_VIEW === "true") {
    document.write(
      `<script>
      (function(h, o, t, j, a, r) {
        h.hj =
          h.hj ||
          function() {
            (h.hj.q = h.hj.q || []).push(arguments);
          };

        h._hjSettings = { hjid: 1452246, hjsv: 6 };

        a = o.getElementsByTagName("head")[0];

        r = o.createElement("script");
        r.async = 1;

        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;

        a.appendChild(r);
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
    </script>`
    );
  }
  if (process.env.REACT_APP_ENABLE_ANALYTICS === "true") {
    document.write(`<script>
      !(function() {
        var analytics = (window.analytics = window.analytics || []);
        if (!analytics.initialize)
          if (analytics.invoked)
            window.console &&
              console.error &&
              console.error("Segment snippet included twice.");
          else {
            analytics.invoked = !0;
            analytics.methods = [
              "trackSubmit",
              "trackClick",
              "trackLink",
              "trackForm",
              "pageview",
              "identify",
              "reset",
              "group",
              "track",
              "ready",
              "alias",
              "debug",
              "page",
              "once",
              "off",
              "on"
            ];
            analytics.factory = function(t) {
              return function() {
                var e = Array.prototype.slice.call(arguments);
                e.unshift(t);
                analytics.push(e);
                return analytics;
              };
            };
            for (var t = 0; t < analytics.methods.length; t++) {
              var e = analytics.methods[t];
              analytics[e] = analytics.factory(e);
            }
            analytics.load = function(t, e) {
              var n = document.createElement("script");
              n.type = "text/javascript";
              n.async = !0;
              n.src =
                "https://cdn.segment.com/analytics.js/v1/" +
                t +
                "/analytics.min.js";
              var a = document.getElementsByTagName("script")[0];
              a.parentNode.insertBefore(n, a);
              analytics._loadOptions = e;
            };
            analytics.SNIPPET_VERSION = "4.1.0";

            analytics.load("XghHmkIpyTkrcnP369HlKzwyEPGgXhBD");

            analytics.page();
          }
      })();
    </script>`);
  } else {
    document.write(`<script>
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
            analytics.load("YlbEk8R9LeHXTDeaAq7Tafr2nuhmhBKY");
            analytics.page();
            }}();
            </script>`);
  }
}

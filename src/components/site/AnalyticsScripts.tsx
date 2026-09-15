import { useEffect } from "react";
import { GA_MEASUREMENT_ID, META_PIXEL_ID } from "@/lib/analytics";

/**
 * Loads Google Analytics and the Meta Pixel only when their IDs are configured
 * through environment variables. Renders nothing.
 */
export function AnalyticsScripts() {
  useEffect(() => {
    if (GA_MEASUREMENT_ID && !document.getElementById("ga-script")) {
      const script = document.createElement("script");
      script.id = "ga-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      const inline = document.createElement("script");
      inline.id = "ga-inline";
      inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`;
      document.head.appendChild(inline);
    }

    if (META_PIXEL_ID && !document.getElementById("meta-pixel")) {
      const inline = document.createElement("script");
      inline.id = "meta-pixel";
      inline.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
      document.head.appendChild(inline);
    }
  }, []);

  return null;
}

declare global {
    interface Window {
      Tawk_API?: any;
      Tawk_LoadStart?: Date;
    }
  }
  
  export function loadTawkScript() {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
  
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/66931b09becc2fed69247e5f/1i2na37ro';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
  
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }
  
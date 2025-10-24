"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function Techstack() {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleCredentialResponse = (response: any) => {
      const idToken = response.credential;
      // send to POST http://localhost:4000/api/auth/google
      // Example:
      // fetch('http://localhost:4000/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
    };

    const maybeInit = () => {
      const googleObj = (window as any).google;
      if (!googleObj?.accounts?.id || !buttonRef.current) return;
      googleObj.accounts.id.initialize({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      googleObj.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
      });
      // Or: googleObj.accounts.id.prompt(); // One Tap
    };

    // If the script already loaded before this effect runs
    maybeInit();
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        strategy="afterInteractive"
        onLoad={() => {
          const googleObj = (window as any).google;
          if (!googleObj?.accounts?.id || !buttonRef.current) return;
          googleObj.accounts.id.initialize({
            client_id:
              process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
              "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
            callback: (response: any) => {
              const idToken = response.credential;
              // send to POST http://localhost:4000/api/auth/google
            },
          });
          googleObj.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
          });
          // Or: googleObj.accounts.id.prompt(); // One Tap
        }}
      />
      <div id="google-btn" ref={buttonRef} />
    </>
  );
}



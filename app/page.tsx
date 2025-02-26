import { SolarSystemMain } from "./components/solarsystem/solarsystemmain/solarSystemMain";
import Head from "next/head";

export default function MainPage() {
  return (
    <div>
       <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SolarSystemMain />
    </div>
  );
}

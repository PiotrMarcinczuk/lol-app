"use client";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <>
      {/* <Header initialNickname="" initialTag="" /> */}
      <main>
        <span className="home_description">
          Welcome to SznycLOL it's interactive visualization tool designed for
          League of Legends enthusiasts. Leveraging the powerful Riot API, this
          site dynamically generates bubble charts that showcase your champion
          mastery levels, providing a clear and engaging way to display your
          in-game achievements.
        </span>
        <Link href="help">
          <p className="link_introduction">Click here to check introduction</p>
        </Link>
        <section className="link_section">
          <a href="https://www.riotgames.com/pl">
            <Image
              src="/riot_logo.png"
              alt="Riot Games Logo"
              width={70}
              height={24}
            ></Image>
          </a>
          <a href="https://www.leagueoflegends.com/pl-pl/">
            <Image
              src="/lol_logo.png"
              alt="Leauge of Legends logo"
              width={50}
              height={50}
            ></Image>
          </a>
          <a href="https://nextjs.org/">
            <Image
              src="/next_logo.png"
              alt="Next.js"
              width={50}
              height={50}
            ></Image>
          </a>
          <a href="https://d3js.org/">
            <Image src="/d3_logo.png" alt="d3" width={50} height={50}></Image>
          </a>
          <a href="https://nodejs.org/en">
            <Image
              src="/node-js_logo.png"
              alt="Node.js"
              width={50}
              height={50}
            ></Image>
          </a>
        </section>
      </main>
    </>
  );
}

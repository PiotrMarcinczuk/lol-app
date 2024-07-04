"use client";
import Header from "@/components/Header";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Header initialNickname="" initialTag="" />
      <main>
        <span className="home_description">
          Welcome to SznyCLOL it's interactive visualization tool designed for
          League of Legends enthusiasts. Leveraging the powerful Riot API, this
          site dynamically generates bubble charts that showcase your champion
          mastery levels, providing a clear and engaging way to display your
          in-game achievements.
        </span>
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
        </section>
      </main>
    </>
  );
}

import Image from "next/image";
import { promises as fs } from "fs";
import AsyncSelect from "react-select";
import { useState } from "react";
import HomeComponent from "./component/HomeComponent";

export default async function Home() {
  const data = await fs.readFile(process.cwd() + "/places.json", "utf8");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HomeComponent data={data} />
    </main>
  );
}

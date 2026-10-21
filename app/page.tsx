import Header from "@/components/Header";
import JokeApp from "@/components/JokeApp";

export default function Home() {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <JokeApp />
    </div>
  );
}

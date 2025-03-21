import FocusTimer from "@/components/FocusTimer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Focus Timer</h1>
        <FocusTimer />
      </div>
    </main>
  );
}
import { Navbar } from "@/components/app/navbar";

export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome to Next Auth
            </h2>
          </div>
        </main>
      </div>
    </>
  );
}

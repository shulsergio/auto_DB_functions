import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white sm:text-6xl">
          Welcome
        </h1>

        {/* <div className="total">
          <input
            type="text"
            placeholder="Type something..."
            className="input-field"
          />
          <button className="submit-button">Submit</button>
        </div> */}
      </main>
    </div>
  );
}

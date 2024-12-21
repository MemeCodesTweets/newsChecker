export function AboutUs() {
  return (
    <div className="w-full flex min-h-screen justify-center items-center bg-gradient-to-r pt-28 pb-10 px-4 sm:pt-28">
      <div className="w-full max-w-4xl bg-black bg-gradient-to-br from-white/20 to-white/5 border border-indigo-500 rounded-lg shadow-xl p-8 flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-bold text-center text-white">Who We Are? Your fellow Degens!</h2>
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-x-8 lg:space-y-0 w-full">
          <img
            src="/Degens.gif" // Replace with your image URL
            alt="Team"
            className=" w-40 h-40 object-cover shadow-lg"
          />
          <div className="text-center lg:text-left max-w-2xl">
            <p className="text-lg text-white">
              We are a team of passionate software developers from the Solana community who are tired of seeing fellow degens lose money to rug pulls.
            </p>
            <p className="text-lg text-white mt-4">
              Driven by a desire to protect our community, we created FactCheck AI to empower Solana investors with the knowledge and tools to make informed decisions.
            </p>
            <p className="text-lg text-white mt-4">
              We believe in transparency and open-source development. Our goal is to build a robust and reliable platform that benefits the entire Solana ecosystem.
            </p>
            <p className="text-lg text-white mt-4 font-semibold">
              Affiliated with reputable organizations in the Solana ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

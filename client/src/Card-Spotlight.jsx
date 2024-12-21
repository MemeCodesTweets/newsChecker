import { CardSpotlight } from "@/components/ui/card-spotlight";
import { FaNewspaper, FaChartLine, FaUsers } from 'react-icons/fa'; // Importing React Icons

export function CardSpotlightDemo() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-10 px-4 pt-28">
      {/* Added pt-20 for padding-top to avoid navbar overlap */}
      <p className="text-2xl sm:text-xl font-bold text-white mb-8 text-center">
        Upcoming Gems for the Degens!<br /> All powered by AI and $Check
      </p>
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="AI-Powered News Verifier"
          description="Verifying the URL's authenticity of facts to protect you from rug pulls."
          svgIcon={<FaNewspaper size={40} />}
        />
        <FeatureCard
          title="Chart Analyzer"
          description="Tools to analyze token price charts and detect pump-and-dump patterns."
          svgIcon={<FaChartLine size={40} />}
        />
        <FeatureCard
          title="Holder Distribution Tracker"
          description="Analyzing token holder distributions to ensure no dev bundles hidden supply."
          svgIcon={<FaUsers size={40} />}
        />
      </div>
    </div>
  );
}

const FeatureCard = ({ title, description, svgIcon }) => {
  return (
    <CardSpotlight className="border-indigo-400 border h-full flex flex-col justify-center p-6 bg-gradient-to-br from-zinc-900 to-white/5 text-white rounded-lg shadow-lg hover:bg-black transition duration-300">
      <div className="flex justify-center mb-4">
        {svgIcon}
      </div>
      <p className="text-2xl font-semibold text-center mb-4">{title}</p>
      <p className="text-neutral-200 text-lg text-center">{description}</p>
    </CardSpotlight>
  );
};

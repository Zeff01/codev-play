import FeatureCard from "./FeatureCard";

export default function AboutFeatures() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-20">
      <div className="feature-card">
        <FeatureCard
          icon="🎮"
          title="Multiple Games"
          description="From classic board games to arcade challenges, there's always something new to play and master."
        />
      </div>
      <div className="feature-card">
        <FeatureCard
          icon="📊"
          title="Track Progress"
          description="Monitor your statistics, achievements, and ranking as you compete with players worldwide."
        />
      </div>
      <div className="feature-card">
        <FeatureCard
          icon="🤝"
          title="Connect & Compete"
          description="Challenge friends, join tournaments, and build lasting relationships with the community."
        />
      </div>
    </div>
  );
}

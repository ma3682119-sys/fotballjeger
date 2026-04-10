// Monte Carlo pathway simulation engine

const CLUB_DATA = {
  kjelsas: { youthLevel: 3, seniorLevel: 4, promotionRate: 0.15, coachNewness: 0.3, youthGap: 0.72 },
  frigg: { youthLevel: 3, seniorLevel: 4, promotionRate: 0.20, coachNewness: 0, youthGap: 0.68, pipeline: { to: "kjelsas", rate: 0.25 } },
  grei: { youthLevel: 2, seniorLevel: 3, promotionRate: 0.10, coachNewness: 0, youthGap: 0.45 },
  valerenga: { youthLevel: 1, seniorLevel: 1, promotionRate: 0.02, coachNewness: 0, youthGap: 0.12 },
  skeid: { youthLevel: 2, seniorLevel: 3, promotionRate: 0.08, coachNewness: 0, youthGap: 0.50 },
  lyn: { youthLevel: 2, seniorLevel: 3, promotionRate: 0.09, coachNewness: 0, youthGap: 0.55 },
  stabak: { youthLevel: 2, seniorLevel: 3, promotionRate: 0.07, coachNewness: 0, youthGap: 0.40 },
};

function randomNormal(mean = 0, std = 1) {
  const u1 = Math.random();
  const u2 = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function simulateSinglePath(clubId, targetAge, currentAge = 16) {
  const club = CLUB_DATA[clubId];
  if (!club) return { success: false, path: [], years: 0 };

  const yearsAvailable = targetAge - currentAge;
  const path = [];
  let currentLevel = "youth";
  let rating = Math.max(4, Math.min(10, randomNormal(7.0, 1.2)));
  let year = 0;

  // Phase 1: Youth team integration (0-6 months)
  const integrationSuccess = Math.random() < (0.7 + club.youthGap * 0.3 + club.coachNewness * 0.2);
  if (!integrationSuccess) return { success: false, path: ["Failed youth integration"], years: 0 };
  path.push(`Joined ${clubId} youth`);

  // Phase 2: Youth development (6-18 months)
  for (let m = 0; m < Math.min(yearsAvailable * 12, 24); m++) {
    rating += randomNormal(0.02, 0.15);
    rating = Math.max(4, Math.min(10, rating));

    // Check for promotion each season
    if (m > 5 && m % 6 === 0) {
      const promoChance = club.promotionRate * (rating / 7.0) * (1 + club.coachNewness);
      if (rating >= 7.5 && Math.random() < promoChance) {
        currentLevel = "senior";
        year = m / 12;
        path.push(`Promoted to senior at month ${m}`);
        break;
      }

      // Pipeline transfer check
      if (club.pipeline && m > 11 && rating >= 7.0) {
        if (Math.random() < club.pipeline.rate) {
          path.push(`Pipeline transfer to ${club.pipeline.to}`);
          currentLevel = "transfer";
          year = m / 12;
          break;
        }
      }
    }
  }

  const success = currentLevel !== "youth" && year <= yearsAvailable;
  return { success, path, years: year, finalRating: rating, finalLevel: currentLevel };
}

export function runSimulation(targetLevel = "senior", targetAge = 18, numSims = 100000) {
  const results = {};

  for (const clubId of Object.keys(CLUB_DATA)) {
    let successes = 0;
    let totalYears = 0;
    const paths = [];

    for (let i = 0; i < numSims; i++) {
      const result = simulateSinglePath(clubId, targetAge);
      if (result.success) {
        successes++;
        totalYears += result.years;
        if (paths.length < 5) paths.push(result.path);
      }
    }

    const successRate = (successes / numSims) * 100;
    results[clubId] = {
      clubId,
      clubName: clubId.charAt(0).toUpperCase() + clubId.slice(1),
      successRate: Math.round(successRate * 10) / 10,
      avgYears: successes > 0 ? Math.round((totalYears / successes) * 10) / 10 : null,
      simCount: numSims,
      samplePaths: paths,
      viable: successRate > 5,
    };
  }

  // Sort by success rate
  const ranked = Object.values(results)
    .sort((a, b) => b.successRate - a.successRate)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return {
    targetLevel,
    targetAge,
    totalSimulations: numSims * Object.keys(CLUB_DATA).length,
    timestamp: new Date().toISOString(),
    paths: ranked,
  };
}

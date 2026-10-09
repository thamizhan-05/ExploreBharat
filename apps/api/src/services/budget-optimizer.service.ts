export interface BudgetOptimizationInput {
  allocatedBudgetInr: number;
  currentTotalInr: number;
  hotelCostInr: number;
  transportCostInr: number;
  ticketsCostInr: number;
  foodCostInr: number;
  days: number;
  travellers: number;
  destination: string;
}

export interface BudgetAlternative {
  category: 'HOTEL' | 'TRANSPORT' | 'ATTRACTIONS' | 'DINING';
  title: string;
  potentialSavingsInr: number;
  description: string;
  recommendedAction: string;
}

export class BudgetOptimizerService {
  analyzeBudget(input: BudgetOptimizationInput) {
    const { allocatedBudgetInr, currentTotalInr, hotelCostInr, transportCostInr, ticketsCostInr, foodCostInr } = input;
    const differenceInr = currentTotalInr - allocatedBudgetInr;
    const isOverBudget = differenceInr > 0;

    const alternatives: BudgetAlternative[] = [];

    if (isOverBudget) {
      // 1. Hotel alternative
      if (hotelCostInr > 3000) {
        const potentialSavings = Math.round(hotelCostInr * 0.35);
        alternatives.push({
          category: 'HOTEL',
          title: 'Switch to Verified Heritage Homestay or Haveli',
          potentialSavingsInr: potentialSavings,
          description: `Switching from luxury resort to a top-rated heritage haveli preserves authentic ambience while cutting lodging expense.`,
          recommendedAction: `Filter hotels by "HERITAGE" or "BUDGET" tier to save ₹${potentialSavings.toLocaleString('en-IN')}.`
        });
      }

      // 2. Transport alternative
      if (transportCostInr > 3000) {
        const potentialSavings = Math.round(transportCostInr * 0.4);
        alternatives.push({
          category: 'TRANSPORT',
          title: 'Opt for Indian Railways Vande Bharat / Superfast Express',
          potentialSavingsInr: potentialSavings,
          description: `Train Chair Car / AC-3T offers high punctuality and comfort at a fraction of dynamic flight or private cab costs.`,
          recommendedAction: `Select "Train Preferred" or "Cheapest" transit alternative to save ₹${potentialSavings.toLocaleString('en-IN')}.`
        });
      }

      // 3. Free Attractions Alternative
      if (ticketsCostInr > 500) {
        const potentialSavings = Math.round(ticketsCostInr * 0.5);
        alternatives.push({
          category: 'ATTRACTIONS',
          title: 'Explore India for Free (Zero Ticket Monuments)',
          potentialSavingsInr: potentialSavings,
          description: `Complement paid ticketed forts with iconic free cultural viewpoints, public ghats, and open-air heritage promenades.`,
          recommendedAction: `Apply "Explore India for Free" filter on the Attractions catalog to save ₹${potentialSavings.toLocaleString('en-IN')}.`
        });
      }

      // 4. Dining Optimization
      if (foodCostInr > 2000) {
        const potentialSavings = Math.round(foodCostInr * 0.25);
        alternatives.push({
          category: 'DINING',
          title: 'Authentic Local Thalis & Street Food Walks',
          potentialSavingsInr: potentialSavings,
          description: `Enjoy renowned regional thali houses and traditional street vendors instead of high-end hotel fine dining.`,
          recommendedAction: `Prioritize legendary municipal food stops to save ₹${potentialSavings.toLocaleString('en-IN')}.`
        });
      }
    }

    const totalPotentialSavings = alternatives.reduce((sum, a) => sum + a.potentialSavingsInr, 0);

    return {
      allocatedBudgetInr,
      currentTotalInr,
      differenceInr,
      isOverBudget,
      summaryMessage: isOverBudget
        ? `You are ₹${differenceInr.toLocaleString('en-IN')} over target budget. We identified ${alternatives.length} actionable optimizations saving up to ₹${totalPotentialSavings.toLocaleString('en-IN')}.`
        : `Your trip is comfortably within budget with ₹${Math.abs(differenceInr).toLocaleString('en-IN')} headroom.`,
      alternatives,
      totalPotentialSavingsInr: totalPotentialSavings
    };
  }
}

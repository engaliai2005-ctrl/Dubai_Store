import { AIQuestionnaireAnswers, AIRecommendationResult, Product } from "./types";

function getBudgetBounds(budgetKey: string): { min: number; max: number } {
  switch (budgetKey) {
    case "under-15000":
      return { min: 0, max: 20000 };
    case "15000-30000":
      return { min: 14000, max: 32000 };
    case "30000-50000":
      return { min: 28000, max: 55000 };
    case "above-50000":
      return { min: 45000, max: 200000 };
    default:
      return { min: 0, max: 200000 };
  }
}

export function computePhoneRecommendations(
  answers: AIQuestionnaireAnswers,
  catalog: Product[]
): AIRecommendationResult[] {
  // Only evaluate phones that are in stock / available
  const phoneProducts = catalog.filter(
    (p) =>
      p.isAvailable &&
      (p.category === "iphone" ||
        p.category === "samsung" ||
        p.category === "smartphones")
  );

  if (phoneProducts.length === 0) return [];

  const { min: budgetMin, max: budgetMax } = getBudgetBounds(answers.budget);

  const scoredPhones = phoneProducts.map((phone) => {
    let score = 50;
    const matchedFeatures: string[] = [];

    // 1. Budget
    if (phone.price >= budgetMin && phone.price <= budgetMax) {
      score += 25;
      matchedFeatures.push("سعره مظبوط تماماً جوه ميزانيتك اللي حددتها");
    } else if (phone.price < budgetMin) {
      score += 18;
      matchedFeatures.push("أوفر من ميزانيتك بكتير وهيقدملك قيمة ممتازة");
    } else {
      const diffRatio = (phone.price - budgetMax) / budgetMax;
      if (diffRatio < 0.2) {
        score += 8;
      } else {
        score -= 20;
      }
    }

    // 2. Brand
    if (answers.brand === "apple") {
      if (phone.brand === "Apple") {
        score += 25;
        matchedFeatures.push("آيفون أصلي بضمان معتمد واستقرار نظام iOS");
      } else {
        score -= 30;
      }
    } else if (answers.brand === "samsung") {
      if (phone.brand === "Samsung") {
        score += 25;
        matchedFeatures.push("سامسونج جالاكسي مع شاشة أموليد خرافية وميزات الذكاء الاصطناعي");
      } else {
        score -= 30;
      }
    } else {
      score += 10;
    }

    // 3. Priority
    if (answers.priority === "camera") {
      if (phone.id.includes("pro") || phone.id.includes("ultra") || phone.id.includes("pixel")) {
        score += 25;
        matchedFeatures.push("كاميرات احترافية بتطلع صور بورتريه وفيديوهات سينمائية نقية");
      } else {
        score += 10;
      }
    } else if (answers.priority === "gaming") {
      if (phone.id.includes("pro") || phone.id.includes("ultra") || phone.specs["المعالج"]?.includes("Snapdragon") || phone.specs["المعالج"]?.includes("A18")) {
        score += 25;
        matchedFeatures.push("معالج فائق السرعة وشاشة 120Hz لتشغيل كل الألعاب بسلاسة");
      }
    } else if (answers.priority === "battery") {
      if (phone.id.includes("max") || phone.id.includes("ultra") || phone.id.includes("a55")) {
        score += 25;
        matchedFeatures.push("بطارية ضخمة هتكفيك اليوم كله استخدام تقيل من غير ما تشيل هم الشاحن");
      }
    }

    // 4. Primary Usage
    if (answers.primaryUsage === "photography") {
      score += 10;
    } else if (answers.primaryUsage === "work") {
      if (phone.id.includes("ultra") || phone.id.includes("pro")) {
        score += 15;
        matchedFeatures.push("مثالي جداً للشغل والمكالمات وتعدد المهام اليومية");
      }
    }

    // 5. Storage
    if (answers.storage && answers.storage !== "مش فارقة") {
      if (phone.storageOptions?.some((s) => s.includes(answers.storage))) {
        score += 10;
        matchedFeatures.push(`متوفر بالمساحة اللي انت محتاجها (${answers.storage})`);
      }
    }

    const normalizedScore = Math.min(99, Math.max(75, Math.round(score)));

    // Egyptian explanation
    let personalizedReason = "";
    if (phone.brand === "Apple") {
      personalizedReason = `الموبايل ده مناسب جداً لاحتياجك، بيقدملك أعلى ثبات في الفيديوهات والتصوير، وقوة معالج تعيش معاك سنين قدام بدون أي تهنيج.`;
    } else if (phone.brand === "Samsung") {
      personalizedReason = `اختيار مثالي عشان شاشته أموليد ألوانها تحفة ومريحة للعين، وبطاريته كبيرة، وفيه ميزات ذكاء اصطناعي هتسهل عليك كل حاجة في يومك.`;
    } else {
      personalizedReason = `بيقدملك أفضل خلطة بين الكاميرات الواقعية جداً والأداء السلس والسعر المناسب.`;
    }

    // Compatible accessories
    const suggestedAccessories: Product[] = [];
    if (phone.compatibleAccessories && phone.compatibleAccessories.length > 0) {
      phone.compatibleAccessories.forEach((accId) => {
        const item = catalog.find((c) => c.id === accId && c.isAvailable);
        if (item) suggestedAccessories.push(item);
      });
    }

    if (suggestedAccessories.length === 0) {
      const genericAccessories = catalog.filter(
        (c) =>
          c.isAvailable &&
          (c.category === "chargers" ||
            c.category === "cases" ||
            c.category === "protection" ||
            c.category === "earbuds")
      );
      suggestedAccessories.push(...genericAccessories.slice(0, 3));
    }

    return {
      product: phone,
      matchScore: normalizedScore,
      reason: personalizedReason,
      matchedFeatures: matchedFeatures.slice(0, 3),
      suggestedAccessories: suggestedAccessories.slice(0, 4),
    };
  });

  scoredPhones.sort((a, b) => b.matchScore - a.matchScore);
  return scoredPhones.slice(0, 3);
}

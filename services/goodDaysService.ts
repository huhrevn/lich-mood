import lunisolar from 'lunisolar';
import {
    DayRating,
    DayQuality,
    GoodDaySearchParams,
    GoodDayResult,
    DayAnalysis
} from '../types/goodDaysTypes';
import {
    TWELVE_OFFICERS,
    ZODIAC_STARS,
    LUCKY_STARS,
    UNLUCKY_STARS,
    ACTIVITY_BASE_SCORES
} from '../constants/goodDaysConstants';

/**
 * Calculate the 12 Officer (Kiến Trừ) for a given lunar date
 */
const getTwelveOfficer = (lunarMonth: number, lunarDay: number): { name: string; type: string; description: string } => {
    // Simplified algorithm: (month + day - 2) % 12
    const index = (lunarMonth + lunarDay - 2) % 12;
    return TWELVE_OFFICERS[index];
};

/**
 * Calculate the Zodiac Star (Hoàng đạo/Hắc đạo) for a given date
 */
const getZodiacStar = (lunarMonth: number, lunarDay: number): { name: string; isLucky: boolean; description: string } => {
    // Simplified algorithm based on lunar day
    const index = (lunarDay - 1) % 12;
    return ZODIAC_STARS[index];
};

/**
 * Get lucky stars for a date (simplified random selection for demo)
 */
const getLuckyStars = (date: Date): string[] => {
    const seed = date.getDate() + date.getMonth() * 31;
    const count = (seed % 3) + 1; // 1-3 lucky stars
    const stars: string[] = [];

    for (let i = 0; i < count; i++) {
        const index = (seed + i * 7) % LUCKY_STARS.length;
        if (!stars.includes(LUCKY_STARS[index])) {
            stars.push(LUCKY_STARS[index]);
        }
    }

    return stars;
};

/**
 * Get unlucky stars for a date (simplified random selection for demo)
 */
const getUnluckyStars = (date: Date): string[] => {
    const seed = date.getDate() + date.getMonth() * 31 + 13;
    const count = (seed % 2); // 0-1 unlucky stars
    const stars: string[] = [];

    for (let i = 0; i < count; i++) {
        const index = (seed + i * 11) % UNLUCKY_STARS.length;
        if (!stars.includes(UNLUCKY_STARS[index])) {
            stars.push(UNLUCKY_STARS[index]);
        }
    }

    return stars;
};

/**
 * Calculate conflict ages based on lunar year
 */
const getConflictAges = (lunarYear: number): number[] => {
    const currentYear = new Date().getFullYear();
    const zodiacIndex = (lunarYear - 4) % 12;
    const conflictIndex = (zodiacIndex + 6) % 12;

    const ages: number[] = [];
    for (let i = 0; i < 100; i += 12) {
        const age = currentYear - (lunarYear - conflictIndex - i);
        if (age > 0 && age < 120) {
            ages.push(age);
        }
    }

    return ages;
};

/**
 * Calculate quality level from score
 */
const getQualityFromScore = (score: number): DayQuality => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'neutral';
    if (score >= 30) return 'bad';
    return 'terrible';
};

/**
 * Calculate score for a specific activity on a given day
 */
const calculateActivityScore = (
    activityId: string,
    officer: { name: string; type: string },
    zodiacStar: { name: string; isLucky: boolean },
    luckyStars: string[],
    unluckyStars: string[],
    isConflict: boolean
): { score: number; quality: DayQuality; reasons: string[] } => {
    let score = ACTIVITY_BASE_SCORES[activityId] || 50;
    const reasons: string[] = [];

    // Officer bonus/penalty
    if (officer.type === 'good') {
        score += 15;
        reasons.push(`Ngày ${officer.name} - Tốt cho mọi việc`);
    } else if (officer.type === 'bad') {
        score -= 15;
        reasons.push(`Ngày ${officer.name} - Nên hạn chế`);
    }

    // Zodiac bonus/penalty
    if (zodiacStar.isLucky) {
        score += 10;
        reasons.push(`${zodiacStar.name} - Hoàng đạo`);
    } else {
        score -= 10;
        reasons.push(`${zodiacStar.name} - Hắc đạo`);
    }

    // Lucky stars bonus
    luckyStars.forEach(star => {
        score += 5;
        reasons.push(`Có sao ${star}`);
    });

    // Unlucky stars penalty
    unluckyStars.forEach(star => {
        score -= 8;
        reasons.push(`Có sao ${star} - Nên cẩn trọng`);
    });

    // Conflict age penalty
    if (isConflict) {
        score -= 20;
        reasons.push('Tuổi xung - Không nên làm việc quan trọng');
    }

    // Clamp score between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        quality: getQualityFromScore(score),
        reasons
    };
};

/**
 * Calculate comprehensive day rating
 */
export const calculateDayRating = (date: Date, activities: string[], birthYear?: number): DayRating => {
    const lunar = lunisolar(date);
    const lunarDate = {
        day: lunar.lunar.day,
        month: lunar.lunar.month,
        year: lunar.lunar.year,
        isLeap: lunar.lunar.isLeapMonth
    };

    const canChi = {
        day: `${lunar.char8.day.stem.toString()}${lunar.char8.day.branch.toString()}`,
        month: `${lunar.char8.month.stem.toString()}${lunar.char8.month.branch.toString()}`,
        year: `${lunar.char8.year.stem.toString()}${lunar.char8.year.branch.toString()}`
    };

    const officer = getTwelveOfficer(lunarDate.month, lunarDate.day);
    const zodiacStar = getZodiacStar(lunarDate.month, lunarDate.day);
    const luckyStars = getLuckyStars(date);
    const unluckyStars = getUnluckyStars(date);
    const conflictAges = getConflictAges(lunarDate.year);
    const isConflict = birthYear ? conflictAges.includes(new Date().getFullYear() - birthYear) : false;

    // Calculate scores for each activity
    const activityRatings = activities.map(activityId => {
        const result = calculateActivityScore(
            activityId,
            officer,
            zodiacStar,
            luckyStars,
            unluckyStars,
            isConflict
        );
        return {
            activityId,
            ...result
        };
    });

    // Calculate overall score (average of all activities)
    const overallScore = activityRatings.length > 0
        ? Math.round(activityRatings.reduce((sum, a) => sum + a.score, 0) / activityRatings.length)
        : 50;

    return {
        date,
        solarDate: date.toISOString().split('T')[0],
        lunarDate,
        canChi,
        score: overallScore,
        quality: getQualityFromScore(overallScore),
        activities: activityRatings,
        luckyStars,
        unluckyStars,
        zodiacOfficer: officer.name,
        isZodiacDay: zodiacStar.isLucky,
        conflictAges
    };
};

/**
 * Find good days within a date range
 */
export const findGoodDays = (params: GoodDaySearchParams): GoodDayResult[] => {
    const {
        activities,
        startDate,
        endDate,
        birthYear,
        minScore = 60,
        maxResults = 30
    } = params;

    const results: GoodDayResult[] = [];
    const current = new Date(startDate);

    while (current <= endDate && results.length < maxResults) {
        const rating = calculateDayRating(new Date(current), activities, birthYear);

        // Filter by minimum score
        if (rating.score >= minScore) {
            const matchedActivities = rating.activities
                .filter(a => a.score >= minScore)
                .map(a => a.activityId);

            if (matchedActivities.length > 0) {
                const highlights: string[] = [];

                if (rating.isZodiacDay) highlights.push('Ngày Hoàng đạo');
                if (rating.luckyStars.length >= 2) highlights.push(`${rating.luckyStars.length} sao tốt`);
                if (rating.score >= 85) highlights.push('Điểm số rất cao');

                results.push({
                    date: new Date(current),
                    rating,
                    matchedActivities,
                    averageScore: rating.score,
                    highlights
                });
            }
        }

        current.setDate(current.getDate() + 1);
    }

    // Sort by score descending
    return results.sort((a, b) => b.averageScore - a.averageScore);
};

/**
 * Get detailed analysis for a specific day
 */
export const getDayAnalysis = (date: Date, activities: string[], birthYear?: number): DayAnalysis => {
    const rating = calculateDayRating(date, activities, birthYear);

    // Generate recommendations
    const goodActivities = rating.activities.filter(a => a.score >= 70);
    const badActivities = rating.activities.filter(a => a.score < 50);

    const toDo = goodActivities.length > 0
        ? goodActivities.map(a => a.reasons[0] || 'Phù hợp')
        : ['Các việc thông thường, không quá quan trọng'];

    const toAvoid = badActivities.length > 0
        ? badActivities.map(a => a.reasons.find(r => r.includes('Nên')) || 'Nên cẩn trọng')
        : ['Không có việc cần tránh đặc biệt'];

    // Generate detailed analysis
    const canChiAnalysis = `Ngày ${rating.canChi.day}, tháng ${rating.canChi.month}, năm ${rating.canChi.year}. ` +
        `Ngày ${rating.zodiacOfficer} thuộc ${rating.isZodiacDay ? 'Hoàng đạo' : 'Hắc đạo'}.`;

    const starAnalysis = rating.luckyStars.length > 0
        ? `Có các sao tốt: ${rating.luckyStars.join(', ')}. `
        : 'Không có sao tốt đặc biệt. ';

    const zodiacAnalysis = rating.isZodiacDay
        ? 'Đây là ngày Hoàng đạo, thích hợp cho các việc quan trọng.'
        : 'Đây là ngày Hắc đạo, nên cẩn trọng khi làm việc lớn.';

    const generalAdvice = rating.score >= 70
        ? 'Ngày tốt, phù hợp để thực hiện các kế hoạch quan trọng.'
        : rating.score >= 50
            ? 'Ngày bình thường, có thể làm việc nhưng nên cân nhắc kỹ.'
            : 'Ngày không thuận lợi, nên hoãn các việc quan trọng nếu có thể.';

    return {
        rating,
        recommendations: {
            toDo,
            toAvoid
        },
        detailedAnalysis: {
            canChiAnalysis,
            starAnalysis,
            zodiacAnalysis,
            generalAdvice
        }
    };
};

/**
 * Get activity recommendations for a specific day
 */
export const getActivityRecommendations = (date: Date, birthYear?: number): {
    recommended: string[];
    notRecommended: string[];
} => {
    const allActivities = Object.keys(ACTIVITY_BASE_SCORES);
    const rating = calculateDayRating(date, allActivities, birthYear);

    const recommended = rating.activities
        .filter(a => a.score >= 70)
        .map(a => a.activityId);

    const notRecommended = rating.activities
        .filter(a => a.score < 50)
        .map(a => a.activityId);

    return {
        recommended,
        notRecommended
    };
};

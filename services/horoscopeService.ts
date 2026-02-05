import lunisolar from 'lunisolar';
import {
    BirthInfo,
    BirthChart,
    Palace,
    Star,
    PalaceAnalysis,
    YearlyFortune,
    Compatibility,
    EarthlyBranch,
    FiveElements,
    PalaceName
} from '../types/horoscopeTypes';
import {
    EARTHLY_BRANCHES,
    PALACES,
    MAJOR_STARS,
    MINOR_STARS,
    MALEFIC_STARS,
    FIVE_ELEMENTS_INFO,
    DESTINY_TABLE,
    PALACE_ORDER
} from '../constants/horoscopeConstants';

/**
 * Calculate Life Palace position (Cung Mệnh)
 * Formula: (Lunar Month + Birth Hour) % 12
 */
const calculateLifePalacePosition = (lunarMonth: number, birthHour: number): number => {
    return (lunarMonth + birthHour - 1) % 12;
};

/**
 * Calculate Destiny (Cục số) based on year and month
 * Simplified version - uses year stem and month
 */
const calculateDestiny = (lunarYear: number, lunarMonth: number): FiveElements => {
    const yearStem = lunarYear % 10;
    const key = (yearStem + lunarMonth) % 12;
    return DESTINY_TABLE[key] || 'tho';
};

/**
 * Calculate Tu Vi star position based on destiny and birth day
 */
const calculateTuViPosition = (destiny: FiveElements, lunarDay: number): number => {
    // Simplified calculation
    const destinyValue = {
        'thuy': 2,
        'moc': 3,
        'kim': 4,
        'tho': 5,
        'hoa': 6
    }[destiny] || 5;

    return (destinyValue + lunarDay - 1) % 12;
};

/**
 * Place major stars in palaces based on Tu Vi position
 */
const placeMajorStars = (tuViPosition: number, palaces: Palace[]): void => {
    // Place Tử Vi
    const tuViStar = MAJOR_STARS.find(s => s.id === 'tu-vi');
    if (tuViStar) {
        palaces[tuViPosition].stars.push(tuViStar);
    }

    // Place other major stars in specific positions relative to Tử Vi
    const starPositions: Record<string, number> = {
        'thien-co': (tuViPosition + 1) % 12,
        'thai-duong': (tuViPosition + 2) % 12,
        'vu-khuc': (tuViPosition + 3) % 12,
        'thien-dong': (tuViPosition + 4) % 12,
        'liem-trinh': (tuViPosition + 5) % 12,
        'thien-phu': (tuViPosition + 6) % 12,
        'thai-am': (tuViPosition + 7) % 12,
        'tham-lang': (tuViPosition + 8) % 12,
        'cu-mon': (tuViPosition + 9) % 12,
        'thien-tuong': (tuViPosition + 10) % 12,
        'thien-luong': (tuViPosition + 11) % 12,
        'that-sat': (tuViPosition + 4) % 12,
        'pha-quan': (tuViPosition + 8) % 12
    };

    Object.entries(starPositions).forEach(([starId, position]) => {
        const star = MAJOR_STARS.find(s => s.id === starId);
        if (star && !palaces[position].stars.find(s => s.id === starId)) {
            palaces[position].stars.push(star);
        }
    });
};

/**
 * Place minor stars (simplified)
 */
const placeMinorStars = (birthHour: number, palaces: Palace[]): void => {
    // Simplified placement based on birth hour
    const positions = [
        (birthHour + 1) % 12,
        (birthHour + 5) % 12,
        (birthHour + 7) % 12,
        (birthHour + 11) % 12
    ];

    MINOR_STARS.forEach((star, index) => {
        if (positions[index] !== undefined) {
            palaces[positions[index]].stars.push(star);
        }
    });
};

/**
 * Place malefic stars (simplified)
 */
const placeMaleficStars = (lunarYear: number, palaces: Palace[]): void => {
    // Simplified placement based on year
    const yearMod = lunarYear % 12;
    const positions = [
        yearMod,
        (yearMod + 6) % 12,
        (yearMod + 3) % 12,
        (yearMod + 9) % 12
    ];

    MALEFIC_STARS.forEach((star, index) => {
        if (positions[index] !== undefined) {
            palaces[positions[index]].stars.push(star);
        }
    });
};

/**
 * Calculate element for each palace
 */
const calculatePalaceElement = (position: number): FiveElements => {
    const elementCycle: FiveElements[] = ['moc', 'hoa', 'tho', 'kim', 'thuy'];
    return elementCycle[position % 5];
};

/**
 * Main function to calculate birth chart
 */
export const calculateBirthChart = (birthInfo: BirthInfo): BirthChart => {
    // Convert to lunar if needed
    let lunarDate = birthInfo.lunarDate;
    if (!lunarDate || birthInfo.calendarType === 'solar') {
        const lunar = lunisolar(birthInfo.date);
        lunarDate = {
            day: lunar.lunar.day,
            month: lunar.lunar.month,
            year: lunar.lunar.year,
            isLeap: lunar.lunar.isLeapMonth
        };
    }

    // Calculate life palace position
    const lifePalacePosition = calculateLifePalacePosition(lunarDate.month, birthInfo.hour);

    // Calculate destiny
    const destiny = calculateDestiny(lunarDate.year, lunarDate.month);

    // Initialize palaces
    const palaces: Palace[] = EARTHLY_BRANCHES.map((branch, index) => {
        const palaceIndex = (lifePalacePosition + index) % 12;
        const palaceInfo = PALACES[palaceIndex];

        return {
            name: palaceInfo.id,
            branch: branch.id,
            position: index,
            stars: [],
            element: calculatePalaceElement(index),
            isLifePalace: index === lifePalacePosition,
            meaning: palaceInfo.meaning
        };
    });

    // Calculate Tu Vi position and place stars
    const tuViPosition = calculateTuViPosition(destiny, lunarDate.day);
    placeMajorStars(tuViPosition, palaces);
    placeMinorStars(birthInfo.hour, palaces);
    placeMaleficStars(lunarDate.year, palaces);

    // Get all major stars
    const majorStars = palaces.flatMap(p => p.stars.filter(s => s.type === 'major'));

    // Generate basic analysis
    const lifePalace = palaces[lifePalacePosition];
    const analysis = generateBasicAnalysis(lifePalace, destiny, birthInfo.gender);

    return {
        birthInfo: {
            ...birthInfo,
            lunarDate
        },
        palaces,
        lifePalacePosition,
        destiny,
        majorStars,
        analysis
    };
};

/**
 * Generate basic personality analysis
 */
const generateBasicAnalysis = (
    lifePalace: Palace,
    destiny: FiveElements,
    gender: 'male' | 'female'
): BirthChart['analysis'] => {
    const elementInfo = FIVE_ELEMENTS_INFO[destiny];
    const beneficStars = lifePalace.stars.filter(s => s.isBenefic);
    const maleficStars = lifePalace.stars.filter(s => !s.isBenefic);

    let personality = `Người mệnh ${elementInfo.name}, ${elementInfo.characteristics.toLowerCase()}. `;

    if (beneficStars.length > maleficStars.length) {
        personality += 'Có nhiều sao tốt chiếu mệnh, vận may thuận lợi.';
    } else if (maleficStars.length > beneficStars.length) {
        personality += 'Có sao xấu chiếu mệnh, cần cẩn trọng trong cuộc sống.';
    } else {
        personality += 'Cát hung cân bằng, vận mệnh trung bình.';
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Analyze based on major stars in life palace
    lifePalace.stars.forEach(star => {
        if (star.type === 'major') {
            if (star.isBenefic) {
                strengths.push(star.description);
            } else {
                weaknesses.push(star.description);
            }
        }
    });

    if (strengths.length === 0) {
        strengths.push('Kiên trì, nỗ lực');
    }
    if (weaknesses.length === 0) {
        weaknesses.push('Cần học cách kiên nhẫn hơn');
    }

    const lifeDirection = beneficStars.length > 0
        ? 'Nên phát huy điểm mạnh, tập trung vào sự nghiệp và phát triển bản thân.'
        : 'Nên cẩn trọng trong mọi quyết định, tích lũy kinh nghiệm và đức hạnh.';

    return {
        personality,
        strengths: strengths.slice(0, 3),
        weaknesses: weaknesses.slice(0, 3),
        lifeDirection
    };
};

/**
 * Analyze a specific palace
 */
export const analyzePalace = (palace: Palace): PalaceAnalysis => {
    const beneficStars = palace.stars.filter(s => s.isBenefic);
    const maleficStars = palace.stars.filter(s => !s.isBenefic);

    // Calculate rating
    let rating = 50;
    beneficStars.forEach(star => {
        rating += (star.brightness || 3) * 5;
    });
    maleficStars.forEach(star => {
        rating -= (star.brightness || 2) * 8;
    });
    rating = Math.max(0, Math.min(100, rating));

    const quality = rating >= 75 ? 'excellent' : rating >= 60 ? 'good' : rating >= 40 ? 'neutral' : 'bad';

    // Generate interpretation
    const palaceInfo = PALACES.find(p => p.id === palace.name);
    let interpretation = `${palaceInfo?.description || ''}. `;

    if (beneficStars.length > 0) {
        interpretation += `Có ${beneficStars.map(s => s.name).join(', ')} chiếu, mang lại may mắn. `;
    }
    if (maleficStars.length > 0) {
        interpretation += `Có ${maleficStars.map(s => s.name).join(', ')}, cần chú ý. `;
    }

    const advice: string[] = [];
    if (quality === 'excellent' || quality === 'good') {
        advice.push('Đây là cung tốt, hãy tận dụng cơ hội');
        advice.push('Phát huy thế mạnh của bản thân');
    } else {
        advice.push('Cần cẩn trọng và kiên nhẫn');
        advice.push('Tích lũy đức hạnh để cải thiện vận mệnh');
    }

    return {
        palace,
        rating,
        quality,
        interpretation,
        advice,
        influences: generatePalaceInfluences(palace)
    };
};

/**
 * Generate influences for a palace
 */
const generatePalaceInfluences = (palace: Palace): PalaceAnalysis['influences'] => {
    const influences: PalaceAnalysis['influences'] = {};

    switch (palace.name) {
        case 'menh':
            influences.career = 'Ảnh hưởng trực tiếp đến sự nghiệp';
            influences.health = 'Quyết định sức khỏe tổng quát';
            break;
        case 'quan-loc':
            influences.career = 'Quyết định thành công trong công việc';
            break;
        case 'tai-bach':
            influences.wealth = 'Ảnh hưởng đến tài chính và của cải';
            break;
        case 'phu-the':
            influences.relationship = 'Quyết định hạnh phúc hôn nhân';
            break;
        case 'tat-ach':
            influences.health = 'Ảnh hưởng đến sức khỏe thể chất';
            break;
    }

    return influences;
};

/**
 * Predict yearly fortune
 */
export const predictYearlyFortune = (birthChart: BirthChart, year: number): YearlyFortune => {
    const age = year - birthChart.birthInfo.lunarDate!.year;
    const yearPalaceIndex = (birthChart.lifePalacePosition + age) % 12;
    const yearPalace = birthChart.palaces[yearPalaceIndex];

    const beneficStars = yearPalace.stars.filter(s => s.isBenefic);
    const maleficStars = yearPalace.stars.filter(s => !s.isBenefic);

    let overallRating = 50 + (beneficStars.length * 10) - (maleficStars.length * 15);
    overallRating = Math.max(0, Math.min(100, overallRating));

    // Generate lucky/unlucky months (simplified)
    const luckyMonths: number[] = [];
    const unluckyMonths: number[] = [];

    for (let month = 1; month <= 12; month++) {
        const monthScore = (overallRating + (month * 7)) % 100;
        if (monthScore >= 60) {
            luckyMonths.push(month);
        } else if (monthScore < 40) {
            unluckyMonths.push(month);
        }
    }

    return {
        year,
        overallRating,
        luckyMonths,
        unluckyMonths,
        predictions: {
            career: overallRating >= 60 ? 'Sự nghiệp thuận lợi, có cơ hội thăng tiến' : 'Cần nỗ lực và kiên nhẫn trong công việc',
            wealth: overallRating >= 60 ? 'Tài chính ổn định, có thu nhập tốt' : 'Cần tiết kiệm và quản lý chi tiêu',
            health: overallRating >= 60 ? 'Sức khỏe tốt, tinh thần sảng khoái' : 'Chú ý chăm sóc sức khỏe',
            relationship: overallRating >= 60 ? 'Quan hệ hòa hợp, may mắn trong tình cảm' : 'Cần kiên nhẫn và thấu hiểu'
        },
        advice: [
            overallRating >= 60 ? 'Tận dụng cơ hội để phát triển' : 'Giữ thái độ tích cực và kiên nhẫn',
            'Tích lũy đức hạnh và làm việc thiện',
            'Chú ý sức khỏe và quan hệ gia đình'
        ]
    };
};

/**
 * Calculate compatibility between two people
 */
export const calculateCompatibility = (
    person1: BirthInfo,
    person2: BirthInfo
): Compatibility => {
    const chart1 = calculateBirthChart(person1);
    const chart2 = calculateBirthChart(person2);

    // Check element relationship
    const element1 = chart1.destiny;
    const element2 = chart2.destiny;

    const elementRelation = checkElementRelation(element1, element2);

    let compatibilityScore = 50;

    if (elementRelation === 'mutual-generation') {
        compatibilityScore += 30;
    } else if (elementRelation === 'mutual-destruction') {
        compatibilityScore -= 20;
    }

    // Check palace compatibility
    const palace1 = chart1.palaces[chart1.lifePalacePosition];
    const palace2 = chart2.palaces[chart2.lifePalacePosition];

    const commonBeneficStars = palace1.stars.filter(s1 =>
        s1.isBenefic && palace2.stars.some(s2 => s2.id === s1.id)
    );

    compatibilityScore += commonBeneficStars.length * 10;
    compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));

    return {
        person1Birth: person1,
        person2Birth: person2,
        compatibilityScore,
        elementRelation,
        analysis: generateCompatibilityAnalysis(compatibilityScore, elementRelation),
        strengths: generateCompatibilityStrengths(elementRelation),
        challenges: generateCompatibilityChallenges(elementRelation),
        advice: [
            'Tôn trọng và thấu hiểu lẫn nhau',
            'Cùng nhau vượt qua khó khăn',
            'Gìn giữ tình cảm bằng sự chân thành'
        ]
    };
};

const checkElementRelation = (element1: FiveElements, element2: FiveElements): Compatibility['elementRelation'] => {
    const generation: Record<FiveElements, FiveElements> = {
        moc: 'hoa',
        hoa: 'tho',
        tho: 'kim',
        kim: 'thuy',
        thuy: 'moc'
    };

    const destruction: Record<FiveElements, FiveElements> = {
        moc: 'tho',
        tho: 'thuy',
        thuy: 'hoa',
        hoa: 'kim',
        kim: 'moc'
    };

    if (generation[element1] === element2 || generation[element2] === element1) {
        return 'mutual-generation';
    } else if (destruction[element1] === element2 || destruction[element2] === element1) {
        return 'mutual-destruction';
    }
    return 'neutral';
};

const generateCompatibilityAnalysis = (score: number, relation: Compatibility['elementRelation']): string => {
    if (score >= 70) {
        return 'Hai người rất hợp nhau, có thể xây dựng mối quan hệ bền vững.';
    } else if (score >= 50) {
        return 'Mối quan hệ khá tốt, cần nỗ lực để duy trì.';
    } else {
        return 'Có một số khó khăn, cần kiên nhẫn và thấu hiểu.';
    }
};

const generateCompatibilityStrengths = (relation: Compatibility['elementRelation']): string[] => {
    if (relation === 'mutual-generation') {
        return ['Tương sinh, hỗ trợ lẫn nhau', 'Bổ sung điểm mạnh cho nhau'];
    }
    return ['Có thể học hỏi từ nhau', 'Cùng nhau phát triển'];
};

const generateCompatibilityChallenges = (relation: Compatibility['elementRelation']): string[] => {
    if (relation === 'mutual-destruction') {
        return ['Tương khắc, dễ xung đột', 'Cần kiên nhẫn và nhường nhịn'];
    }
    return ['Cần thời gian để hiểu nhau', 'Đôi khi có quan điểm khác biệt'];
};

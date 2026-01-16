import { useState, useEffect, useCallback, useRef } from 'react';
import lunisolar from 'lunisolar';
import { ConversionMode, ConversionResult, LichAmDuong, NguHanh } from '../types/converterTypes';
import { CAN, CHI, ZODIAC_HOURS_MAP, NAP_AM_MAP, ZODIAC_DAYS_MAP, RELATIONS, HOUR_NAMES } from '../constants/converterConstants';
// SỬA LỖI: Thêm từ khóa 'type' vào trước LunarMonthData
import { generateLunarYearData, type LunarMonthData } from '../utils/lunarDataGenerator';

// Helper: Julian Day Calculation (Meeus/Astronomical standard)
const getJulianDay = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

// Helper: Map Nap Am to Element
const getNguHanhElement = (napAm: string): string => {
    if (napAm.includes('Kim')) return 'Kim';
    if (napAm.includes('Mộc')) return 'Mộc';
    if (napAm.includes('Thủy')) return 'Thủy';
    if (napAm.includes('Hỏa')) return 'Hỏa';
    if (napAm.includes('Thổ')) return 'Thổ';
    return 'Bình';
};

const getConflictingElement = (element: string): string => {
    switch (element) {
        case 'Kim': return 'Hỏa'; // Fire melts Metal
        case 'Mộc': return 'Kim'; // Metal chops Wood
        case 'Thủy': return 'Thổ'; // Earth absorbs Water
        case 'Hỏa': return 'Thủy'; // Water extinguishes Fire
        case 'Thổ': return 'Mộc'; // Wood depletes Earth
        default: return '';
    }
};

// Simplified Logic for Solar Terms (approximate dates for Demo)
// In a real app, use a dedicated library or the lunisolar plugin if available
const SOLAR_TERMS = [
    { name: "Tiểu hàn", start: "05/01", end: "20/01" },
    { name: "Đại hàn", start: "20/01", end: "03/02" },
    { name: "Lập xuân", start: "04/02", end: "18/02" },
    { name: "Vũ thủy", start: "19/02", end: "05/03" },
    { name: "Kinh trập", start: "06/03", end: "20/03" },
    { name: "Xuân phân", start: "21/03", end: "04/04" },
    { name: "Thanh minh", start: "05/04", end: "19/04" },
    { name: "Cốc vũ", start: "20/04", end: "05/05" },
    { name: "Lập hạ", start: "06/05", end: "20/05" },
    { name: "Tiểu mãn", start: "21/05", end: "05/06" },
    { name: "Mang chủng", start: "06/06", end: "20/06" },
    { name: "Hạ chí", start: "21/06", end: "06/07" },
    { name: "Tiểu thử", start: "07/07", end: "22/07" },
    { name: "Đại thử", start: "23/07", end: "07/08" },
    { name: "Lập thu", start: "08/08", end: "22/08" },
    { name: "Xử thử", start: "23/08", end: "07/09" },
    { name: "Bạch lộ", start: "08/09", end: "22/09" },
    { name: "Thu phân", start: "23/09", end: "07/10" },
    { name: "Hàn lộ", start: "08/10", end: "23/10" },
    { name: "Sương giáng", start: "24/10", end: "07/11" },
    { name: "Lập đông", start: "08/11", end: "21/11" },
    { name: "Tiểu tuyết", start: "22/11", end: "06/12" },
    { name: "Đại tuyết", start: "07/12", end: "21/12" },
    { name: "Đông chí", start: "22/12", end: "05/01" }
];

const getSolarTerm = (date: Date, year: number) => {
    // This is a simplified lookup based on Day/Month.
    // Real calculation requires astronomical longitude.
    // Format DD/MM
    const currentDayMonth = date.getDate();
    const currentMonth = date.getMonth() + 1;

    // Find term roughly
    // Logic: Simple linear check is hard because ranges wrap years.
    // Just returning a close match for display.
    let foundTerm = SOLAR_TERMS[0];
    for (const term of SOLAR_TERMS) {
        const [d, m] = term.start.split('/').map(Number);
        if (currentMonth === m && currentDayMonth >= d) {
            foundTerm = term;
        } else if (currentMonth === m && currentDayMonth < d) {
            // It's the previous term, usually found in previous iteration or previous month
            // Simple fallback: keep the one found in previous loop iteration
        } else if (currentMonth > m) {
            foundTerm = term;
        }
    }

    return {
        name: foundTerm.name,
        range: `${foundTerm.start}/${year} — ${foundTerm.end}/${year}`
    };
};

// SỬA LỖI: Thêm 'type' vào export
export type { LunarMonthData };

export const useConverterLogic = () => {
    const [mode, setMode] = useState<ConversionMode>('SOLAR_TO_LUNAR');

    // --- SOLAR INPUTS ---
    const [solarDay, setSolarDay] = useState<string>(new Date().getDate().toString());
    const [solarMonth, setSolarMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [solarYear, setSolarYear] = useState<string>(new Date().getFullYear().toString());

    // --- LUNAR INPUTS ---
    const [lunarYearStr, setLunarYearStr] = useState<string>(new Date().getFullYear().toString());
    const [selectedLunarMonthKey, setSelectedLunarMonthKey] = useState<string>('1-false');
    const [selectedLunarDay, setSelectedLunarDay] = useState<number>(1);

    // Dynamic Data for Dropdown
    const [lunarMonthOptions, setLunarMonthOptions] = useState<LunarMonthData[]>([]);
    const [maxLunarDays, setMaxLunarDays] = useState<number>(30);

    const [result, setResult] = useState<ConversionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isFirstRun = useRef(true);

    // 1. GENERATE LUNAR MONTHS (Data Model Construction)
    useEffect(() => {
        const y = parseInt(lunarYearStr);
        if (isNaN(y) || y < 1900 || y > 2100) {
            setLunarMonthOptions([]);
            return;
        }

        const yearData = generateLunarYearData(y);
        setLunarMonthOptions(yearData.months);

        const currentMonthExists = yearData.months.some(m => m.value === selectedLunarMonthKey);
        if (!currentMonthExists && yearData.months.length > 0) {
            const [oldM] = selectedLunarMonthKey.split('-');
            const sameMonth = yearData.months.find(m => m.month === parseInt(oldM) && !m.isLeap);
            if (sameMonth) {
                setSelectedLunarMonthKey(sameMonth.value);
            } else {
                setSelectedLunarMonthKey(yearData.months[0].value);
            }
        }
    }, [lunarYearStr]);

    // 2. UPDATE MAX DAYS CONSTRAINT
    useEffect(() => {
        const currentMonthData = lunarMonthOptions.find(m => m.value === selectedLunarMonthKey);

        if (currentMonthData) {
            const max = currentMonthData.days;
            setMaxLunarDays(max);
            if (selectedLunarDay > max) {
                setSelectedLunarDay(max);
            }
        }
    }, [selectedLunarMonthKey, lunarMonthOptions]);

    // --- CORE CALCULATION LOGIC ---
    const calculateDetailedResult = useCallback((lunarYear: number, lunarMonth: number, date: Date, isLeap: boolean) => {
        // 1. Can Chi Calculations
        let yCanIdx = (lunarYear - 4) % 10; if (yCanIdx < 0) yCanIdx += 10;
        let yChiIdx = (lunarYear - 4) % 12; if (yChiIdx < 0) yChiIdx += 12;
        const canChiYear = `${CAN[yCanIdx]} ${CHI[yChiIdx]}`;

        const baseMonthCan = ((yCanIdx % 5) * 2 + 2) % 10;
        const mCanIdx = (baseMonthCan + (lunarMonth - 1)) % 10;
        const mChiIdx = (lunarMonth + 1) % 12;
        const canChiMonth = `${CAN[mCanIdx]} ${CHI[mChiIdx]}`;

        const jd = getJulianDay(date);
        const dCanIdx = (jd + 9) % 10;
        const dChiIdx = (jd + 1) % 12;
        const canChiDay = `${CAN[dCanIdx]} ${CHI[dChiIdx]}`;

        // 2. Destiny & Feng Shui Logic
        const napAm = NAP_AM_MAP[canChiDay] || "Đang cập nhật";
        const element = getNguHanhElement(napAm);
        const goodDays = ZODIAC_DAYS_MAP[lunarMonth] || [];
        const isZodiacDay = goodDays.includes(dChiIdx);

        // 3. Relationships (Hop/Xung/etc) based on Day Chi (dChiIdx)
        const lucHop = CHI[RELATIONS.LUC_HOP[dChiIdx]];
        const xung = CHI[RELATIONS.TU_HANH_XUNG[dChiIdx]];
        const hai = CHI[RELATIONS.TUONG_HAI[dChiIdx]];
        const pha = CHI[RELATIONS.TUONG_PHA[dChiIdx]];

        // Tam Hop is array of 2 others
        const tamHopIndices = RELATIONS.TAM_HOP.find(group => group.includes(dChiIdx)) || [];
        // const tamHop = tamHopIndices.length > 0 
        //       ? tamHopIndices.filter(i => i !== dChiIdx).map(i => CHI[i]) 
        //       : []; // Fallback, though typically always found in groups if defined properly, logic adjustment needed:
        // Proper Tam Hop logic:
        const getTamHop = (idx: number) => {
            // Than-Ty-Thin (8,0,4)
            // Ty-Dau-Suu (5,9,1)
            // Dan-Ngo-Tuat (2,6,10)
            // Hoi-Mao-Mui (11,3,7)
            if ([8, 0, 4].includes(idx)) return [8, 0, 4].filter(i => i !== idx).map(i => CHI[i]);
            if ([5, 9, 1].includes(idx)) return [5, 9, 1].filter(i => i !== idx).map(i => CHI[i]);
            if ([2, 6, 10].includes(idx)) return [2, 6, 10].filter(i => i !== idx).map(i => CHI[i]);
            if ([11, 3, 7].includes(idx)) return [11, 3, 7].filter(i => i !== idx).map(i => CHI[i]);
            return [];
        };
        const tamHopRes = getTamHop(dChiIdx);

        const tamSat = RELATIONS.TAM_SAT[dChiIdx].map(i => CHI[i]);

        // 4. Conflicting Ages (Nap Am Ky Tuoi)
        const conflictElement = getConflictingElement(element);
        // Find ages (Can Chi) that have this conflicting element
        // Limitation: Real list is huge. We will list a few examples based on Day Chi's Xung + Conflict Element
        // Logic: Find Chi that is Xung (dChiIdx + 6) and matching Conflict Element
        const conflictChi = (dChiIdx + 6) % 12;
        const conflictAges: string[] = [];
        // Iterate all 10 Cans for the Conflict Chi
        for (let c = 0; c < 10; c++) {
            const cc = `${CAN[c]} ${CHI[conflictChi]}`;
            if (getNguHanhElement(NAP_AM_MAP[cc] || '') === conflictElement) {
                conflictAges.push(cc);
            }
        }
        // Fallback if none specific found on direct Xung (rare), show generic element
        if (conflictAges.length === 0) conflictAges.push(`Người mệnh ${conflictElement}`);


        // 5. Construct Objects
        const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const lichAmDuong: LichAmDuong = {
            duong_lich: {
                weekday_vi: daysOfWeek[date.getDay()],
                date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
            },
            am_lich: {
                date: `${lunarYear}/${lunarMonth.toString().padStart(2, '0')}/${lunarYear}`, // Mock format, UI uses separate fields
                can_chi_day: canChiDay,
                can_chi_month: canChiMonth,
                can_chi_year: canChiYear,
                leap_month: isLeap
            },
            tiet_khi: getSolarTerm(date, date.getFullYear())
        };

        const nguHanh: NguHanh = {
            nien_menh: NAP_AM_MAP[canChiYear] || "Chưa cập nhật",
            ngay_menh: {
                label: canChiDay,
                element: `${element} (${napAm})`,
                fortune: isZodiacDay ? "Ngày Cát" : "Ngày Hung"
            },
            nap_am_ky_tuoi: conflictAges,
            khac_hanh: {
                day_element: element,
                khac: conflictElement,
                note: `${element} khắc ${conflictElement} (Ngũ hành nạp âm)`
            },
            hop_xung: {
                luc_hop: [lucHop],
                tam_hop: tamHopRes,
                xung: [xung],
                hinh: [], // Simple logic omit for brevity
                hai: [hai],
                pha: [pha],
                tuyet: [], // Simple logic omit
                tam_sat_ky_menh: tamSat
            }
        };

        const conflictGroup = [xung, hai, pha].join(', '); // Legacy prop

        return {
            canChiYear, canChiMonth, canChiDay, dayChiIdx: dChiIdx,
            napAm, isZodiacDay, conflictGroup,
            lichAmDuong, nguHanh
        };
    }, []);

    const handleConvert = useCallback(() => {
        setError(null);

        try {
            if (mode === 'SOLAR_TO_LUNAR') {
                const sDay = parseInt(solarDay);
                const sMonth = parseInt(solarMonth);
                const sYear = parseInt(solarYear);

                if (isNaN(sDay) || isNaN(sMonth) || isNaN(sYear)) return;
                if (sDay < 1 || sDay > 31 || sMonth < 1 || sMonth > 12) return;

                const date = new Date(sYear, sMonth - 1, sDay);
                if (date.getFullYear() !== sYear || date.getMonth() !== sMonth - 1 || date.getDate() !== sDay) {
                    setError('Ngày không tồn tại');
                    return;
                }

                const l = lunisolar(date);
                const isLeap = (l.lunar as any).isLeap;
                const details = calculateDetailedResult(l.lunar.year, l.lunar.month, date, isLeap);

                setResult({
                    date: date,
                    lunarDay: l.lunar.day,
                    lunarMonth: l.lunar.month,
                    lunarYear: l.lunar.year,
                    isLeap,
                    // Detailed
                    lichAmDuong: details.lichAmDuong,
                    nguHanh: details.nguHanh,
                    // Legacy
                    canChiDay: details.canChiDay,
                    canChiMonth: details.canChiMonth,
                    canChiYear: details.canChiYear,
                    luckyHours: ZODIAC_HOURS_MAP[details.dayChiIdx],
                    napAm: details.napAm,
                    isZodiacDay: details.isZodiacDay,
                    conflictGroup: details.conflictGroup
                });

            } else {
                // LUNAR_TO_SOLAR
                const y = parseInt(lunarYearStr);
                const currentMonthData = lunarMonthOptions.find(m => m.value === selectedLunarMonthKey);
                const d = selectedLunarDay;

                if (isNaN(y) || !currentMonthData) return;

                const dataYear = currentMonthData.solarStartDate.getFullYear();
                if (Math.abs(dataYear - y) > 1) {
                    return;
                }

                const foundDate = new Date(currentMonthData.solarStartDate);
                foundDate.setDate(foundDate.getDate() + (d - 1));

                if (foundDate) {
                    const details = calculateDetailedResult(y, currentMonthData.month, foundDate, currentMonthData.isLeap);
                    setResult({
                        date: foundDate,
                        lunarDay: d,
                        lunarMonth: currentMonthData.month,
                        lunarYear: y,
                        isLeap: currentMonthData.isLeap,
                        // Detailed
                        lichAmDuong: details.lichAmDuong,
                        nguHanh: details.nguHanh,
                        // Legacy
                        canChiDay: details.canChiDay,
                        canChiMonth: details.canChiMonth,
                        canChiYear: details.canChiYear,
                        luckyHours: ZODIAC_HOURS_MAP[details.dayChiIdx],
                        napAm: details.napAm,
                        isZodiacDay: details.isZodiacDay,
                        conflictGroup: details.conflictGroup
                    });
                } else {
                    setError("Không tìm thấy ngày dương lịch tương ứng.");
                }
            }
        } catch (e) {
            console.error(e);
            setError('Lỗi tính toán ngày.');
        }
    }, [mode, solarDay, solarMonth, solarYear, lunarYearStr, selectedLunarMonthKey, selectedLunarDay, lunarMonthOptions, calculateDetailedResult]);

    // Action: Reset to Today
    const resetToToday = useCallback(() => {
        const now = new Date();
        setSolarDay(now.getDate().toString());
        setSolarMonth((now.getMonth() + 1).toString());
        setSolarYear(now.getFullYear().toString());

        const l = lunisolar(now);
        setLunarYearStr(l.lunar.year.toString());
        setSelectedLunarDay(l.lunar.day);
        const isLeap = (l.lunar as any).isLeap;
        setSelectedLunarMonthKey(`${l.lunar.month}-${isLeap}`);

        setError(null);
    }, []);

    // AUTO CONVERT EFFECT
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
        }
        const timer = setTimeout(() => {
            handleConvert();
        }, 50);
        return () => clearTimeout(timer);
    }, [handleConvert]);

    return {
        state: {
            mode,
            solarDay, solarMonth, solarYear,
            lunarYearStr,
            selectedLunarMonthKey,
            selectedLunarDay,
            lunarMonthOptions,
            maxLunarDays,
            result, error
        },
        actions: {
            setMode,
            setSolarDay, setSolarMonth, setSolarYear,
            setLunarYearStr,
            setSelectedLunarMonthKey,
            setSelectedLunarDay,
            setResult, setError,
            handleConvert,
            resetToToday
        }
    };
};
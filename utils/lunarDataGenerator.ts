import lunisolar from 'lunisolar';

export interface LunarMonthData {
    month: number;
    days: number;
    isLeap: boolean;
    label: string;
    value: string; // Key unique: "month-isLeap"
    solarStartDate: Date; // QUAN TRỌNG: Lưu ngày dương lịch bắt đầu của tháng này
}

export interface LunarYearData {
    year: number;
    solarStart: string; 
    months: LunarMonthData[];
}

/**
 * Hàm sinh bảng tra cứu tháng âm lịch cho một năm cụ thể.
 */
export const generateLunarYearData = (year: number): LunarYearData => {
    const months: LunarMonthData[] = [];
    
    // 1. Tìm ngày Mùng 1 Tết Âm Lịch (1/1)
    // Thuật toán: Quét từ 15/1 đến 28/2 Dương lịch để tìm điểm sóc (New Moon) tương ứng 1/1 Âm
    let tetSolarDate: Date | null = null;
    
    // Khởi tạo vùng quét an toàn cho Tết (thường rơi vào cuối tháng 1 hoặc tháng 2 dương)
    for(let i = 0; i < 60; i++) {
        const d = new Date(year, 0, 20 + i - 30); 
        
        // Safety check for lunisolar library limits (typically 1900-2100)
        if (d.getFullYear() < 1900 || d.getFullYear() > 2100) continue;

        try {
            const l = lunisolar(d);
            if (l.lunar.year === year && l.lunar.month === 1 && l.lunar.day === 1) {
                tetSolarDate = d;
                break;
            }
        } catch (e) {
            continue;
        }
    }

    if (!tetSolarDate) tetSolarDate = new Date(year, 1, 10); // Fallback

    const solarStart = tetSolarDate.toISOString().split('T')[0];

    // 2. Quét các tháng trong năm
    let scanningDate = new Date(tetSolarDate);
    let loopCount = 0;
    
    // Một năm âm lịch tối đa 13 tháng (nếu nhuận)
    while (loopCount < 14) {
        // Bounds check
        if (scanningDate.getFullYear() < 1900 || scanningDate.getFullYear() > 2100) break;

        let l;
        try {
            l = lunisolar(scanningDate);
        } catch (e) {
            break;
        }

        const lYear = l.lunar.year;
        
        // Dừng nếu đã sang năm sau
        if (lYear > year) break;

        if (lYear === year) {
            const rawMonth = l.lunar.month;
            // Xử lý flag isLeap từ thư viện
            let isLeap = (l.lunar as any).isLeap;

            // Chuẩn hóa tháng (một số lib trả về >100 cho tháng nhuận)
            let normalizedMonth = rawMonth;
            if (rawMonth > 12) {
                normalizedMonth = rawMonth > 100 ? rawMonth - 100 : rawMonth;
                isLeap = true;
            }

            // Tính số ngày trong tháng bằng cách nhảy tới ngày 30
            // Nếu ngày 30 vẫn cùng tháng/nhuận -> tháng đủ (30 ngày), ngược lại tháng thiếu (29 ngày)
            const dateAtDay30 = new Date(scanningDate);
            dateAtDay30.setDate(scanningDate.getDate() + 29);
            
            // Bounds check for lookahead
            if (dateAtDay30.getFullYear() > 2100) break;

            let checkMonth = normalizedMonth;
            let checkLeap = isLeap;

            try {
                const lCheck30 = lunisolar(dateAtDay30);
                let rawCheckMonth = lCheck30.lunar.month;
                checkLeap = (lCheck30.lunar as any).isLeap;
                
                if (rawCheckMonth > 12) {
                    checkMonth = rawCheckMonth > 100 ? rawCheckMonth - 100 : rawCheckMonth;
                    checkLeap = true;
                } else {
                    checkMonth = rawCheckMonth;
                }
            } catch(e) {
                // Ignore error, default logic will likely result in 29 days or break
            }

            // Logic kiểm tra số ngày
            let daysInMonth = 29;
            if (checkMonth === normalizedMonth && checkLeap === isLeap) {
                daysInMonth = 30;
            }

            months.push({
                month: normalizedMonth,
                days: daysInMonth,
                isLeap: isLeap,
                label: isLeap ? `Tháng ${normalizedMonth} (Nhuận)` : `Tháng ${normalizedMonth}`,
                value: `${normalizedMonth}-${isLeap}`,
                solarStartDate: new Date(scanningDate) // Store copy of date
            });

            // Nhảy đến ngày đầu tháng sau (Sóc kế tiếp)
            scanningDate.setDate(scanningDate.getDate() + daysInMonth);
        } else {
            // Hiệu chỉnh nếu scanningDate bị lệch (rất hiếm)
            scanningDate.setDate(scanningDate.getDate() + 1);
        }
        loopCount++;
    }

    return {
        year,
        solarStart,
        months
    };
};
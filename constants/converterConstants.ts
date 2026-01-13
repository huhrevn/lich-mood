
export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const HOUR_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const HOUR_RANGES = ['23h-1h', '1h-3h', '3h-5h', '5h-7h', '7h-9h', '9h-11h', '11h-13h', '13h-15h', '15h-17h', '17h-19h', '19h-21h', '21h-23h'];

export const ZODIAC_HOURS_MAP: Record<number, number[]> = {
    0: [0, 1, 3, 6, 8, 9], 1: [2, 3, 5, 8, 10, 11], 
    2: [0, 1, 4, 5, 7, 10], 3: [0, 2, 3, 6, 7, 9], 
    4: [2, 4, 5, 8, 9, 11], 5: [1, 4, 6, 7, 10, 11], 
    6: [0, 1, 3, 6, 8, 9], 7: [2, 3, 5, 8, 10, 11], 
    8: [0, 1, 4, 5, 7, 10], 9: [0, 2, 3, 6, 7, 9], 
    10: [2, 4, 5, 8, 9, 11], 11: [1, 4, 6, 7, 10, 11],
};

export const ZODIAC_DAYS_MAP: Record<number, number[]> = {
    1: [0, 1, 5, 7], 7: [0, 1, 5, 7],
    2: [2, 3, 7, 9], 8: [2, 3, 7, 9],
    3: [4, 5, 9, 11], 9: [4, 5, 9, 11],
    4: [6, 7, 1, 9], 10: [6, 7, 1, 9],
    5: [8, 9, 1, 3], 11: [8, 9, 1, 3],
    6: [10, 11, 3, 5], 12: [10, 11, 3, 5]
};

// Relation Maps (Index of CHI: 0=Tý...11=Hợi)
export const RELATIONS = {
    LUC_HOP: [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2], // Tý-Sửu, Dần-Hợi...
    TU_HANH_XUNG: [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5], // Đối xung: Tý-Ngọ (0-6)...
    TUONG_HAI: [7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8], // Tý-Mùi, Sửu-Ngọ...
    TUONG_PHA: [9, 8, 11, 10, 1, 0, 3, 2, 5, 4, 7, 6], // Tý-Dậu, Sửu-Thìn... (Simplified common mapping)
    TAM_HOP: [
        [4, 8], [5, 9], [6, 10], [7, 11], // Tý (Thân, Thìn)...
        [0, 8], [1, 9], [2, 10], [3, 11],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ],
    // Tam sát: Dựa theo Tam hợp cục của NĂM hoặc NGÀY.
    // Thân-Tí-Thìn (Thủy cục) -> sát Tỵ-Ngọ-Mùi.
    // Dần-Ngọ-Tuất (Hỏa cục) -> sát Hợi-Tý-Sửu.
    // Hợi-Mão-Mùi (Mộc cục) -> sát Thân-Dậu-Tuất.
    // Tỵ-Dậu-Sửu (Kim cục) -> sát Dần-Mão-Thìn.
    TAM_SAT: [
        [5, 6, 7], // Tý (thuộc Thân-Tý-Thìn) -> Sát Tỵ Ngọ Mùi
        [2, 3, 4], // Sửu (Tỵ-Dậu-Sửu) -> Sát Dần Mão Thìn
        [11, 0, 1], // Dần (Dần-Ngọ-Tuất) -> Sát Hợi Tý Sửu
        [8, 9, 10], // Mão (Hợi-Mão-Mùi) -> Sát Thân Dậu Tuất
        [5, 6, 7], // Thìn
        [2, 3, 4], // Tỵ
        [11, 0, 1], // Ngọ
        [8, 9, 10], // Mùi
        [5, 6, 7], // Thân
        [2, 3, 4], // Dậu
        [11, 0, 1], // Tuất
        [8, 9, 10] // Hợi
    ]
};

export const NAP_AM_MAP: Record<string, string> = {
    'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
    'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
    'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
    'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
    'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
    'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
    'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
    'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
    'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
    'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
    'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
    'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
    'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
    'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
    'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
    'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
    'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
    'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
    'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
    'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
    'Giáp Thìn': 'Phú Đăng Hỏa', 'Ất Tỵ': 'Phú Đăng Hỏa',
    'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
    'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
    'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
    'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
    'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
    'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
    'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
    'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
    'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy'
};

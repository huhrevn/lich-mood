import { Activity, ActivityCategory, DateRange } from '../types/goodDaysTypes';

// Danh sách các hoạt động
export const ACTIVITIES: Activity[] = [
    // MARRIAGE - Hôn nhân
    {
        id: 'wedding',
        name: 'Cưới hỏi',
        nameEn: 'Wedding',
        category: 'marriage',
        icon: 'favorite',
        description: 'Lễ cưới, đám cưới'
    },
    {
        id: 'engagement',
        name: 'Ăn hỏi',
        nameEn: 'Engagement',
        category: 'marriage',
        icon: 'cake',
        description: 'Lễ đính hôn, ăn hỏi'
    },

    // BUSINESS - Kinh doanh
    {
        id: 'opening',
        name: 'Khai trương',
        nameEn: 'Grand Opening',
        category: 'business',
        icon: 'store',
        description: 'Khai trương cửa hàng, văn phòng'
    },
    {
        id: 'groundbreaking',
        name: 'Khởi công',
        nameEn: 'Groundbreaking',
        category: 'business',
        icon: 'construction',
        description: 'Khởi công xây dựng'
    },
    {
        id: 'contract',
        name: 'Ký hợp đồng',
        nameEn: 'Sign Contract',
        category: 'business',
        icon: 'description',
        description: 'Ký kết hợp đồng quan trọng'
    },
    {
        id: 'investment',
        name: 'Đầu tư',
        nameEn: 'Investment',
        category: 'business',
        icon: 'trending_up',
        description: 'Đầu tư tài chính, kinh doanh'
    },

    // HOME - Nhà cửa
    {
        id: 'moving',
        name: 'Nhập trạch',
        nameEn: 'Moving In',
        category: 'home',
        icon: 'home',
        description: 'Chuyển vào nhà mới'
    },
    {
        id: 'renovation',
        name: 'Sửa nhà',
        nameEn: 'Renovation',
        category: 'home',
        icon: 'handyman',
        description: 'Tu sửa, cải tạo nhà cửa'
    },
    {
        id: 'buying_property',
        name: 'Mua nhà đất',
        nameEn: 'Buy Property',
        category: 'home',
        icon: 'real_estate_agent',
        description: 'Mua bất động sản'
    },

    // TRAVEL - Di chuyển
    {
        id: 'travel',
        name: 'Xuất hành',
        nameEn: 'Travel',
        category: 'travel',
        icon: 'flight_takeoff',
        description: 'Đi xa, du lịch'
    },
    {
        id: 'relocation',
        name: 'Di chuyển',
        nameEn: 'Relocation',
        category: 'travel',
        icon: 'moving',
        description: 'Chuyển chỗ ở, di cư'
    },

    // SPIRITUAL - Tâm linh
    {
        id: 'funeral',
        name: 'An táng',
        nameEn: 'Funeral',
        category: 'spiritual',
        icon: 'church',
        description: 'Lễ an táng, chôn cất'
    },
    {
        id: 'memorial',
        name: 'Cúng giỗ',
        nameEn: 'Memorial',
        category: 'spiritual',
        icon: 'auto_awesome',
        description: 'Lễ cúng giỗ, tưởng niệm'
    },
    {
        id: 'worship',
        name: 'Cúng bái',
        nameEn: 'Worship',
        category: 'spiritual',
        icon: 'self_improvement',
        description: 'Lễ cúng, thờ cúng'
    },

    // OTHER - Khác
    {
        id: 'haircut',
        name: 'Cắt tóc',
        nameEn: 'Haircut',
        category: 'other',
        icon: 'content_cut',
        description: 'Cắt tóc, làm đầu'
    },
    {
        id: 'shopping',
        name: 'Mua sắm lớn',
        nameEn: 'Major Shopping',
        category: 'other',
        icon: 'shopping_cart',
        description: 'Mua sắm đồ đạc lớn'
    },
    {
        id: 'medical',
        name: 'Khám bệnh',
        nameEn: 'Medical',
        category: 'other',
        icon: 'medical_services',
        description: 'Đi khám bệnh, phẫu thuật'
    },
    {
        id: 'study',
        name: 'Khai giảng',
        nameEn: 'Start School',
        category: 'other',
        icon: 'school',
        description: 'Bắt đầu học, khai giảng'
    },
    {
        id: 'planting',
        name: 'Trồng trọt',
        nameEn: 'Planting',
        category: 'other',
        icon: 'yard',
        description: 'Gieo trồng, làm vườn'
    },
    {
        id: 'fishing',
        name: 'Đánh cá',
        nameEn: 'Fishing',
        category: 'other',
        icon: 'phishing',
        description: 'Đi đánh cá, thu hoạch'
    }
];

// 12 Kiến Trừ (12 Officers)
export const TWELVE_OFFICERS = [
    { name: 'Kiến', type: 'neutral', description: 'Ngày Kiến - Trung bình' },
    { name: 'Trừ', type: 'bad', description: 'Ngày Trừ - Xấu' },
    { name: 'Mãn', type: 'good', description: 'Ngày Mãn - Tốt' },
    { name: 'Bình', type: 'good', description: 'Ngày Bình - Tốt' },
    { name: 'Định', type: 'good', description: 'Ngày Định - Tốt' },
    { name: 'Chấp', type: 'neutral', description: 'Ngày Chấp - Trung bình' },
    { name: 'Phá', type: 'bad', description: 'Ngày Phá - Rất xấu' },
    { name: 'Nguy', type: 'bad', description: 'Ngày Nguy - Xấu' },
    { name: 'Thành', type: 'good', description: 'Ngày Thành - Rất tốt' },
    { name: 'Thu', type: 'good', description: 'Ngày Thu - Tốt' },
    { name: 'Khai', type: 'good', description: 'Ngày Khai - Tốt' },
    { name: 'Bế', type: 'bad', description: 'Ngày Bế - Xấu' }
];

// 12 Hoàng đạo / Hắc đạo
export const ZODIAC_STARS = [
    { name: 'Thanh Long', isLucky: true, description: 'Hoàng đạo - Rất tốt' },
    { name: 'Minh Đường', isLucky: true, description: 'Hoàng đạo - Rất tốt' },
    { name: 'Kim Quỹ', isLucky: true, description: 'Hoàng đạo - Tốt' },
    { name: 'Bảo Quang', isLucky: true, description: 'Hoàng đạo - Tốt' },
    { name: 'Ngọc Đường', isLucky: true, description: 'Hoàng đạo - Tốt' },
    { name: 'Tư Mệnh', isLucky: true, description: 'Hoàng đạo - Tốt' },
    { name: 'Thiên Hình', isLucky: false, description: 'Hắc đạo - Xấu' },
    { name: 'Chu Tước', isLucky: false, description: 'Hắc đạo - Xấu' },
    { name: 'Bạch Hổ', isLucky: false, description: 'Hắc đạo - Rất xấu' },
    { name: 'Thiên Lao', isLucky: false, description: 'Hắc đạo - Xấu' },
    { name: 'Huyền Vũ', isLucky: false, description: 'Hắc đạo - Xấu' },
    { name: 'Câu Trần', isLucky: false, description: 'Hắc đạo - Xấu' }
];

// Sao tốt
export const LUCKY_STARS = [
    'Thiên Đức',
    'Nguyệt Đức',
    'Thiên Ân',
    'Tam Hợp',
    'Lục Hợp',
    'Thiên Hỷ',
    'Thiên Quý',
    'Phúc Đức',
    'Thiên Thành',
    'Nguyệt Ân'
];

// Sao xấu
export const UNLUCKY_STARS = [
    'Thiên Cẩu',
    'Nguyệt Phá',
    'Thiên Hỏa',
    'Địa Hỏa',
    'Ngũ Quỷ',
    'Tử Khí',
    'Thiên Lại',
    'Đại Hao',
    'Tiểu Hao',
    'Nguyệt Sát'
];

// Ma trận điểm số Can Chi cho từng hoạt động (simplified)
// Key: activityId, Value: base score modifiers
export const ACTIVITY_BASE_SCORES: Record<string, number> = {
    wedding: 70,
    engagement: 70,
    opening: 75,
    groundbreaking: 75,
    contract: 65,
    investment: 60,
    moving: 70,
    renovation: 65,
    buying_property: 70,
    travel: 60,
    relocation: 65,
    funeral: 50,
    memorial: 60,
    worship: 65,
    haircut: 55,
    shopping: 60,
    medical: 50,
    study: 70,
    planting: 65,
    fishing: 60
};

// Quick date range presets
export const DATE_RANGE_PRESETS: DateRange[] = [
    {
        start: new Date(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        label: '7 ngày tới'
    },
    {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        label: '30 ngày tới'
    },
    {
        start: new Date(),
        end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        label: '3 tháng tới'
    },
    {
        start: new Date(),
        end: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        label: '6 tháng tới'
    }
];

// Activity categories for grouping
export const ACTIVITY_CATEGORIES: Record<ActivityCategory, { name: string; nameEn: string; icon: string }> = {
    marriage: { name: 'Hôn nhân', nameEn: 'Marriage', icon: 'favorite' },
    business: { name: 'Kinh doanh', nameEn: 'Business', icon: 'business_center' },
    home: { name: 'Nhà cửa', nameEn: 'Home', icon: 'home' },
    travel: { name: 'Di chuyển', nameEn: 'Travel', icon: 'flight' },
    spiritual: { name: 'Tâm linh', nameEn: 'Spiritual', icon: 'self_improvement' },
    other: { name: 'Khác', nameEn: 'Other', icon: 'more_horiz' }
};

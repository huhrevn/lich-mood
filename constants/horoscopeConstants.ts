import { PalaceName, EarthlyBranch, FiveElements, Star } from '../types/horoscopeTypes';

// 12 Earthly Branches (Địa Chi)
export const EARTHLY_BRANCHES: { id: EarthlyBranch; name: string; hour: string; time: string }[] = [
    { id: 'ty', name: 'Tý', hour: '23:00-01:00', time: 'Nửa đêm' },
    { id: 'suu', name: 'Sửu', hour: '01:00-03:00', time: 'Rạng sáng' },
    { id: 'dan', name: 'Dần', hour: '03:00-05:00', time: 'Sáng sớm' },
    { id: 'mao', name: 'Mão', hour: '05:00-07:00', time: 'Bình minh' },
    { id: 'thin', name: 'Thìn', hour: '07:00-09:00', time: 'Buổi sáng' },
    { id: 'ti', name: 'Tỵ', hour: '09:00-11:00', time: 'Trưa' },
    { id: 'ngo', name: 'Ngọ', hour: '11:00-13:00', time: 'Giữa trưa' },
    { id: 'mui', name: 'Mùi', hour: '13:00-15:00', time: 'Chiều' },
    { id: 'than', name: 'Thân', hour: '15:00-17:00', time: 'Xế chiều' },
    { id: 'dau', name: 'Dậu', hour: '17:00-19:00', time: 'Hoàng hôn' },
    { id: 'tuat', name: 'Tuất', hour: '19:00-21:00', time: 'Tối' },
    { id: 'hoi', name: 'Hợi', hour: '21:00-23:00', time: 'Đêm' }
];

// 12 Palaces (12 Cung)
export const PALACES: { id: PalaceName; name: string; meaning: string; description: string }[] = [
    {
        id: 'menh',
        name: 'Mệnh',
        meaning: 'Cung Mệnh',
        description: 'Thể hiện bản chất, tính cách, vận mệnh tổng quát của con người'
    },
    {
        id: 'phu-mau',
        name: 'Phụ Mẫu',
        meaning: 'Cung Phụ Mẫu',
        description: 'Quan hệ với cha mẹ, ông bà, người lớn tuổi'
    },
    {
        id: 'phuc-duc',
        name: 'Phúc Đức',
        meaning: 'Cung Phúc Đức',
        description: 'Phúc lộc, sức khỏe tinh thần, sở thích, hưởng thụ'
    },
    {
        id: 'dien-trach',
        name: 'Điền Trạch',
        meaning: 'Cung Điền Trạch',
        description: 'Nhà cửa, bất động sản, tài sản cố định'
    },
    {
        id: 'quan-loc',
        name: 'Quan Lộc',
        meaning: 'Cung Quan Lộc',
        description: 'Sự nghiệp, công danh, địa vị xã hội'
    },
    {
        id: 'no-boc',
        name: 'Nô Bộc',
        meaning: 'Cung Nô Bộc',
        description: 'Bạn bè, đồng nghiệp, cấp dưới, người giúp đỡ'
    },
    {
        id: 'thien-di',
        name: 'Thiên Di',
        meaning: 'Cung Thiên Di',
        description: 'Di chuyển, du lịch, thay đổi môi trường'
    },
    {
        id: 'tat-ach',
        name: 'Tật Ách',
        meaning: 'Cung Tật Ách',
        description: 'Sức khỏe thể chất, bệnh tật, tai nạn'
    },
    {
        id: 'tai-bach',
        name: 'Tài Bạch',
        meaning: 'Cung Tài Bạch',
        description: 'Tài chính, tiền bạc, của cải'
    },
    {
        id: 'tu-tu',
        name: 'Tử Tự',
        meaning: 'Cung Tử Tự',
        description: 'Con cái, học trò, người kế thừa'
    },
    {
        id: 'phu-the',
        name: 'Phu Thê',
        meaning: 'Cung Phu Thê',
        description: 'Hôn nhân, vợ chồng, tình cảm'
    },
    {
        id: 'huynh-de',
        name: 'Huynh Đệ',
        meaning: 'Cung Huynh Đệ',
        description: 'Anh em, họ hàng, người thân'
    }
];

// 14 Major Stars (14 Chính Tinh)
export const MAJOR_STARS: Star[] = [
    {
        id: 'tu-vi',
        name: 'Tử Vi',
        type: 'major',
        element: 'tho',
        isBenefic: true,
        brightness: 5,
        description: 'Đế tinh, chủ về quyền lực, địa vị cao quý'
    },
    {
        id: 'thien-co',
        name: 'Thiên Cơ',
        type: 'major',
        element: 'moc',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về trí tuệ, mưu lược, linh hoạt'
    },
    {
        id: 'thai-duong',
        name: 'Thái Dương',
        type: 'major',
        element: 'hoa',
        isBenefic: true,
        brightness: 5,
        description: 'Chủ về danh tiếng, quang minh, nam tính'
    },
    {
        id: 'vu-khuc',
        name: 'Vũ Khúc',
        type: 'major',
        element: 'kim',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về tài chính, quyết đoán, dũng cảm'
    },
    {
        id: 'thien-dong',
        name: 'Thiên Đồng',
        type: 'major',
        element: 'thuy',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về phúc đức, hưởng thụ, an nhàn'
    },
    {
        id: 'liem-trinh',
        name: 'Liêm Trinh',
        type: 'major',
        element: 'hoa',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về nghệ thuật, tình cảm, chính trực'
    },
    {
        id: 'thien-phu',
        name: 'Thiên Phủ',
        type: 'major',
        element: 'tho',
        isBenefic: true,
        brightness: 5,
        description: 'Chủ về tài lộc, bảo thủ, ổn định'
    },
    {
        id: 'thai-am',
        name: 'Thái Âm',
        type: 'major',
        element: 'thuy',
        isBenefic: true,
        brightness: 5,
        description: 'Chủ về nữ tính, tinh tế, nội tâm'
    },
    {
        id: 'tham-lang',
        name: 'Tham Lang',
        type: 'major',
        element: 'thuy',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về dục vọng, giao tế, đa tài'
    },
    {
        id: 'cu-mon',
        name: 'Cự Môn',
        type: 'major',
        element: 'thuy',
        isBenefic: false,
        brightness: 3,
        description: 'Chủ về tranh chấp, khẩu thiệt, cô đơn'
    },
    {
        id: 'thien-tuong',
        name: 'Thiên Tướng',
        type: 'major',
        element: 'thuy',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về phụ tá, hỗ trợ, ấn tín'
    },
    {
        id: 'thien-luong',
        name: 'Thiên Lương',
        type: 'major',
        element: 'tho',
        isBenefic: true,
        brightness: 4,
        description: 'Chủ về y dược, giải ách, từ bi'
    },
    {
        id: 'that-sat',
        name: 'Thất Sát',
        type: 'major',
        element: 'kim',
        isBenefic: false,
        brightness: 3,
        description: 'Chủ về sát khí, dũng mãnh, cô độc'
    },
    {
        id: 'pha-quan',
        name: 'Phá Quân',
        type: 'major',
        element: 'thuy',
        isBenefic: false,
        brightness: 3,
        description: 'Chủ về phá hoại, thay đổi, cải cách'
    }
];

// Minor Stars (Phụ Tinh - simplified list)
export const MINOR_STARS: Star[] = [
    {
        id: 'van-xuong',
        name: 'Văn Xương',
        type: 'minor',
        isBenefic: true,
        brightness: 3,
        description: 'Chủ về văn chương, học vấn'
    },
    {
        id: 'van-khuc',
        name: 'Văn Khúc',
        type: 'minor',
        isBenefic: true,
        brightness: 3,
        description: 'Chủ về nghệ thuật, tài năng'
    },
    {
        id: 'toa-phu',
        name: 'Tọa Phủ',
        type: 'minor',
        isBenefic: true,
        brightness: 2,
        description: 'Chủ về quyền lực, hỗ trợ'
    },
    {
        id: 'huu-bat',
        name: 'Hữu Bật',
        type: 'minor',
        isBenefic: true,
        brightness: 2,
        description: 'Chủ về giúp đỡ, quý nhân'
    }
];

// Malefic Stars (Sát Tinh - simplified)
export const MALEFIC_STARS: Star[] = [
    {
        id: 'dia-khong',
        name: 'Địa Không',
        type: 'malefic',
        isBenefic: false,
        brightness: 2,
        description: 'Chủ về thất thoát, hao tán'
    },
    {
        id: 'dia-kiep',
        name: 'Địa Kiếp',
        type: 'malefic',
        isBenefic: false,
        brightness: 2,
        description: 'Chủ về kiếp nạn, trở ngại'
    },
    {
        id: 'hoa-ky',
        name: 'Hỏa Tinh',
        type: 'malefic',
        isBenefic: false,
        brightness: 2,
        description: 'Chủ về nóng nảy, tai họa'
    },
    {
        id: 'linh-tinh',
        name: 'Linh Tinh',
        type: 'malefic',
        isBenefic: false,
        brightness: 2,
        description: 'Chủ về tranh chấp, bất hòa'
    }
];

// Five Elements (Ngũ Hành)
export const FIVE_ELEMENTS_INFO: Record<FiveElements, { name: string; color: string; characteristics: string }> = {
    kim: {
        name: 'Kim',
        color: '#FFD700',
        characteristics: 'Cứng rắn, quyết đoán, có nguyên tắc'
    },
    moc: {
        name: 'Mộc',
        color: '#22C55E',
        characteristics: 'Nhân từ, phát triển, sáng tạo'
    },
    thuy: {
        name: 'Thủy',
        color: '#3B82F6',
        characteristics: 'Linh hoạt, thông minh, thích nghi'
    },
    hoa: {
        name: 'Hỏa',
        color: '#EF4444',
        characteristics: 'Nhiệt huyết, năng động, lạc quan'
    },
    tho: {
        name: 'Thổ',
        color: '#A16207',
        characteristics: 'Trung thực, bền bỉ, đáng tin cậy'
    }
};

// Destiny Calculation Table (Cục số)
// Based on year stem and birth month
export const DESTINY_TABLE: Record<number, FiveElements> = {
    2: 'thuy', 3: 'thuy',
    4: 'kim', 5: 'kim',
    6: 'tho', 7: 'tho',
    8: 'moc', 9: 'moc',
    10: 'hoa', 11: 'hoa'
};

// Palace order (clockwise from Tý)
export const PALACE_ORDER: PalaceName[] = [
    'menh', 'phu-mau', 'phuc-duc', 'dien-trach',
    'quan-loc', 'no-boc', 'thien-di', 'tat-ach',
    'tai-bach', 'tu-tu', 'phu-the', 'huynh-de'
];

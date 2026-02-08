const { calculateStreamSpeed } = require('./index');

test('TC1: Tính toán tốc độ stream chính xác', () => {
    expect(calculateStreamSpeed(5000, 1080)).toBe("4.63");
});

test('TC2: Trả về 0 nếu thông số không hợp lệ', () => {
    expect(calculateStreamSpeed(0, 1080)).toBe(0);
});
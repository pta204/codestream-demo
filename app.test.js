const { calculateStreamSpeed } = require('./index');

describe('calculateStreamSpeed function', () => {
    test('TC1: Tính toán tốc độ stream chính xác', () => {
        // 5000 / 1080 = 4.629629...
        // .toFixed(2) = "4.63"
        expect(calculateStreamSpeed(5000, 1080)).toBe("4.63");
    });

    test('TC2: Trả về 0 nếu thông số không hợp lệ', () => {
        // Test với bitrate = 0
        expect(calculateStreamSpeed(0, 1080)).toBe(0);
        
        // Test với resolution = 0 (THIẾU trong test gốc)
        expect(calculateStreamSpeed(5000, 0)).toBe(0);
        
        // Test với số âm
        expect(calculateStreamSpeed(-100, 1080)).toBe(0);
        expect(calculateStreamSpeed(5000, -50)).toBe(0);
    });
    
    test('TC3: Kiểm tra kiểu dữ liệu trả về', () => {
        // .toFixed(2) trả về string
        const result = calculateStreamSpeed(5000, 1080);
        expect(typeof result).toBe('string');
        
        // Khi trả về 0 thì là number
        const zeroResult = calculateStreamSpeed(0, 1080);
        expect(typeof zeroResult).toBe('number');
        expect(zeroResult).toBe(0);
    });
    
    test('TC4: Tính toán với các giá trị khác', () => {
        expect(calculateStreamSpeed(2500, 720)).toBe("3.47"); // 2500/720=3.4722
        expect(calculateStreamSpeed(10000, 2160)).toBe("4.63"); // 10000/2160=4.6296
        expect(calculateStreamSpeed(8000, 1440)).toBe("5.56"); // 8000/1440=5.5556
    });
});
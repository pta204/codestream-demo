const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('CodeStream UI Automation Test', function () {
    this.timeout(30000); // Đợi tối đa 30s
    let driver;

    before(async function () {
        // Cấu hình chạy không cửa sổ (headless) để phù hợp với CI/CD
        let options = new chrome.Options();
        options.addArguments('--headless'); 
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Nên hiển thị tiêu đề Dashboard chính xác', async function () {
        // Thay bằng link Render của bạn hoặc localhost:3000
        await driver.get('http://localhost:3000'); 
        
        // Đợi tiêu đề xuất hiện
        await driver.wait(until.elementLocated(By.tagName('h1')), 10000);
        
        let title = await driver.findElement(By.tagName('h1')).getText();
        console.log('Tiêu đề tìm thấy:', title);
        
        // Kiểm tra xem tiêu đề có chứa chữ CODESTREAM không
        assert.ok(title.includes('CODESTREAM'));
    });

    it('Nên hiển thị bảng phân tích rủi ro', async function () {
        let riskSection = await driver.findElement(By.xpath("//h3[contains(.,'PHÂN TÍCH QUẢN TRỊ RỦI RO')]"));
        assert.ok(await riskSection.isDisplayed());
    });
});
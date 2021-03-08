const puppeteer = require('puppeteer');

/**
 * 获取无头浏览器
 */
const getBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 40,
    args: ['--no-sandbox'],
    dumpio: false,
  });
  return browser;
};

const getPage = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1200});
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
  );
  return page;
};

module.exports = {
  getBrowser,
  getPage,
};

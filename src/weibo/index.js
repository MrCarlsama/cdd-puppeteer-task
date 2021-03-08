const {USERNAME, PASSWORD} = require('./cdd.config');
const {loginHandle, checkCookieHandle, setCookieHandle} = require('./login');
const {start} = require('./creeper');

const log = require('../utils');
// 初始化
const init = async (browser, type = 'app') => {
  if (!USERNAME || !PASSWORD) {
    log.error('微博使用前请设置cdd.config.js中账号信息');
    log.error('in /src/weibo/cdd.config.js');
    return;
  }

  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1200});
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
  );

  log.info('打开微博');
  await page.goto('https://www.weibo.com', {
    waitUntil: ['load', 'domcontentloaded'],
    timeout: 0,
  });

  // 等待浏览器加载完毕
  // await page.waitForNavigation({
  //   timeout: 0,
  // });

  const isHasCookie = await checkCookieHandle();
  const isNoneHasLoginBtn = page.$("a[node-type='loginBtn']") === null;
  if (isHasCookie && isNoneHasLoginBtn) {
    // if (isHasCookie) {
    await setCookieHandle(page);
  } else {
    // 登录
    await loginHandle(page);
  }

  switch (type) {
    case 'http':
      return page;
    case 'app':
      //开始爬他妈的！
      await start(page);
      return;
  }

  // 开始爬他妈的！
  // await start(page);
};

module.exports = {
  init,
};

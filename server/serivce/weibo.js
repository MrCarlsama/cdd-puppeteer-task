const {getBrowser, getPage} = require('./index');
const {init} = require('../../src/weibo/index');
const {
  gotoTargetHomePage,
  gotoTargetPages,
  getContents,
} = require('../../src/weibo/creeper');
const {checkIsNeedLoginHandle} = require('../../src/weibo/login');
let browser = null;

const getUserAllContents = () => {};

/**
 * 获取目标用户指定页面的所有博文内容
 */
const getUserContentsByCurrentPages = async (url, {pageIndex}) => {
  if (!browser) {
    browser = await getBrowser();
  }

  const page = await getPage(browser);

  // 跳转网页
  await gotoTargetHomePage(page, {
    url,
  });
  const isCheckLoginResult = await checkIsNeedLoginHandle(page);

  // 非指定目标页时， 等待一些验证跳转
  if (!page.url().includes(url) && isCheckLoginResult) {
    await page.waitForNavigation({
      timeout: 0,
      waitUntil: ['load', 'domcontentloaded'],
    });
  }
  await gotoTargetPages(page, pageIndex);

  const contents = await getContents(page);

  // page.close();

  return contents;
};

const getUserContentsByLastDate = () => {};

const checkIsHasNewContents = () => {};

module.exports = {
  getUserAllContents,
  getUserContentsByCurrentPages,
  getUserContentsByLastDate,
  checkIsHasNewContents,
};

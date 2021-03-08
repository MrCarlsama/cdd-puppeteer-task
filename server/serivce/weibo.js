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

  console.log(page.url());
  let isCheckLoginResult;
  try {
    isCheckLoginResult = await checkIsNeedLoginHandle(page);
  } catch (err) {
    console.log(err);
    console.log('啊这，等待错误，重新加载');

    isCheckLoginResult = await checkIsNeedLoginHandle(page);
  }

  // 非指定目标页时， 等待一些验证跳转
  if (!page.url().includes(url) && isCheckLoginResult) {
    await page.waitForNavigation({
      timeout: 0,
      waitUntil: ['load', 'domcontentloaded'],
    });
  }
  await gotoTargetPages(page, pageIndex);

  const contents = await getContents(page);

  page.close();

  const newContents = handleFilterContents(contents);

  return newContents;
};

const getUserContentsByLastDate = () => {};

const checkIsHasNewContents = () => {};

/**
 * 构建新结构
 * @param {*} contents
 */
const handleFilterContents = (contents) => {
  const regByTags = /\#(.+?)\#/g; //  匹配井号内内标签

  const newContents = [];

  contents.forEach((content) => {
    const urlsConetentList = content.urls.map((url) => {
      const nicknames = content.content.match(regByTags); // 匹配并去除井号

      return {
        nicknames: nicknames
          ? nicknames.map((nickname) => nickname.slice(1, -1))
          : [],
        sourcePlatform: 1,
        sourceUrl: url,
        status: true,
        isAudit: false,
        issueDate: new Date(content.date),
      };
    });

    newContents.push(...urlsConetentList);
  });

  return newContents;
};

module.exports = {
  getUserAllContents,
  getUserContentsByCurrentPages,
  getUserContentsByLastDate,
  checkIsHasNewContents,
};

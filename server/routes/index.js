const {default: axios} = require('axios');
const Router = require('koa-router');
const router = Router();
const weiboSerivce = require('../serivce/weibo');

router.post('/task/weibo', async (ctx, next) => {
  const {url, pageIndex, isAll} = ctx.request.body;

  console.log(ctx.request.body);

  // 直接通过目标url获取指定页码
  const curretContents = await weiboSerivce.getUserContentsByCurrentPages(url, {
    pageIndex,
  });

  console.log(curretContents);

  axios({
    method: 'post',
    url: 'http://192.168.4.5:3000/api/cdd/createPhotos',
    data: curretContents,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  ctx.body = curretContents;
});

module.exports = router;

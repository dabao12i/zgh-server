const express = require('express')

const express = require('express')
const { getSwiperList } = require('../controllers/swiperController')
const { getArticles } = require('../controllers/articleController')

// 创建路由实例
const router = express.Router()

// 定义轮播图数据路由，并将其指向对应的控制器函数
router.get('/swiper/list', getSwiperList)

// 定义文章列表路由，并将其指向对应的控制器函数

router.get('/articles', getArticles)

// 导出路由实例
module.exports = router

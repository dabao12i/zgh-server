const express = require('express');
const { getSwiperList } = require('../controllers/swiperController');
const { getArticles } = require('../controllers/articleController');
const { getCards } = require('../controllers/cardController'); // 导入卡片控制器
const { getPlugins } = require('../controllers/pluginController'); // 导入插件控制器

// 创建路由实例
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Swiper
 *   description: 轮播图管理
 */

/**
 * @swagger
 * /swiper/list:
 *   get:
 *     summary: 获取轮播图列表
 *     tags: [Swiper]
 *     responses:
 *       200:
 *         description: 成功获取轮播图数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 业务状态码 (0表示成功)
 *                 msg:
 *                   type: string
 *                   description: 消息
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 轮播图ID
 *                       imageUrl:
 *                         type: string
 *                         description: 图片URL
 *                       title:
 *                         type: string
 *                         description: 图片标题
 *       500:
 *         description: 服务器内部错误
 */
router.get('/swiper/list', getSwiperList);

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 文章管理
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 获取文章列表
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: 成功获取文章列表数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 业务状态码 (0表示成功)
 *                 msg:
 *                   type: string
 *                   description: 消息
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 文章ID
 *                       title:
 *                         type: string
 *                         description: 文章标题
 *                       excerpt:
 *                         type: string
 *                         description: 文章摘要
 *       500:
 *         description: 服务器内部错误
 */
router.get('/articles', getArticles);

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: 卡片管理
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: 获取卡片列表
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: 成功获取卡片数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 业务状态码 (0表示成功)
 *                 msg:
 *                   type: string
 *                   description: 消息
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 卡片ID
 *                       title:
 *                         type: string
 *                         description: 卡片标题
 *                       description:
 *                         type: string
 *                         description: 卡片描述
 *                       imageUrl:
 *                         type: string
 *                         description: 图片URL
 *                       link:
 *                         type: string
 *                         description: 链接地址
 *       500:
 *         description: 服务器内部错误
 */
router.get('/cards', getCards);

/**
 * @swagger
 * tags:
 *   name: Plugins
 *   description: 插件管理
 */

/**
 * @swagger
 * /plugins:
 *   get:
 *     summary: 获取插件列表
 *     tags: [Plugins]
 *     responses:
 *       200:
 *         description: 成功获取插件数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 业务状态码 (0表示成功)
 *                 msg:
 *                   type: string
 *                   description: 消息
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 插件ID
 *                       name:
 *                         type: string
 *                         description: 插件名称
 *                       version:
 *                         type: string
 *                         description: 插件版本
 *                       description:
 *                         type: string
 *                         description: 插件描述
 *                       status:
 *                         type: string
 *                         description: 插件状态 (enabled/disabled)
 *                       config:
 *                         type: object
 *                         description: 插件配置
 *       500:
 *         description: 服务器内部错误
 */
router.get('/plugins', getPlugins);

// 导出路由实例
module.exports = router;

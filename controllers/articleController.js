/**
 * @description 文章相关的控制器
 */

// 模拟获取文章列表的业务逻辑
const getArticles = (req, res) => {
  // 在实际应用中，这里可能会进行分页查询等操作
  const articles = [
    { id: 'a1', title: '文章一：如何搭建 Node.js 项目', excerpt: '本文将带你从零开始...' },
    { id: 'a2', title: '文章二：Express 核心概念', excerpt: '深入理解中间件、路由...' },
    { id: 'a3', title: '文章三：前端与后端的交互艺术', excerpt: '探讨 RESTful API 设计...' },
    { id: 'a4', title: '文章四：Swiper.js 从入门到精通', excerpt: '让你的轮播图动起来！' },
  ];

  // 使用 res.cc 发送成功响应
  res.cc(articles, '获取文章列表成功');
};

module.exports = {
  getArticles,
};

/**
 * @description 卡片相关的控制器
 */

// 模拟获取卡片列表的业务逻辑
const getCards = (req, res) => {
  // 在实际应用中，这里可能会查询数据库，或者从某个配置服务获取数据
  const cards = [
    {
      id: 'c1',
      title: '精选文章',
      description: '阅读最新、最热门的文章，获取行业洞察。',
      imageUrl: 'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Article+Card',
      link: '/articles',
    },
    {
      id: 'c2',
      title: '热门活动',
      description: '参与线上线下活动，拓展人脉，学习新知。',
      imageUrl: 'https://via.placeholder.com/300x200/8BC34A/FFFFFF?text=Event+Card',
      link: '/events',
    },
    {
      id: 'c3',
      title: '新手教程',
      description: '从入门到精通，助你快速掌握核心技能。',
      imageUrl: 'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Tutorial+Card',
      link: '/tutorials',
    },
  ];

  // 使用 res.cc 发送成功响应
  res.cc(cards, '获取卡片列表成功');
};

module.exports = {
  getCards,
};

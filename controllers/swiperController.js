/**
 * @description Swiper 轮播图相关的控制器
 */

// 模拟获取轮播图列表的业务逻辑
const getSwiperList = (req, res) => {
  // 在实际应用中，这里可能会查询数据库
  const swiperData = [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/800x400/FFC107/FFFFFF?text=Slide+1',
      title: '这是第一张轮播图的标题'
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/800x400/03A9F4/FFFFFF?text=Slide+2',
      title: '这是第二张轮播图的标题'
    },
    {
      id: 3,
      imageUrl: 'https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Slide+3',
      title: '这是第三张轮播图的标题'
    }
  ];
  
  // 使用 res.cc 发送成功响应
  res.cc(swiperData, '获取轮播图数据成功');
};

module.exports = {
  getSwiperList,
};

/**
 * @description 插件相关的控制器
 */

// 模拟获取插件列表的业务逻辑
const getPlugins = (req, res) => {
  // 在实际应用中，这里可能从数据库加载，或者从插件配置目录读取
  const plugins = [
    {
      id: 'p1',
      name: '用户认证插件',
      version: '1.0.0',
      description: '提供用户注册、登录、权限验证等功能。',
      status: 'enabled',
      config: {
        oauth: true,
        jwt: true,
      },
    },
    {
      id: 'p2',
      name: '日志分析插件',
      version: '1.2.0',
      description: '收集并分析系统日志，提供可视化报告。',
      status: 'enabled',
      config: {
        retentionDays: 30,
      },
    },
    {
      id: 'p3',
      name: '第三方支付插件',
      version: '0.9.0',
      description: '集成多种支付方式，简化支付流程。',
      status: 'disabled',
      config: {
        wechatPay: false,
        aliPay: true,
      },
    },
  ];

  // 使用 res.cc 发送成功响应
  res.cc(plugins, '获取插件列表成功');
};

module.exports = {
  getPlugins,
};

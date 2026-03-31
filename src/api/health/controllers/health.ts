export default {
  async check(ctx) {
    // Simple 200 OK for EC2 Load Balancer
    ctx.status = 200;
    ctx.body = { status: 'healthy', timestamp: new Date().toISOString() };
  },
};

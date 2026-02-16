const { app, init } = require('./app');

const PORT = process.env.PORT || 3003;

init().then(() => {
  app.listen(PORT, () => {
    console.log(`PowderRank server running on port ${PORT}`);
  });
});

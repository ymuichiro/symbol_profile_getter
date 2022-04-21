module.exports = function override(config, env) {

  config.output = {
    path: `${__dirname}/docs`,
  };

  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    events: require.resolve("events"),
  };
  return config;
};

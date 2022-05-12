const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config();
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SHIKIVIDEOS_CLIENT_ID':        JSON.stringify(process.env.SHIKIVIDEOS_CLIENT_ID),
      'process.env.SHIKIVIDEOS_CLIENT_SECRET':    JSON.stringify(process.env.SHIKIVIDEOS_CLIENT_SECRET),
      'process.env.SHIKIMORI_CLIENT_ID':          JSON.stringify(process.env.SHIKIMORI_CLIENT_ID),
      'process.env.SHIKIMORI_CLIENT_SECRET':      JSON.stringify(process.env.SHIKIMORI_CLIENT_SECRET),
      'process.env.KODIK_TOKEN':                  JSON.stringify(process.env.KODIK_TOKEN),
      'process.env.EPISODE_NOTIFICATION_TOKEN':   JSON.stringify(process.env.EPISODE_NOTIFICATION_TOKEN)
    })
  ]
};

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  // Optional: disable in development
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  images: {
    domains: ['secure.gravatar.com'] // your external image domains, if any
  }
});

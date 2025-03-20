const withPWA = require('next-pwa')({
  dest: 'public',
  // Disable in development to ease debugging
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  images: {
    domains: ['secure.gravatar.com']
  }
});

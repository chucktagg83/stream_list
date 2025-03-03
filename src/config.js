// src/config.js
const config = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    paymentGateway: 'https://sandbox.payment-provider.com',
    debug: true
  },
  production: {
    apiUrl: 'https://api.yoursite.com',
    paymentGateway: 'https://payment-provider.com',
    debug: false
  }
};

export default config[process.env.NODE_ENV || 'development'];

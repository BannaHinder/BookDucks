module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'b3b5be06f54638fb21b8abfcbf159c20'),
  },
});

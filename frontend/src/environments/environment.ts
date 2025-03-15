// var domain="dev-e3ln3dbw.us.auth0.com";
// var clientId="CDAx0yz169OWd7msr219Khn7V4XGSXZC";
var domain = "dev-e3ln3dbw.us.auth0.com";
var clientId = "kr9GdWS9fZUU3mUx2hMYrUEkKTYP2Euc";
export const environment = {
  production: false,
  ANGULAR_HOST : 'http://localhost:4200/',
  AdminLogin_URL : 'http://localhost:4200/#/adminLogin',
  SC_BE_HOST: "http://localhost:3000",
  // SC_BE_HOST: 'https://service.secretchest.io',
  auth:{
    domain,
    clientId,
    redirectUri:window.location.origin,
  },
};
const express = require('express');
// { Profile, SAML } from "@node-saml/node-saml";
const { Profile, SAML } = require('@node-saml/node-saml');
const bodyParser = require('body-parser');
const { parseIdPMetadataUrl } = require('./utils');

const app = express();

// parse application/x-www-form-urlencoded.
// Used to parse SAMLResposne from IdP.
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.send('Server is running');
});

app.get('/saml/login', async (req, res) => {
    const RelayState = undefined;

    // Read issuer and idp certificate from idp's metadata url
    const { issuer, idpCert } = await parseIdPMetadataUrl('https://dev-745480.okta.com/app/exk171690x2dVCAWm357/sso/saml/metadata');

    this._saml = new SAML({
        callbackUrl: 'http://localhost:3000/authenticate/callback',
        entryPoint: 'https://dev-745480.okta.com/app/bluescapedev745480_samllocalhost_1/exk171690x2dVCAWm357/sso/saml',
        // issuer: 'http://www.okta.com/exk171690x2dVCAWm357',
        audience: 'http://localhost:3000/saml/login/callback',
        issuer,
        // idpCert: ['MIIDpDCCAoygAwIBAgIGAWxWS5R1MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi03NDU0ODAxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTkwODAzMDcwMzQ5WhcNMjkwODAzMDcwNDQ5WjCBkjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtNzQ1NDgwMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAim1u6fvENv07ASMOHAA5158WBy3SKC+IDypJw+ICGasUNgQPavIWSSie1hjr7xMDN0mczFbutQHe8awke4xEcCXk76IHIpuqzmWFls+rJt/OwbtBrMiIusrTGW71amWB0roDMwApjrUKrKVEvzXGvk6cLf0GzJJHOVK6Z/+mooplpp/xJnu9vv5sRTy4qvRkAenE61lptBNHkjEe0LHB+Ic3iYwnOpPo7tX+xMnUGi0U7zhUaJ12bchegczVauF4Ek0rprPpWCd1GObNu8otomcUVAu7JlC7dcYU+PupdE/RWxHZvpisc7xQE89nWW0mX1ETrN+NYXJe2ZvGEYM8GQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAv21GAd0/oesyo+mi0Vds7NQmdfUH83c7kKTrEkaJKyOIU1+2Rwv95TjW+rEJdLvQT1vnXPIpY2kq2jLJ+IZaGqbjWWIeX4OoW7HZB7ms9Fees/EtFQmudL04mUR3VB0zvm71+1tg020e+bf3H4T2ug1jKdl5+qg7iP+xVy6N4pKGVw40ljiSLSOnPE71sBNug0S29mYo7aP2uTcOVeJtcVvGCceXwbkv3tJz833YJ6lU4MMXeqpKUqH0MSpqcUX0OrqGo38xpBZeQgqloC6Xek1xoiIWDjSLtPXc/RdjKP1BvlFObiu1FYc2KIJwk52MCoe/74xyAz3z6/bYxMdo4'],
        idpCert: [idpCert],
        signatureAlgorithm: 'sha256'
    });

    const host = req.headers && req.headers.host;
    // Generate redirect url
    const redirectUrl = await this._saml.getAuthorizeUrlAsync(RelayState, host);

    res.redirect(redirectUrl);
});

app.post('/saml/login/callback', async (req, res) => {

    if (req.body?.SAMLResponse) {

        const { issuer, idpCert } = await parseIdPMetadataUrl('https://dev-745480.okta.com/app/exk171690x2dVCAWm357/sso/saml/metadata');

        this._saml = new SAML({
            callbackUrl: 'http://localhost:3000/authenticate/callback',
            entryPoint: 'https://dev-745480.okta.com/app/bluescapedev745480_samllocalhost_1/exk171690x2dVCAWm357/sso/saml',
            // issuer: 'http://www.okta.com/exk171690x2dVCAWm357',
            audience: 'http://localhost:3000/saml/login/callback',
            issuer,
            // idpCert: ['MIIDpDCCAoygAwIBAgIGAWxWS5R1MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi03NDU0ODAxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTkwODAzMDcwMzQ5WhcNMjkwODAzMDcwNDQ5WjCBkjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtNzQ1NDgwMRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAim1u6fvENv07ASMOHAA5158WBy3SKC+IDypJw+ICGasUNgQPavIWSSie1hjr7xMDN0mczFbutQHe8awke4xEcCXk76IHIpuqzmWFls+rJt/OwbtBrMiIusrTGW71amWB0roDMwApjrUKrKVEvzXGvk6cLf0GzJJHOVK6Z/+mooplpp/xJnu9vv5sRTy4qvRkAenE61lptBNHkjEe0LHB+Ic3iYwnOpPo7tX+xMnUGi0U7zhUaJ12bchegczVauF4Ek0rprPpWCd1GObNu8otomcUVAu7JlC7dcYU+PupdE/RWxHZvpisc7xQE89nWW0mX1ETrN+NYXJe2ZvGEYM8GQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAv21GAd0/oesyo+mi0Vds7NQmdfUH83c7kKTrEkaJKyOIU1+2Rwv95TjW+rEJdLvQT1vnXPIpY2kq2jLJ+IZaGqbjWWIeX4OoW7HZB7ms9Fees/EtFQmudL04mUR3VB0zvm71+1tg020e+bf3H4T2ug1jKdl5+qg7iP+xVy6N4pKGVw40ljiSLSOnPE71sBNug0S29mYo7aP2uTcOVeJtcVvGCceXwbkv3tJz833YJ6lU4MMXeqpKUqH0MSpqcUX0OrqGo38xpBZeQgqloC6Xek1xoiIWDjSLtPXc/RdjKP1BvlFObiu1FYc2KIJwk52MCoe/74xyAz3z6/bYxMdo4'],
            idpCert: [idpCert],
            signatureAlgorithm: 'sha256'
        });

        const parsedResponse = await this._saml.validatePostResponseAsync(req.body);
        const { profile: { email } } = parsedResponse;
        return res.send(`Hello + ${email}`);
    }

    res.send('No valid response from identity provider');

});

app.listen(3000);


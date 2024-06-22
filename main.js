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
    const { issuer, idpCert, entryPoint } = await parseIdPMetadataUrl('https://dev-745480.okta.com/app/exk171690x2dVCAWm357/sso/saml/metadata');

    this._saml = new SAML({
        callbackUrl: 'http://localhost:3000/saml/login/callback',
        entryPoint,
        audience: 'demo-node-saml-server',
        issuer,
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

        const { issuer, idpCert, entryPoint } = await parseIdPMetadataUrl('https://dev-745480.okta.com/app/exk171690x2dVCAWm357/sso/saml/metadata');

        this._saml = new SAML({
            callbackUrl: 'http://localhost:3000/saml/login/callback',
            entryPoint,
            audience: 'demo-node-saml-server',
            issuer,
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


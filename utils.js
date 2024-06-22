const axios = require('axios');
const { XMLParser } = require("fast-xml-parser");

async function parseIdPMetadataUrl(metadataUrl) {

    const { data } = await axios.get(metadataUrl);

    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    const parsedXml = parser.parse(data);

    // Note that each idp's metadata xml can be slightly different. Following parsing logic is only for Okta.
    const issuer = parsedXml['md:EntityDescriptor']['@_entityID'];

    const idpCert = parsedXml['md:EntityDescriptor']['md:IDPSSODescriptor']['md:KeyDescriptor']['ds:KeyInfo']['ds:X509Data']['ds:X509Certificate'];

    // This is an array
    const singleSignOnServices = parsedXml['md:EntityDescriptor']['md:IDPSSODescriptor']['md:SingleSignOnService'];
    let entryPoint = null;
    for (let i = 0; i < singleSignOnServices.length; i++) {
        const singleSignOnService = singleSignOnServices[i];
        // We only use the HTTP-Redirect endpoint for SSO
        if (singleSignOnService['@_Binding'].includes('HTTP-Redirect')) {
            entryPoint = singleSignOnService['@_Location'];
            break;
        }
    }

    return {
        issuer,
        idpCert,
        entryPoint,
    }
}

exports.parseIdPMetadataUrl = parseIdPMetadataUrl;

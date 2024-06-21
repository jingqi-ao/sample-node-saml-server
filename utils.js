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

    return {
        issuer,
        idpCert,
    }
}

exports.parseIdPMetadataUrl = parseIdPMetadataUrl;

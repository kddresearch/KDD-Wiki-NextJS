import { ClientSecretCredential } from '@azure/identity';


function getDefaultAWSCredentials() {
    const accessKey = process.env.WIKI_AWS_ACCESS_KEY_ID;
    const secretKey = process.env.WIKI_AWS_SECRET_ACCESS_KEY;
    const token = process.env.WIKI_AWS_SESSION_TOKEN;

    if (!accessKey) {
        throw new Error('Default AWS accessKey credentials not found. Please provide WIKI_AWS_ACCESS_KEY_ID');
    }

    if (!secretKey) {
        throw new Error('Default AWS secretKey credentials not found. Please provide WIKI_AWS_SECRET_ACCESS_KEY');
    }

    const credentials = {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        sessionToken: token,
    };
    
    return credentials;
}

function getDefaultAzureCredentials(): ClientSecretCredential {
    const tenantId = process.env.WIKI_AZURE_TENANT_ID;
    const clientId = process.env.WIKI_AZURE_CLIENT_ID;
    const clientSecret = process.env.WIKI_AZURE_CLIENT_SECRET;

    if (!tenantId) {
        throw new Error('Default Azure tenantId credentials not found. Please provide WIKI_AZURE_TENANT_ID');
    }

    if (!clientId) {
        throw new Error('Default Azure clientId credentials not found. Please provide WIKI_AZURE_CLIENT_ID');
    }

    if (!clientSecret) {
        throw new Error('Default Azure clientSecret credentials not found. Please provide WIKI_AZURE_CLIENT_SECRET');
    }

    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    return credential;
}

export {
    getDefaultAWSCredentials,
    getDefaultAzureCredentials
}
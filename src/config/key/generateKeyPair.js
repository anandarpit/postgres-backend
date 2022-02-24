const crypto = require('crypto');
const fs = require('fs');

function genKeyPair() {
    
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1', 
            format: 'pem' 
        },
        privateKeyEncoding: {
            type: 'pkcs1', 
            format: 'pem' 
        }
    });

    // Creating the public key file
    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey); 
    
    // Creating the private key file
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
}
// Generate the keypair
genKeyPair();
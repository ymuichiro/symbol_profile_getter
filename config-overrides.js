module.exports = function override(config, env) {
  config.resolve.alias = {
  };
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    events: require.resolve("events"),
  };
  return config;
};

/**
 * Encode a message using AES-GCM algorithm
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 * @param {boolean} isHexString - Is payload string a hexadecimal string (default = false)
 * @return {string} - The encoded message
 */
//      public static encode = (senderPriv: string, recipientPub: string, msg: string, isHexString = false): string => {
//   // Errors
//   if (!senderPriv || !recipientPub || !msg) {
//     throw new Error('Missing argument !');
//   }
//   // Processing
//   const iv = Crypto.randomBytes(12);
//   const encoded = Crypto._encode(senderPriv, recipientPub, isHexString ? msg : convert.utf8ToHex(msg), iv);
//   // Result
//   return encoded;
// };

/**
 *
 * @param message - Plain message to be encrypted
 * @param recipientPublicAccount - Recipient public account
 * @param privateKey - Sender private key
 * @return {EncryptedMessage}
 */
  // public static create(message: string, recipientPublicAccount: PublicAccount, privateKey: string): EncryptedMessage {
  // return new EncryptedMessage(
  //   Crypto.encode(privateKey, recipientPublicAccount.publicKey, message).toUpperCase(),
  //   recipientPublicAccount,
  // );
  // }
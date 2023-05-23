// crypto-js加密
// const aseKey =
//   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdH\n' +
//   'nzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ=='

const CryptoJS = require('crypto-js')

export function cryptoEncryption(aseKey, message) {
  // aseKey为密钥（必须为：8/16/32位），message为要加密的密文
  const encrypt = CryptoJS.AES.encrypt(
    message,
    CryptoJS.enc.Utf8.parse(aseKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString()
  return encrypt
}
// crypto-js解密
export function cryptoDecrypt(aseKey, message) {
  const decrypt = CryptoJS.AES.decrypt(
    message,
    CryptoJS.enc.Utf8.parse(aseKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8)
  return decrypt
}

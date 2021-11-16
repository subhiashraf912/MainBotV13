import CryptoJS from "crypto-js";
export const decrypt = (data: string) =>
  CryptoJS.AES.decrypt(data, "SECRET").toString(CryptoJS.enc.Utf8);

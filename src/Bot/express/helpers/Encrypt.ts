import CryptoJS from "crypto-js";
export const encrypt = (data: string) =>
  CryptoJS.AES.encrypt(data, "SECRET").toString();

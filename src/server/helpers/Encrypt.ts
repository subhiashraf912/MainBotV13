import CryptoJS from "crypto-js";
export const encrypt = (data: string) =>
  CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_KEY!).toString();

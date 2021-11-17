import CryptoJS from "crypto-js";
export const decrypt = (data: string) =>
  CryptoJS.AES.decrypt(data, process.env.ENCRYPTION_KEY!).toString(
    CryptoJS.enc.Utf8
  );

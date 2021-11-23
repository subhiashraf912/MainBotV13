import fetch from "node-fetch";
class Chatbot {
  chatbot_name;
  chatbot_gender;
  chatbot_user;
  constructor(ops = { name: "chatbot", gender: "male", user: "" }) {
    this.chatbot_name = ops.name;
    this.chatbot_gender = ops.gender;
    this.chatbot_user = ops.user;
  }

  async chat(message: string): Promise<string> {
    if (!message) throw new Error("Error. No message provided");
    const res = await fetch(
      `https://api.udit.gq/api/chatbot?message=${encodeURIComponent(
        message
      )}&user=${encodeURIComponent(
        this.chatbot_user
      )}&gender=${encodeURIComponent(
        this.chatbot_gender
      )}&name=${encodeURIComponent(this.chatbot_name)}`
    ).catch((e) => {
      throw new Error(`Ran into an Error. ${e}`);
    });
    const response = await res.json().catch((e) => {
      throw new Error(`Ran into an Error. ${e}`);
    });
    const msg: string = response.message;
    return msg
      .replace("CleverChat", this.chatbot_name)
      .replace("male", this.chatbot_gender) as string;
  }
}
export default Chatbot;

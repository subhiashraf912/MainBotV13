import Image from "next/image";
const guildBox = (props: props) => (
  <div className="guild-box">
    <Image
      className="image-rounded"
      src={props.guildIcon}
      width={50}
      height={50}
      alt={props.guildName}
    />
    <h3>{props.guildName.substring(0, 20)}</h3>
  </div>
);

export default guildBox;

interface props {
  guildName: string;
  guildIcon: string;
  guildId: string;
}

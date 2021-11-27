import Image from "next/image";
import Link from "next/link";
const guildBox = (props: props) => (
  <Link passHref={true} href={`/guilds/${props.guildId}`}>
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
  </Link>
);

export default guildBox;

interface props {
  guildName: string;
  guildIcon: string;
  guildId: string;
}

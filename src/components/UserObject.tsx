import Image from 'next/image';

type props = {
    username: string;
    avatarLink: string;
}

const UserObject = (props: props) => {
    return (
        <div className='container'>
            <div className='child'>        <Image
            src={props.avatarLink}
            alt={props.username}
            width={50}
            height={50}
            className="user-avatar"
        //   style={{ borderRadius: "50px" }}
        />

        <span>{props.username}</span></div>

    </div>
    )
}


export default UserObject;
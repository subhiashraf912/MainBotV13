import { authHeaders } from '../../helpers/AuthHeaders';
import { decrypt } from '../../helpers/Decrypt';
import axios from 'axios';
import {DISCORD_API_ROUTES} from '../../types/DiscordAPIRoutes';
import User from '../../types/OAuth2UserResponse';
function fetchDiscordUser(accessToken: string) {
    const decryptedToken = decrypt(accessToken);
    return axios.get<User>(DISCORD_API_ROUTES.OAUTH2_USER, authHeaders(decryptedToken));
}


export default fetchDiscordUser;
import { Request, Response } from "express";
import url from "url";
import axios from "axios";
import discordAPIUri from "../../discordAPIUri";
import DiscordOAuth2CredentialsResponse from "../../../utils/types/DiscordOAuth2CredentialsResponse";
import DiscordClient from "../../../client/client";
import { exchangeAcessCodeForCredentials } from "../../services/auth/exchangeAcessCodeForCredentials.service";
import { getDiscordUserDetails } from "../../services/auth/getDiscordUserDetails.service";
import createUser from "../../services/auth/createUser.service";
import { serializeSession } from "../../sessions/serializeSession";
import encryptTokensService from "../../services/auth/encryptTokens.service";
import buildUserService from "../../services/auth/buildUser.service";
export function authDiscordRedirectController(client: DiscordClient) {
  return async (req: Request, res: Response) => {
    const { code } = req.query;
    if (code) {
      try {
        const response = await exchangeAcessCodeForCredentials({
          client_id: "889108074776903710",
          client_secret: "ld7DIPC6abj6XWIINo8hG-HGGwkvB5-S",
          grant_type: "authorization_code",
          code: code.toString(),
          redirect_uri: "http://localhost:3001/api/auth/discord/redirect",
        });
        const data = response.data;
        const { access_token, refresh_token } = data;
        const encryptedTokens = encryptTokensService(
          access_token,
          refresh_token
        );
        const { data: loggedUser } = await getDiscordUserDetails(access_token);
        const newUser = await createUser(
          buildUserService(loggedUser, encryptedTokens)
        );
        client.accessTokens.set(loggedUser.id, data);
        await serializeSession(req, newUser);
        res.send({
          message: "Logged in",
          code: 200,
          newUser,
        });
      } catch (err) {
        console.log(err);
        res.sendStatus(400);
      }
    }
  }
}
export function authDiscordUserGuildsController(client: DiscordClient) {
  return async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const authKey = client.accessTokens.find(
      (user) => user.access_token === authorization
    )?.access_token;
    if (!authKey) return res.send({ message: "Not Authorized", code: 401 });
    try {
      const { data: guilds } = await axios.get(
        `${discordAPIUri}/users/@me/guilds`,
        {
          headers: {
            Authorization: `Bearer ${authKey}`,
          },
        }
      );

      res.send(guilds);
    } catch (err) {
      res.send({ message: "Bad Request", code: 400 });
    }
  }
}
export function authDiscordUserController(client: DiscordClient) {
  return async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const authKey = client.accessTokens.find(
      (user) => user.access_token === authorization
    )?.access_token;
    if (!authKey) return res.send({ message: "Not Authorized", code: 401 });
    try {
      const { data: user } = await axios.get(`${discordAPIUri}/users/@me`, {
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      });

      res.send(user);
    } catch (err) {
      res.send({ message: "Bad Request", code: 400 });
    }
  }
}
export function authDiscordRevokeTokenController(client: DiscordClient) {
  return async (req: Request, res: Response) => {
    return req.user ? res.sendStatus(200) : res.sendStatus(401);
    // const authKey = req.user?.accessToken
    // if (!authKey) return res.send({ message: "Not Authorized", code: 401 });
    // const formData = new url.URLSearchParams({
    //   'client_id': '889108074776903710',
    //   'client_secret': 'ld7DIPC6abj6XWIINo8hG-HGGwkvB5-S',
    //   'token': authKey
    // });

    // try {
    //   await axios.post(`${discordAPIUri}/oauth2/token/revoke`, formData.toString());
    //   const accessTokenKey = client.accessTokens.findKey(data => data.access_token === authKey);
    //   client.accessTokens.delete(accessTokenKey as string);
    //   res.send({ message: "Logged out", code: 200 });
    // } catch (err) {
    //   res.send({ message: "Bad Request", code: 400 });
    // }
  }
}
export function authDiscordRefreshTokenController(client: DiscordClient) {
  return async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const oldUserTokens = client.accessTokens.find(
      (user) => user.access_token === authorization
    );
    if (!oldUserTokens)
      return res.send({ message: "Not Authorized", code: 401 });
    try {
      const formData = new url.URLSearchParams({
        client_id: "889108074776903710",
        client_secret: "ld7DIPC6abj6XWIINo8hG-HGGwkvB5-S",
        grant_type: "refresh_token",
        refresh_token: oldUserTokens.refresh_token,
      });
      const response = await axios.post(
        `${discordAPIUri}/oauth2/token`,
        formData
      );
      const data: DiscordOAuth2CredentialsResponse = response.data;
      const { access_token } = data;
      const loggedUser = await axios.get(`${discordAPIUri}/users/@me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      client.accessTokens.set(loggedUser.data.id, data);
      res.send({
        message: "Refreshed Token",
        code: 200,
      });
    } catch (err) {
      res.sendStatus(400);
    }
  }
}
export async function getAuthenticatedUserController(
  req: Request,
  res: Response
) {
  console.log(req.sessionID);
  console.log(req.user);
  res.send(200);
}
{
}

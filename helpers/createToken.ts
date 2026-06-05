import { RequestHandler } from "../utils/request-handler";

export async function createToken(api: RequestHandler, username: string, password: string)
{
  const tokenResponse = await api
        .path("users/login")
        .body({
            "user": {
                "email": username,
                "password": password
            }
        })
        .postRequest(200)
         return ' Token ' + tokenResponse.user.token;
}
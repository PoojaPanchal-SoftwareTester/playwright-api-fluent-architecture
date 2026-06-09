import { test } from '../utils/fixtures';

test("Error messgaes validation", async ({ api }) => {

    const newUserReponse = await api
        .path("users")
        .body({
            "user": {
                "email": "e",
                "password": "e",
                "username": "e"
            }
        })
    
        .postRequest(422);

        console.log(newUserReponse);

})
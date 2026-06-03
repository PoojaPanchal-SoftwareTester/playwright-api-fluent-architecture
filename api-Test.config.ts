const processENV:any= process.env.TEST_ENV;
const env= processENV || "dev"

console.log(`Running tests in ${env} environment`)



const config={
    baseURL: "https://conduit-api.bondaracademy.com/api/",
    userEmail: "mtest4328@gmail.com",
    userPassword: "12345678"
}

if (env === "prod") {
    config.baseURL = "https://conduit-api.bondaracademy.com/api/";
    config.userEmail = "";
    config.userPassword = "";
}


export {config}
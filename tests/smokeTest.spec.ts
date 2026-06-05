import { createToken } from '../helpers/createToken';
import { test } from '../utils/fixtures';
import { RequestHandler } from '../utils/request-handler';
import { expect } from "@playwright/test";
import { validateSchema } from '../utils/schema-validator';

let authToken: string;


test.beforeAll('Get token', async ({ api, config }) => {
    const tokenResponse = await api
        .path("users/login")
        .body({
            "user": {
                "email": config.userEmail,
                "password": config.userPassword
            }
        })
        .postRequest(200)
         authToken=  ' Token ' + tokenResponse.user.token;
    //authToken = await createToken(api, config.userEmail, config.userPassword);
})


test('First test', async ({ api, config }) => {

    const response = await api
        .path("articles")
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
})

test('Get tags' ,async({api, config})=>{

    const tagResponse = await api
    .path('tags')
    .headers({ Authorization: authToken })
    .getRequest(200);
    await validateSchema('tags', 'Get_tags', tagResponse);
});

test('Create ,update and delete a new article', async ({ api, config }) => {
    // Create a new article
    const createArticleResponse = await api
        .path('articles')
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "new articles",
                "description": "good article",
                "body": "Technology is transforming the way people work and communicate. From online learning to remote jobs, digital tools have made information and opportunities more accessible than ever before. However, it is important to use technology responsibly and maintain a balance between online and offline life.\n",
                "tagList": [
                    "HTML"
                ]
            }
        })
        .postRequest(201);
        
//console.log(createArticleResponse);
    expect(createArticleResponse.article.title).toBe("new articles");
    const slug = createArticleResponse.article.slug;

    // Verify the article is created
    const articleResponse = await api
        .path(`articles/${slug}`)
        .headers({ Authorization: authToken })
        .getRequest(200);
   // console.log(articleResponse);
    expect(articleResponse.article.title).toEqual("new articles");

     // Update the article
    const updateArticleResponse = await api
        .path(`articles/${slug}`)
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "new article1",
                "description": "good article",
                "body": "Technology is transforming the way people work and communicate. From online learning to remote jobs, digital tools have made information and opportunities more accessible than ever before. However, it is important to use technology responsibly and maintain a balance between online and offline life.\n",
                "tagList": [
                    "HTML"
                ]
            }
        })
        .putRequest(200);

       
    const updatedSlug = updateArticleResponse.article.slug;
    expect(updateArticleResponse.article.title).toBe("new article1");

     // Verify the article is created
    const updateResponse = await api
        .path(`articles/${updatedSlug}`)
        .headers({ Authorization: authToken })
        .getRequest(200);
   // console.log(articleResponse);
    expect(updateResponse.article.title).toEqual("new article1");

    // Delete the article
    await api
        .path(`articles/${updatedSlug}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204);

   

})
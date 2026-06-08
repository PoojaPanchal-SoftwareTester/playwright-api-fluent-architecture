import { createToken } from '../helpers/createToken';
import { test } from '../utils/fixtures';
import { RequestHandler } from '../utils/request-handler';
import { expect } from "@playwright/test";
import { validateSchema } from '../utils/schema-validator';
// import payload of request body from json file
import ArticleRequestPayload from '../request-objects/Post-article.json';
import {faker} from '@faker-js/faker';

//random data generate helper import
import { getNewRandomArticle } from '../utils/data-generator';

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
        //validateschema function will create the schema if it doesn't exist and validate the response against the schema if it exists
         await validateSchema('articles', 'Get_articles', response,true);
})

test('Get tags' ,async({api, config})=>{

    const tagResponse = await api
    .path('tags')
    .headers({ Authorization: authToken })
    .getRequest(200);
            //validateschema function will create the schema if it doesn't exist and validate the response against the schema if it exists
    await validateSchema('tags', 'Get_tags', tagResponse,true);
});

test('Create ,update and delete a new article', async ({ api, config }) => {
    // Create a new article

    //using faker json we generate title
        //const articelTitle = faker.lorem.sentence(5);

    // Deep copy of the request payload to avoid mutation of the original object
    //const articleRquest = JSON.parse(JSON.stringify(ArticleRequestPayload));
    //articleRquest.article.title = articelTitle;

    //call random generate json data for request
    const articleRquest = getNewRandomArticle();
    

    //Changing the title value for only one time execution of the test to avoid schema validation error due to unique title constraint in the API
   //articleRquest.article.title = "title values changed for only one time execution of the test to avoid schema validation error due to unique title constraint in the API";
    
   const createArticleResponse = await api
        .path('articles')
        .headers({ Authorization: authToken })
        .body(articleRquest) //call the request payload from json file [request-objects/Post-article.json]
        .postRequest(201);
        await validateSchema('articles', 'Post_articles',createArticleResponse,true);
        
//console.log(createArticleResponse);
    expect(createArticleResponse.article.title).toBe(articleRquest.article.title);
    const slug = createArticleResponse.article.slug;

    // Verify the article is created
    const articleResponse = await api
        .path(`articles/${slug}`)
        .headers({ Authorization: authToken })
        .getRequest(200);
   // console.log(articleResponse);
    expect(articleResponse.article.title).toEqual(articleRquest.article.title);

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
        await validateSchema('articles', 'Put_articles',updateArticleResponse,true);
       
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
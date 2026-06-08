// import payload of request body from json file
import ArticleRequestPayload from '../request-objects/Post-article.json';
import {faker} from '@faker-js/faker';

export function getNewRandomArticle()
{
    const articleRquest = JSON.parse(JSON.stringify(ArticleRequestPayload));
    articleRquest.article.title = faker.lorem.sentence(5);
    articleRquest.article.description = faker.lorem.sentence(3);
    articleRquest.article.body = faker.lorem.paragraph(8);
    return articleRquest;
}
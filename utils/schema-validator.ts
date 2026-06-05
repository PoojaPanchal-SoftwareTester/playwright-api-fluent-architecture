import fs from 'fs/promises';
import path from "path";
import Ajv from 'ajv';

const ajv= new Ajv({allErrors: true});

const schemaBasePath = './response-schemas';
export async function validateSchema(dirName: string, fileName: string, responseData: object)
{
  const schemaPath = path.join(schemaBasePath, dirName,`${fileName}_schema.json`);
  const schema =await loadSchema(schemaPath);
 const validate = ajv.compile(schema)
 const valid = validate(responseData)
if (!valid)
{
    throw new Error(
         `Schema validation ${fileName}_schema.json failed:\n`+
            `${JSON.stringify(validate.errors, null, 4)}\n\n`+
            `Actual response body: \n`+
            `${JSON.stringify(responseData, null, 4)}`
    )
}
}
async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    }
    catch (error) {
        throw new Error(`Failed to load schema from ${schemaPath}: ${error}`);
    }

}
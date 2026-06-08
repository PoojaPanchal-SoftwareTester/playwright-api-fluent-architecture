import fs from 'fs/promises';
import path from "path";
import Ajv from 'ajv';
import { createSchema } from 'genson-js';

const ajv= new Ajv({allErrors: true});

const schemaBasePath = './response-schemas';
export async function validateSchema(dirName: string, fileName: string, responseData: object,createSchemaFlag: boolean = false)
{
  const schemaPath = path.join(schemaBasePath, dirName,`${fileName}_schema.json`);

  if(createSchemaFlag)
  {
    await generateSchema(responseData,schemaPath);
  }

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

async function generateSchema(responseData: object, schemaPath: string) 
{
       try {
        const generateSchema = createSchema(responseData);
       await fs.mkdir(path.dirname(schemaPath),{recursive:true});
        await fs.writeFile(schemaPath, JSON.stringify(generateSchema, null, 4), 'utf-8');
       
    } catch (error) {
        throw new Error (`Failed to generate schema ${schemaPath}: ${error}`);
    }
}
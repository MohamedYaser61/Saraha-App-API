import joi from "joi";

// Define a schema for validation
/**
 * 1- Create a schema object using joi.object()
 * 2- Define the structure and constraints of the data using joi methods (e.g., joi.string(), joi.number(), etc.)
 * 3- Use the schema to validate incoming data (e.g., req.body) using schema.validate(data)
 * 4- Handle validation results, including errors if the data does not conform to the schema
 */


// 1- Create a schema object
const user ={
    id: "12345678901234",
    userName: "Olaa",
    email: "ola22@gmail.com",
    age: 25,
    password: "root123",
    confirmPassword: "root123",
    skills: ["HTML", "CSS", "JS"]

}

// 2- Define the structure and constraints of the data (schema=> set of rules)
const schema = joi.object({
    id: joi.string().pattern(new RegExp('^[0-9]{14}$')).required(),
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    age: joi.number().min(18).max(65).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).messages({'any.only': 'confirmPassword does not match password'}).required(),
    skills: joi.array().required().items(joi.string().required()).min(1)

}).required();

// 3- Use the schema to validate incoming data
const result = schema.validate(user);
console.log(result);

// 4- Handle validation results
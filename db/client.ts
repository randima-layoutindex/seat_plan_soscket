// import {DynamoDBClient} from "@aws-sdk/client-dynamodb"
// import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb"

// const dynamoClient = new DynamoDBClient({
//     region:"ap-southeast-2",
//     endpoint:"dynamodb.ap-southeast-2.amazonaws.com"
// })

// const docClient = DynamoDBDocumentClient.from(dynamoClient)

// export default docClient

const AWS = require('aws-sdk')

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const db = new AWS.DynamoDB.DocumentClient()

// const Table = 'users'

export {
    db
}
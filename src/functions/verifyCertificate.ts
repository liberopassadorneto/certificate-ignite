import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

interface IUserCertificate {
  id: string;
  name: string;
  grade: string;
  created_at: string;
}

const handler: APIGatewayProxyHandler = async (event) => {
  // http://localhost:3000/verifiyCertificate/{id}

  const { id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_certificate",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  const userCertificate = response.Items[0] as IUserCertificate;

  if (userCertificate) {
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Certificate found",
        name: userCertificate.name,
        url: `https://certificate-ignite-libero.s3.amazonaws.com/${id}.pdf`,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificate not found",
    }),
  };
};

export { handler };

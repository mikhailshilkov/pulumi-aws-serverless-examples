package main

import (
 "github.com/aws/aws-lambda-go/events"
 "github.com/aws/aws-lambda-go/lambda"
)

// Handler is your Lambda function handler
// It uses Amazon API Gateway request/responses provided by the aws-lambda-go/events package,
// However you could use other event sources (S3, Kinesis etc), or JSON-decoded primitive types such as 'string'.
func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

 return events.APIGatewayProxyResponse{
  Body:       "\"Hi from Golang lambda\"",
  StatusCode: 200,
 }, nil

}

func main() {
 lambda.Start(Handler)
}
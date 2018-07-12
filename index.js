const pulumi = require("@pulumi/pulumi");
const cloud = require("@pulumi/cloud-aws");
const aws = require("@pulumi/aws");
const serverless = require("@pulumi/aws-serverless");

// Create an API endpoint with JS lambda
const api = new cloud.API("aws-hellolambda-js");
api.get("/js", (req, res) => {
    res.status(200).json("Hi from Javascript lambda");
});

// Setup IAM role
const policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
                "Service": "lambda.amazonaws.com",
            },
            "Effect": "Allow",
            "Sid": "",
        },
    ],
};
const role = new aws.iam.Role("precompiled-lambda-role", {
    assumeRolePolicy: JSON.stringify(policy),
});

// Create a C# lambda
const csharpLambda = new aws.lambda.Function("aws-hellolambda-csharp", {
    runtime: aws.lambda.DotnetCore2d0Runtime,
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./csharp/bin/Debug/netcoreapp2.0/publish"),
    }),
    timeout: 5,
    handler: "app::app.Functions::GetAsync",
    role: role.arn
});

// Create a Python lambda
const pythonLambda = new aws.lambda.Function("aws-hellolambda-python", {
    runtime: aws.lambda.Python3d6Runtime,
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./python"),
    }),
    timeout: 5,
    handler: "handler.handler",
    role: role.arn
});

// Create a Golang lambda
const golangLambda = new aws.lambda.Function("aws-hellolambda-golang", {
    runtime: aws.lambda.Go1dxRuntime,
    code: new pulumi.asset.FileArchive("./go/main.zip"),
    timeout: 5,
    handler: "main",
    role: role.arn
});

// Create a Java lambda
const javaLambda = new aws.lambda.Function("aws-hellolambda-java", {
    code: new pulumi.asset.AssetArchive({
        "lib/lambda-java-example-1.0-SNAPSHOT.jar": new pulumi.asset.FileAsset("./java/target/lambda-java-example-1.0-SNAPSHOT.jar"),
    }),
    runtime: aws.lambda.Java8Runtime,
    timeout: 5,
    handler: "example.Hello",
    role: role.arn
});

// Create API for all non-JS lambdas
const precompiledApi = new serverless.apigateway.API("aws-hellolambda-precompiledapi", {
    routes: [
        { method: "GET", path: "/csharp", handler: csharpLambda },
        { method: "GET", path: "/python", handler: pythonLambda },
        { method: "GET", path: "/go", handler: golangLambda },
        { method: "GET", path: "/java", handler: javaLambda },
    ],
});

exports.endpointJs = api.publish().url.apply(u => u + "js");
exports.endpointCsharp = precompiledApi.url.apply(u => u + "csharp");
exports.endpointPython = precompiledApi.url.apply(u => u + "python");
exports.endpointGolang = precompiledApi.url.apply(u => u + "go");
exports.endpointJava = precompiledApi.url.apply(u => u + "java");
def handler(event, context): 
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': '"Hi from Python lambda"'
    }

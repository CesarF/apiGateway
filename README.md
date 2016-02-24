# Api Gateway

A short implementation for an Api Gateway to register microservices

## Usage

First install all node dependencies using npm

```
npm install
```

### Services

Api Gateway exposes some services to register, unregister, get all registered microservices and call some microservices.
The next table show all the service definitions:

| Path  | Method | Explanation |
| ------------- | ------------- | ---------- |
| /apps | GET  | Show all registered microservices |
| /apps | POST | Register a microservice. It needs to post a json object according below specification |
| /apps/**serviceName**  | DELETE | Deletes the micro service with **appName** |
| /service/**serviceName**\[/**optionalPath**\] | Request the microservice. **optionalPath** is the optional url params for the service |

### POST Specification

To make a post request you need to post a json object according to the follow specification:

```
{
    "appName": <name of the service>,
    "hostName": <hostName of the service>,
    "port": <port of the service (optional)>,
    "service": <path of the service>,
    "method": < Method for the request >
}
```
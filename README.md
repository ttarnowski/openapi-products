# How to Build REST APIs LIKE A PRO in 2023 (With Tests)

This repository has been created as a part of the YouTube video: [How to Build REST APIs LIKE A PRO in 2023 (With Tests)](https://youtu.be/Ky-5AVA5o4s)

It is an implementation of CRUD(Create,Read,Update,Delete) Product REST API in Node.js, [tsoa](https://github.com/lukeautry/tsoa), [express](https://expressjs.com/), [serverless-express](https://github.com/vendia/serverless-express).

API is compliant with [OpenAPI 3.0](https://swagger.io/specification/) specification that is auto-generated from the code.

All the API endpoints have test coverage. Tests have been written with the use of [`jest`](https://github.com/facebook/jest) test runner and [`supertest`](https://github.com/ladjs/supertest) library.

Project is integrated with [Serverless Framework](https://github.com/serverless/serverless) - infrastructure as a code tool to make deployment to AWS simple. When deployed it creates AWS API Gateway API, AWS Lambda Function with Proxy Integration, and AWS DynamoDB table for Products that acts as a data storage.

This project is based on a starter project: [ttarnowski/ts-serverless-openapi-template](https://github.com/ttarnowski/ts-serverless-openapi-template).

## Features

Thanks to [`tsoa`](https://github.com/lukeautry/tsoa):

- TypeScript controllers and entities as a single source of truth for your API
- A valid OpenAPI specification is generated from your code
- jsDoc supported for object descriptions (most other metadata can be inferred from TypeScript types)
- Built-in request payload validation inferred from entity TypeScript types and/or jsDoc comments
- Integrated with [`express`](https://github.com/expressjs/express)

Thanks to [`inversify`](https://github.com/inversify):

- Lightweight inversion of control container for TypeScript
- Provides with set of TypeScript decorators that effectively integrate with tsoa controllers and services

Thanks to [`node-config`](https://github.com/node-config/node-config):

- Zero-config application configuration library
- Allows for defining a set of default paramaters that can be extended for different deployment environments (dev, staging, prod, test, etc.) or overriden by environment variables, command line parameters, or external sources
- Provides a consistent configuration interface

Thanks to [`serverless`](https://github.com/serverless/serverless):

- Uses YAML syntax to deploy both the code and cloud infrastructure
- Single command to deploy the project to AWS

Thanks to [`@vendia/serverless-express`](https://github.com/vendia/serverless-express):

- Integrates [`express`](https://github.com/expressjs/express) with [`serverless framework`](https://github.com/serverless/serverless)

Thanks to [`jest`](https://github.com/facebook/jest) and [`supertest`](https://github.com/ladjs/supertest):

- End-to-end API testing
- Integration testing
- Unit testing

Thanks to [`swagger-ui-express`](https://github.com/scottie1984/swagger-ui-express):

- Automatically generated OpenAPI documentation page accessible under `/docs` endpoint

Thanks to [docker](https://docs.docker.com/get-docker/):

- Create local database instance (DynamoDB)

## Prerequisites

- [`node.js`](https://nodejs.org) with [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [yarn](https://yarnpkg.com/getting-started/install)
- [`serverless-framework`](https://github.com/serverless/serverless)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [`GitHub Account`](https://github.com) to create new GitHub project from this template repository.
- (Recommended) [Visual Studio Code IDE](https://code.visualstudio.com/download) to edit the project.
- [`AWS Account`](https://aws.amazon.com/) with programatic access and [`AWS CLI`](https://aws.amazon.com/cli/) configured locally for infrastructure and code deployment
- [Docker](https://docs.docker.com/get-docker/)

Follow the links to install required tools/frameworks/libraries.

## Installation

Clone the project:

```
git clone git@github.com:ttarnowski/serverless-product-api.git
```

Change directory to the one containing your newly cloned project:

```
cd serverless-product-api
```

Run:

```
npm install
```

or:

```
yarn
```

## Usage

To start project locally first start the docker local db instance:

```
npm run docker
```

or:

```
yarn docker
```

Then to start the project locally run:

```
npm run dev
```

or:

```
yarn dev
```

## OpenAPI Documentation Page

Once you have started the project locally you can visit: [http://localhost:3000/docs/](http://localhost:3000/docs/)
to see the documentation and to make HTTP requests to the API.

## Deployment to AWS

Run:

```
npm run deploy
```

or:

```
yarn deploy
```

## Running tests

Run:

```
npm test
```

or:

```
yarn test
```

## Troubleshooting

If project doesn't start with `npm run dev` / `yarn dev` right after cloning/downloading. Try to wait ~15 seconds and kill the process (CTRL+C) then start it again: `npm run dev` / `yarn dev`.

## Note

If you find this project useful consider giving the YouTube video a like / this project GitHub a star.

If you find an issue with the project don't hesitate reporting it in the [project issues tab](https://github.com/ttarnowski/serverless-product-api/issues) :)

Thank you for your support.
Tomasz.

## Licence

MIT.

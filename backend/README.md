## Usage

#### 1. Install the dependencies

```sh
npm install
```

#### 2. Setup the PostgreSQL database (using Docker)

```sh
npm run dev:services
docker run --detach --publish 5432:5432 -e POSTGRES_PASSWORD=postgres --name postgres postgres:10.5
```

#### 3. Start the server

To interact with the API in a GraphQL Playground, all you need to do is execute the `dev` script defined in the package.json:

```sh
npm run dev
```

#### 4. Run the tests

```sh
npm run test
```


#  Blockchain simple indexer 

## Getting Started

There are 3 main components in the project:
1. api: Fastify.js to provide REST access
2. db: PostgreSQL to store all indexed data
3. worker: indexer to crawl from blockchain then push to database

### Prerequisites

* docker
* docker-compose

## Usage

The Avalanche network was taken as an example for synchronization (C-chain)

We use docker-compose for testing this solution

```bash
docker-compose up
``` 

Some port will be open after that

| Service       | Port  |
| ------------- | ------|
| API           | 3011  |
| PostgreSQL    | 5439  |

### List of endpoints
#### Main
GET http://localhost:3011/transactions/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7 - list transactions made or received from a certain address sorted by blockNumber and transactionIndex

GET http://localhost:3011/transactions/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7/count - number of transactions made or received from a certain address

GET http://localhost:3011/transactions/top-values - list of transactions sorted by value (amount of $AVAX moved)

GET http://localhost:3011/top-balances - list of 100 addresses with largest balance that made or received a transaction

#### Additional
GET http://localhost:3011/health-check - just a test of the service

GET http://localhost:3011/stats - statistics of synchronization

GET http://localhost:3011/blocks - last block number in blockchain

#### Posman config-file
docs/postman

Synchronization of 10000 blocks usually takes 10-20 minutes
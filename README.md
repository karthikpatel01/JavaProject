# PayTabs POC - Banking System

This zip contains three projects:
- system2-corebank (Spring Boot, port 8082)
- system1-gateway (Spring Boot, port 8081)
- banking-ui (React + Vite, port 5173)

## Quick start (VSCode)

1. Open the repository root in VSCode.
2. Open three terminals.

Terminal 1 (System 2):
```
cd system2-corebank
mvn spring-boot:run
```

Terminal 2 (System 1):
```
cd system1-gateway
mvn spring-boot:run
```

Terminal 3 (Frontend):
```
cd banking-ui
npm install
npm run dev
```

Default accounts:
- Customer: cust1 / pass (card: 4123456789012345, PIN 1234)
- Admin: admin / admin

APIs:
- Gateway: POST http://localhost:8081/api/transaction
- Core: POST http://localhost:8082/api/process
- Core: GET http://localhost:8082/api/cards/{cardNumber}
- Core: GET http://localhost:8082/api/transactions


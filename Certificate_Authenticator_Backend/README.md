# CertificateAuthenticator

CertificateAuthenticator is a Spring Boot application for issuing, verifying, and downloading academic or official certificates using a blockchain-backed verification flow. It stores certificate metadata in PostgreSQL, saves certificate files locally, and records issuance on an Ethereum-compatible smart contract.

## Features

- Admin login with JWT-based authentication
- Certificate upload and metadata storage
- Local file storage for uploaded certificates
- Blockchain certificate issuance using Web3j
- Certificate verification by serial number
- Secure certificate download with a password validation flow
- Spring Security protection for API routes

## Tech Stack

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- Web3j for blockchain interaction
- JWT (jjwt)
- Maven

## Project Structure

```text
CertificateAuthenticator/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/pin/certificateauthenticator/
│   │   │       ├── config/
│   │   │       ├── Conroller/
│   │   │       ├── entity/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       ├── service/
│   │   │       └── util/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── uploads/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Java 21 or later
- Maven 3.9+
- PostgreSQL installed and running
- A Sepolia-compatible Ethereum node or Infura endpoint
- A deployed smart contract that exposes `issueCertificate` and `verifyCertificate`

## Configuration

Update the database, blockchain, and upload settings in `src/main/resources/application.properties`:

```properties
spring.application.name=CertificateAuthenticator

spring.datasource.url=jdbc:postgresql://localhost:5432/CertificateAuthenticator
spring.datasource.username=postgres
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

blockchain.node.url=https://sepolia.infura.io/v3/your_project_id
blockchain.contract.address=your_contract_address
blockchain.private.key=your_private_key

spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

file.upload-dir=./uploads
```

## Security Setup

The project currently uses an in-memory admin user for local testing:

- Username: `admin123`
- Password: `pinsara`

JWT tokens are generated after successful login and used to protect non-public endpoints.

> Note: For production, replace the hardcoded credentials and secret handling with a more secure configuration and a proper user store.

## Running the Application

From the project root:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The application will start on the default Spring Boot port:

```text
http://localhost:8080
```

## API Endpoints

### 1. Admin Login

Endpoint:

```http
POST /api/auth/login
```

Request parameters:

- `username`
- `password`

Example:

```bash
curl -X POST "http://localhost:8080/api/auth/login?username=admin123&password=pinsara"
```

Response:

```text
<jwt_token>
```

### 2. Save Certificate

Endpoint:

```http
POST /api/certificate/save
```

Requires:

- JWT token in the Authorization header
- Admin role access

Example:

```bash
curl -X POST "http://localhost:8080/api/certificate/save" \
  -H "Authorization: Bearer <jwt_token>" \
  -F "file=@certificate.pdf" \
  -F "studentFullName=John Doe" \
  -F "studentId=STU-001" \
  -F "nic=200012345678" \
  -F "certificateSerialNumber=CS-1001" \
  -F "course=Computer Science"
```

This saves the uploaded file locally and issues the certificate on the blockchain.

### 3. Verify Certificate

Endpoint:

```http
GET /api/certificate/verify?serialNumber=CS-1001
```

Example:

```bash
curl "http://localhost:8080/api/certificate/verify?serialNumber=CS-1001"
```

Response example:

```json
{
  "nic": "200012345678",
  "isValid": true
}
```

### 4. Download Certificate

Endpoint:

```http
POST /api/certificate/download
```

Request parameters:

- `serialNumber`
- `password`

Example:

```bash
curl -X POST "http://localhost:8080/api/certificate/download?serialNumber=CS-1001&password=your_generated_password"
```

This returns the actual certificate file if the serial number and password match the stored record.

## Database Model

The application stores certificate metadata in the `certificates_details` table.

Main fields:

- `id`
- `studentFullName`
- `studentId`
- `nic`
- `certificateSerialNumber`
- `certificateUrl`
- `issueDate`
- `course`
- `password`

## Blockchain Integration

This app uses Web3j to interact with an Ethereum smart contract through:

- `blockchain.node.url`
- `blockchain.contract.address`
- `blockchain.private.key`

The smart contract is expected to implement methods such as:

- `issueCertificate(string serialNumber, string nic)`
- `verifyCertificate(string serialNumber)`

The app returns the transaction hash when certificate issuance succeeds.

## Local File Storage

Uploaded certificate files are saved under the configured folder:

```text
./uploads
```

This directory is created automatically when the app starts.

## Notes

- The project currently permits all certificate and auth endpoints for testing convenience.
- CORS is configured for local frontend development on `http://localhost:5173`.
- This is a practical demo application and should be hardened before production use.

## Troubleshooting

### PostgreSQL connection issues

- Ensure PostgreSQL is running.
- Confirm the database name, username, and password in `application.properties`.

### Blockchain errors

- Confirm the Infura endpoint is valid.
- Verify the contract address is correct.
- Ensure the wallet private key has enough funds for transaction gas.

### File upload issues

- Check the upload directory permissions.
- Confirm the file size is within the configured `10MB` limit.

## License

This project is provided as-is for educational and demonstration purposes.

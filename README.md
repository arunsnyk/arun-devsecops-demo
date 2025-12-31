# Arun – DevSecOps Demo

This repository demonstrates an end-to-end DevSecOps pipeline using:

- Jenkins
- Docker
- Snyk Open Source
- Snyk Container
- Docker Hub
- Nexus

## Pipeline Flow
1. Scan source code using Snyk
2. Build Docker image
3. Push image to Docker Hub & Nexus
4. Scan image using Snyk Container
5. Results pushed to Snyk UI

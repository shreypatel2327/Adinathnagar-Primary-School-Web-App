# # Build Stage
# FROM maven:3.8.5-openjdk-17-slim AS build
# WORKDIR /app
# COPY pom.xml .
# COPY src ./src
# RUN mvn clean package -DskipTests

# # Run Stage
# FROM openjdk:17-jdk-slim
# WORKDIR /app
# COPY --from=build /app/target/school-backend-*.jar app.jar
# EXPOSE 9995
# ENTRYPOINT ["java", "-jar", "app.jar"]


# Stage 1: Build the application
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy entire source code
COPY src ./src

# Build running package
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: Light-weight runtime environment
FROM eclipse-temurin:17-jre
WORKDIR /app

# Directly copy using wildcard from target folder into app.jar
COPY --from=build /app/target/school-backend-*.jar app.jar

EXPOSE 9995

ENTRYPOINT ["java", "-jar", "app.jar"]
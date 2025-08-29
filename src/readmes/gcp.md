# Google Cloud Platform (GCP) Interview Questions

## Table of Contents
1. [Core Services Comparison](#core-services-comparison)
2. [Compute Services](#compute-services)
3. [Application Deployment](#application-deployment)
4. [App Engine Environments](#app-engine-environments)
5. [Serverless Compute](#serverless-compute)
6. [Storage Services](#storage-services)
7. [Identity and Access Management (IAM)](#identity-and-access-management-iam)
8. [Networking](#networking)
9. [Virtual Machines](#virtual-machines)
10. [Database Services](#database-services)
11. [Data Integration](#data-integration)
12. [Big Data & Analytics](#big-data--analytics)
13. [Monitoring and Logging](#monitoring-and-logging)
14. [Load Balancing](#load-balancing)
15. [Content Delivery](#content-delivery)
16. [CI/CD Pipeline](#cicd-pipeline)
17. [Kubernetes (GKE)](#kubernetes-gke)
18. [Security](#security)

## 1. Core Services Comparison {#core-services-comparison}

**Question:** What are the core services offered by GCP, and how do they compare to AWS and Azure?

**Hint:** Discuss the major service categories (Compute, Storage, Networking, Big Data, Machine Learning, etc.) for each provider. Focus on GCP's unique strengths, such as its leadership in Kubernetes, data analytics, and global network infrastructure. Highlight how each provider has a different history and focus, with AWS being the market leader with a vast service catalog, Azure integrating with the Microsoft ecosystem, and GCP excelling in open-source and data-centric services.

## 2. Compute Services {#compute-services}

**Question:** Explain the difference between Compute Engine, App Engine, Cloud Run, and GKE. When would you use each?

**Hint:** This question tests your understanding of the different abstraction levels in GCP's compute services.
- Compute Engine: Infrastructure as a Service (IaaS). You manage the VM. Use when you need full control over the OS and environment.
- App Engine: Platform as a Service (PaaS). You deploy your code, and GCP manages the underlying infrastructure. Best for web applications with a focus on developer productivity.
- Cloud Run: Serverless Container platform. You package your application in a container, and GCP handles scaling, infrastructure, and server management. Ideal for stateless microservices and APIs.
- GKE (Google Kubernetes Engine): Container as a Service (CaaS). Managed Kubernetes for orchestrating containers at scale. Use for complex, multi-container applications that require fine-grained control over container orchestration.

## 3. Application Deployment {#application-deployment}

**Question:** How do you deploy a containerized FastAPI/Flask app on Cloud Run?

**Hint:** Describe the process:
- Containerize your app using a Dockerfile.
- Build the Docker image and push it to a container registry (like Artifact Registry).
- Use the gcloud run deploy command, pointing to your image.
- Mention key considerations like setting environment variables and permissions.

## 4. App Engine Environments {#app-engine-environments}

**Question:** What’s the difference between App Engine Standard and App Engine Flexible?

**Hint:** Focus on the key distinctions:
- Standard Environment: Sandboxed environment, fast scaling to zero, pay-per-request, limited language runtimes, no SSH access.
- Flexible Environment: Runs your app in a Docker container on a Compute Engine VM, slower to scale, always-on instance, wider range of language runtimes, SSH access available.

## 5. Serverless Compute {#serverless-compute}

**Question:** How does Cloud Functions differ from Cloud Run?

**Hint:** This is a classic serverless comparison.
- Cloud Functions: Function as a Service (FaaS). Event-driven, single-purpose functions that run in response to triggers. You deploy code, not a container.
- Cloud Run: Serverless Containers. You deploy a container image. More flexible than Cloud Functions as it's not restricted to a single function or event trigger. Ideal for web services and APIs.

## 6. Storage Services {#storage-services}

**Question:** How does Cloud Storage compare to Persistent Disk and Filestore?

**Hint:** Differentiate between object, block, and file storage.
- Cloud Storage: Object storage. Highly scalable, globally accessible, and durable. Use for unstructured data, backups, archives, and serving static content.
- Persistent Disk: Block storage for Compute Engine VMs. Acts like a physical disk attached to a VM instance. Ideal for databases or application data that requires low latency and high IOPS.
- Filestore: Managed file storage (NFS). Provides a shared file system. Use for applications that require a shared file system interface, like content management systems or machine learning workloads.

## 7. Identity and Access Management (IAM) {#identity-and-access-management-iam}

**Question 1:** How do you set up IAM roles and permissions in GCP?

**Hint:** Explain the concept of IAM in GCP. A policy consists of a principal (who), a role (what), and a resource (where). Describe the types of roles (primitive, predefined, and custom) and how to grant them at the project, folder, or organization level.

**Question 2:** What’s the difference between service accounts and user accounts in GCP?

**Hint:** A user account represents a human end-user. A service account is an identity used by an application or a Compute Engine VM to make authorized API calls. Service accounts don't have passwords; they are authenticated using private keys.

## 8. Networking {#networking}

**Question:** How does VPC networking work in GCP, and what’s the difference between subnets and firewall rules?

**Hint:**
- VPC (Virtual Private Cloud): A global, private network for your GCP resources. It's not tied to a single region.
- Subnet: A regional, logical division of your VPC. Resources like VMs are created within a specific subnet.
- Firewall Rules: Network-level rules that control ingress and egress traffic to and from your VM instances. They are stateful and applied to the entire VPC network.

## 9. Virtual Machines {#virtual-machines}

**Question:** What are preemptible VMs in Compute Engine, and when would you use them?

**Hint:** Preemptible VMs are short-lived, low-cost VMs that can be terminated (preempted) by Google at any time, typically within 24 hours. They are ideal for fault-tolerant, batch-processing workloads where the application can handle interruptions, such as big data processing jobs or stateless compute tasks.

## 10. Database Services {#database-services}

**Question 1:** How does Cloud SQL differ from BigQuery and Firestore?

**Hint:** This question is about choosing the right database for the job.
- Cloud SQL: Managed relational database (MySQL, PostgreSQL, SQL Server). Best for transactional workloads (OLTP) that require a traditional SQL database.
- BigQuery: Serverless, petabyte-scale data warehouse. Designed for analytics and large-scale data analysis (OLAP). It uses a columnar storage format and a distributed query engine.
- Firestore: NoSQL document database. Excellent for mobile, web, and serverless applications that need a flexible, highly scalable database with real-time synchronization.

**Question 2:** How do you integrate a Python/Django backend with Cloud SQL?

**Hint:** Describe the steps, including:
- Creating a Cloud SQL instance.
- Using the Cloud SQL Python connector (e.g., pg8000 for PostgreSQL).
- Configuring the Django settings (DATABASES dictionary) with the connection string.
- Discuss using the Cloud SQL Auth Proxy to securely connect from local development and from other GCP services.

## 11. Data Integration {#data-integration}

**Question:** How does Cloud Pub/Sub work, and what are some use cases?

**Hint:** Explain the publish-subscribe messaging service model.
- Publishers: Send messages to a topic.
- Subscribers: Create a subscription to receive messages from a topic.
- Use Cases: Real-time data ingestion from IoT devices, event-driven microservices architectures, decoupling services, and asynchronous task processing.

## 12. Big Data & Analytics {#big-data--analytics}

**Question:** What is BigQuery, and how is it optimized for analytics?

**Hint:** BigQuery is a serverless, highly scalable, and cost-effective data warehouse.
- Optimization Features:
  - Columnar Storage: Stores data in columns instead of rows, which is highly efficient for analytical queries that often select specific columns.
  - Distributed Query Engine: Automatically parallelizes queries across thousands of machines.
  - Separation of Compute and Storage: This allows you to scale storage and compute independently, and you only pay for the queries you run.

## 13. Monitoring and Logging {#monitoring-and-logging}

**Question:** How do you monitor applications with **Cloud Logging** and **Cloud Monitoring**?

- **Cloud Logging:** Collect/store logs, export to BigQuery, create log-based metrics.
- **Cloud Monitoring:** Collect metrics, create dashboards, alerts, SLIs.

## 14. Load Balancing {#load-balancing}

**Question:** How do you configure load balancing in GCP?

- **Global LB:** Multi-region distribution with anycast IP. (Web traffic, global apps).
- **Regional LB:** Only within one region.
- Types: HTTP(S), TCP/UDP, Internal LB.

## 15. Content Delivery {#content-delivery}

**Question:** How does **Cloud CDN** help React frontend applications?

- Caches static assets (JS, CSS, images) at edge locations.
- Improves latency, reduces origin load.

 

## 16. CI/CD Pipeline {#cicd-pipeline}

**Question:** How do you set up a pipeline with **Cloud Build + Cloud Deploy**?

- **Cloud Build:** Continuous Integration (build, test, containerize code).
- **Cloud Deploy:** Continuous Delivery (automated deployment to dev/stage/prod).

 

## 17. Kubernetes (GKE) {#kubernetes-gke}

**Question:** What is **GKE**, and how do you scale applications?

- Managed Kubernetes clusters.
- Scaling types:
    - **HPA:** Scale pods.
    - **VPA:** Adjust pod resource limits.
    - **Cluster Autoscaler:** Add/remove nodes.

 

## 18. Security {#security}

**Question:** How do you secure a GCP environment?

- **IAM:** Apply least privilege.
- **VPC Service Controls:** Create security perimeters.
- **Secrets Manager:** Store API keys, passwords, and secrets securely.

## 📌 Conclusion

This set of GCP interview questions provides coverage across compute, storage, networking, databases, analytics, CI/CD, Kubernetes, and security—helping candidates demonstrate both practical skills and architectural understanding of Google Cloud Platform.


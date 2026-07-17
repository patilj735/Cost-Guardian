# 🛡️ AWS Cost Guardian

> Automated AWS EC2 cost optimization platform that identifies eligible EC2 instances and automatically stops unused resources based on configurable tags.

AWS Cost Guardian is a serverless cloud cost optimization application built using AWS Lambda, Amazon EC2, Amazon EventBridge Scheduler, Amazon SNS, Amazon API Gateway, and Amazon S3.

The system automatically identifies EC2 instances tagged with `AutoStop=true`, stops them according to a schedule, and sends an email notification through Amazon SNS.

It also provides a professional web dashboard for monitoring EC2 resources and manually triggering optimization.

---

## 🌐 Live Application

🚀 **Access the live application:**

👉 **[AWS Cost Guardian Dashboard](http://aws-cost-guardian-s3.s3-website.ap-south-1.amazonaws.com)**

---

## 📸 Screenshots

### 🖥️ Cost Guardian Dashboard

![AWS Cost Guardian Dashboard](https://github.com/user-attachments/assets/7342d24a-b368-4898-b6c6-f47131557368)

### ⚡ EC2 Resource Monitoring

![EC2 Resource Monitoring](https://github.com/user-attachments/assets/cc6e7a1a-fcd0-440d-8d77-72d6a6861cca)

### 🛡️ Optimization Activity

![Optimization Activity](https://github.com/user-attachments/assets/b27e922d-5dfb-4df4-bcc0-140cf031ac15)

> You can upload screenshots directly while editing the README on GitHub by dragging and dropping them into the editor. GitHub will automatically generate the image URL.

---

## 🚀 Features

* 📊 Real-time EC2 instance monitoring
* ⚡ Automated EC2 cost optimization
* 🏷️ Tag-based resource management
* 🛡️ Protected production instances
* ⏰ Scheduled automation using EventBridge Scheduler
* 📧 SNS email notifications
* 🖥️ Manual optimization from the web dashboard
* 🔄 Live infrastructure status updates
* 🌐 Serverless API architecture
* 📱 Responsive dashboard UI

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │   S3 Static Website   │
                    │  Cost Guardian UI     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    API Gateway       │
                    │     HTTP API         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      AWS Lambda       │
                    │   CostGuardianAPI     │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
              ┌───────────┐          ┌───────────┐
              │    EC2    │          │    SNS    │
              │ Resources │          │  Alerts   │
              └───────────┘          └───────────┘


        EventBridge Scheduler
                │
                ▼
        CostGuardian Lambda
                │
                ▼
        Find AutoStop=true
                │
                ▼
          Stop EC2 Instance
                │
                ▼
          SNS Notification
```

---

## 🛠️ AWS Services Used

| AWS Service                      | Purpose                           |
| -------------------------------- | --------------------------------- |
| **Amazon S3**                    | Hosts the static web dashboard    |
| **Amazon API Gateway**           | Provides HTTP API endpoints       |
| **AWS Lambda**                   | Executes cost optimization logic  |
| **Amazon EC2**                   | Resources monitored and optimized |
| **Amazon EventBridge Scheduler** | Triggers automated optimization   |
| **Amazon SNS**                   | Sends email notifications         |

---

## 🔄 How It Works

1. The dashboard fetches the current EC2 infrastructure status through API Gateway.
2. AWS Lambda identifies EC2 instances tagged with `AutoStop=true`.
3. The scheduled EventBridge automation triggers the optimization Lambda.
4. Eligible EC2 instances are automatically stopped.
5. Production instances remain protected through configurable tags.
6. Amazon SNS sends a notification about the optimization activity.

---

## 🔐 Resource Protection

AWS Cost Guardian uses EC2 tags to control automation behavior.

```text
AutoStop=true
```

Only instances marked with this tag are eligible for automatic stopping.

Production resources can remain protected by excluding them from the automation process.

---

## 🧰 Technology Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** AWS Lambda
* **API:** Amazon API Gateway
* **Compute:** Amazon EC2
* **Automation:** Amazon EventBridge Scheduler
* **Notifications:** Amazon SNS
* **Hosting:** Amazon S3

---

## 👩‍💻 Author

**Janhavi Patil**



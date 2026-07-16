# 🛡️ AWS Cost Guardian

> Automated AWS EC2 cost optimization platform that identifies eligible EC2 instances and automatically stops unused resources based on configurable tags.

AWS Cost Guardian is a serverless cloud cost optimization application built using AWS Lambda, Amazon EC2, Amazon EventBridge Scheduler, Amazon SNS, Amazon API Gateway, and Amazon S3.

The system automatically identifies EC2 instances tagged with `AutoStop=true`, stops them according to a schedule, and sends an email notification through Amazon SNS.

It also provides a professional web dashboard for monitoring EC2 resources and manually triggering optimization.

---

## 🚀 Features

- 📊 Real-time EC2 instance monitoring
- ⚡ Automated EC2 cost optimization
- 🏷️ Tag-based resource management
- 🛡️ Protected production instances
- ⏰ Scheduled automation using EventBridge Scheduler
- 📧 SNS email notifications
- 🖥️ Manual optimization from the web dashboard
- 🔄 Live infrastructure status updates
- 🌐 Serverless API architecture
- 📱 Responsive dashboard UI

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
                    │  HTTP API            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   AWS Lambda         │
                    │  CostGuardianAPI     │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
              ┌───────────┐          ┌───────────┐
              │   EC2     │          │    SNS    │
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
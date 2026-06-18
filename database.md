User
├── id
├── name
├── email
├── password
├── readiness_score
└── created_at
Resume
├── id
├── user_id
├── file_url
├── extracted_text
├── detected_skills
├── strengths
├── weaknesses
├── target_role
└── uploaded_at

Interview
├── id
├── user_id
├── role
├── difficulty
├── question_count
├── score
├── status
└── created_at

Question
├── id
├── interview_id
├── question_text
└── topic

Answer
├── id
├── question_id
├── answer_text
├── score
└── feedback

API FLOW
Signup
↓
Create User

Login
↓
Verify User

Upload Resume
↓
Store Resume

Analyze Resume
↓
Store Analysis

Start Interview
↓
Generate Questions

Submit Interview
↓
Evaluate Answers

View Dashboard
↓
Fetch User Statistics

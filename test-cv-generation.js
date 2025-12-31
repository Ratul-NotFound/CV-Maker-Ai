// Test script for the new CV generation system
// Run with: node test-cv-generation.js

import { generateCVHTML } from './src/lib/groq.js';

const sampleFormData = {
  personalInfo: {
    fullName: "Dr. Sarah Johnson",
    professionalTitle: "Senior Software Engineer & AI Researcher",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/sarahjohnson",
    website: "www.sarahjohnson.dev",
    github: "github.com/sarahjohnson",
    orcid: "0000-0002-1234-5678",
    address: "123 Tech Street",
    city: "San Francisco",
    country: "United States",
    postalCode: "94102",
    nationality: "American",
    dob: "1990-05-15",
    summary: "Innovative software engineer with 8+ years of experience in AI/ML systems, full-stack development, and cloud architecture. Passionate about building scalable solutions that make a real-world impact. Published researcher with expertise in deep learning and natural language processing."
  },
  
  experience: [
    {
      position: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2020-01",
      current: true,
      description: "Lead development of AI-powered recommendation systems serving 10M+ users. Architected microservices infrastructure reducing latency by 40%. Mentored team of 5 junior engineers."
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      location: "Austin, TX",
      startDate: "2017-06",
      endDate: "2019-12",
      description: "Built full-stack applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with product team on feature development."
    }
  ],
  
  education: [
    {
      degree: "Ph.D.",
      field: "Computer Science",
      institution: "Stanford University",
      graduationYear: "2022",
      grade: "4.0 GPA",
      thesis: "Deep Learning Approaches for Natural Language Understanding"
    },
    {
      degree: "M.S.",
      field: "Computer Science",
      institution: "MIT",
      graduationYear: "2017",
      grade: "3.9 GPA"
    },
    {
      degree: "B.S.",
      field: "Computer Engineering",
      institution: "UC Berkeley",
      graduationYear: "2015",
      grade: "Summa Cum Laude"
    }
  ],
  
  skills: {
    technical: ["Python", "JavaScript", "TypeScript", "React", "Node.js", "TensorFlow", "PyTorch", "Docker", "Kubernetes", "AWS", "GCP"],
    soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Project Management", "Mentoring"],
    tools: ["Git", "VS Code", "Jira", "Figma", "PostgreSQL", "MongoDB", "Redis", "Jenkins", "CircleCI"]
  },
  
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Professional Working Proficiency" },
    { name: "Mandarin", level: "Limited Working Proficiency" }
  ],
  
  projects: [
    {
      name: "AI Chat Assistant",
      description: "Open-source conversational AI assistant using GPT-4 and RAG. 2.5K+ GitHub stars.",
      link: "github.com/sarahjohnson/ai-chat",
      technologies: ["Python", "LangChain", "FastAPI", "React", "PostgreSQL"]
    },
    {
      name: "Real-time Analytics Dashboard",
      description: "Live data visualization platform processing 1M+ events per second.",
      link: "www.sarahjohnson.dev/analytics",
      technologies: ["Node.js", "Redis", "D3.js", "WebSocket", "Docker"]
    }
  ],
  
  certifications: [
    {
      title: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      date: "2023-03",
      credentialId: "AWS-PSA-12345"
    },
    {
      title: "Google Cloud Professional ML Engineer",
      issuer: "Google Cloud",
      date: "2022-11",
      credentialId: "GCP-MLE-67890"
    }
  ],
  
  publications: [
    {
      title: "Transformer-based Models for Domain-Specific Text Classification",
      authors: "S. Johnson, M. Chen, R. Patel",
      journal: "NeurIPS 2023",
      year: "2023",
      link: "https://neurips.cc/paper/2023/12345"
    },
    {
      title: "Efficient Training Strategies for Large Language Models",
      authors: "S. Johnson, A. Kumar",
      journal: "ICML 2022",
      year: "2022",
      link: "https://icml.cc/paper/2022/67890"
    }
  ]
};

async function testCVGeneration() {
  console.log("🚀 Testing Enhanced CV Generation System\n");
  console.log("=" .repeat(60));
  
  const cvTypes = ["modern", "europass", "scopus", "creative", "executive"];
  const industries = ["technology", "finance", "healthcare"];
  
  for (const cvType of cvTypes) {
    console.log(`\n📄 Testing ${cvType.toUpperCase()} CV Type:`);
    console.log("-".repeat(60));
    
    try {
      const startTime = Date.now();
      const cvHtml = await generateCVHTML(sampleFormData, cvType, "technology");
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      // Validation checks
      const checks = {
        "Has DOCTYPE": cvHtml.includes("<!DOCTYPE"),
        "Has closing HTML tag": cvHtml.includes("</html>"),
        "Has embedded CSS": cvHtml.includes("<style>"),
        "Contains candidate name": cvHtml.toLowerCase().includes("sarah"),
        "Minimum length (3000+ chars)": cvHtml.length >= 3000,
        "Has experience section": cvHtml.toLowerCase().includes("experience"),
        "Has education section": cvHtml.toLowerCase().includes("education"),
        "Has skills section": cvHtml.toLowerCase().includes("skill"),
      };
      
      console.log(`\n✅ Generation successful in ${duration}s`);
      console.log(`📏 Length: ${cvHtml.length.toLocaleString()} characters`);
      console.log("\n🔍 Validation Checks:");
      
      Object.entries(checks).forEach(([check, passed]) => {
        console.log(`  ${passed ? '✓' : '✗'} ${check}`);
      });
      
      const allPassed = Object.values(checks).every(v => v);
      console.log(`\n${allPassed ? '✅ All checks passed!' : '⚠️  Some checks failed'}`);
      
    } catch (error) {
      console.log(`\n❌ Generation failed: ${error.message}`);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Test complete!");
}

// Run the test
testCVGeneration().catch(console.error);

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralNetworkBackground from './NeuralNetworkBackground';
import { useAuth } from '@/context/AuthContext';
import PricingModal from './PricingModal';

const CVForm = ({ onCVGenerated }) => {
  const { user, userData } = useAuth();
  const [showPricing, setShowPricing] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- STATE ---
  const [formData, setFormData] = useState({
    personalInfo: { 
        fullName: '', email: '', phone: '', professionalTitle: '', 
        linkedin: '', website: '', github: '', orcid: '', 
        address: '', city: '', country: '', postalCode: '', 
        nationality: '', dob: '', summary: '' 
    },
    experience: [], 
    education: [], 
    skills: { technical: [], soft: [], tools: [] },
    languages: [], 
    projects: [], 
    certifications: [], 
    publications: []
  });

  const [cvType, setCvType] = useState('modern');
  const [industry, setIndustry] = useState('technology');
  const [activeStep, setActiveStep] = useState(0);
  const [tempSkill, setTempSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('technical');

  // --- CONFIG ---
  const industries = ['technology', 'finance', 'healthcare', 'education', 'marketing', 'engineering', 'law', 'creative', 'research', 'consulting'];
  const steps = [
    { id: 0, label: 'Profile', icon: '👤' }, 
    { id: 1, label: 'Work', icon: '💼' },
    { id: 2, label: 'Education', icon: '🎓' }, 
    { id: 3, label: 'Skills', icon: '⚡' },
    { id: 4, label: 'Extras', icon: '🏆' }, 
    { id: 5, label: 'Generate', icon: '🚀' }
  ];
  
  const cvStyles = [
    { id: 'modern', label: 'Modern', icon: '🚀', desc: 'ATS Optimized' }, 
    { id: 'europass', label: 'Europass', icon: '🇪🇺', desc: 'Official EU Standard' },
    { id: 'scopus', label: 'Scopus', icon: '📜', desc: 'Academic/Research' }, 
    { id: 'creative', label: 'Creative', icon: '🎨', desc: 'Unique Designer' },
    { id: 'executive', label: 'Executive', icon: '👔', desc: 'C-Level / VP' }
  ];

  // --- HANDLERS ---
  const handleInputChange = (sec, field, val, idx = null) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (idx !== null) { 
          if (!newData[sec][idx]) newData[sec][idx] = {};
          newData[sec][idx][field] = val; 
      } else { 
          newData[sec][field] = val; 
      }
      return newData;
    });
  };

  const addExperience = () => setFormData(p => ({...p, experience: [...p.experience, { company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false }]}));
  const removeExperience = (i) => setFormData(p => ({...p, experience: p.experience.filter((_, x) => x !== i)}));
  
  // Updated Education Handler for Detailed Fields
  const addEducation = () => setFormData(p => ({...p, education: [...p.education, { institution: '', degree: '', field: '', grade: '', startDate: '', endDate: '', thesis: '' }]}));
  const removeEducation = (i) => setFormData(p => ({...p, education: p.education.filter((_, x) => x !== i)}));

  const addProject = () => setFormData(p => ({...p, projects: [...p.projects, { name: '', link: '', description: '' }]}));
  const removeProject = (i) => setFormData(p => ({...p, projects: p.projects.filter((_, x) => x !== i)}));
  
  const addPub = () => setFormData(p => ({...p, publications: [...p.publications, { title: '', year: '', journal: '' }]}));
  const removePub = (i) => setFormData(p => ({...p, publications: p.publications.filter((_, x) => x !== i)}));

  const addLang = () => setFormData(p => ({...p, languages: [...p.languages, { language: '', proficiency: 'Professional' }]}));
  const removeLang = (i) => setFormData(p => ({...p, languages: p.languages.filter((_, x) => x !== i)}));

  const addSkill = () => {
    if (!tempSkill.trim()) return;
    setFormData(p => ({ ...p, skills: { ...p.skills, [skillCategory]: [...(p.skills[skillCategory] || []), tempSkill.trim()] } }));
    setTempSkill('');
  };
  const removeSkill = (cat, idx) => setFormData(p => ({ ...p, skills: { ...p.skills, [cat]: p.skills[cat].filter((_, i) => i !== idx) } }));

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?.isPro && (userData?.tokens || 0) <= 0) { setShowPricing(true); return; }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, cvType, userId: user?.uid, industry }),
      });
      
      const data = await response.json();
      if (data.success) onCVGenerated(data.cvHtml);
      else if (response.status === 403) setShowPricing(true);
      else alert(data.message || "Generation Error");
    } catch (error) { 
        console.error(error); 
        alert('Network Connection Error.'); 
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto p-4 md:p-6 min-h-screen flex flex-col">
      <NeuralNetworkBackground />

      {/* HEADER */}
      <div className="relative z-10 mb-6 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight text-center md:text-left">AI CV Studio</h2>
          <p className="text-white/60 text-sm text-center md:text-left font-medium">World-Class Professional Resume Architect</p>
        </div>
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="text-right mr-2">
             <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Balance</span>
             <div className={`text-xl font-black ${userData?.tokens > 0 || userData?.isPro ? 'text-ai-primary' : 'text-red-500'}`}>
               {userData?.isPro ? 'UNLIMITED' : `${userData?.tokens || 0} CREDITS`}
             </div>
          </div>
          {!userData?.isPro && <button type="button" onClick={() => setShowPricing(true)} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-lg shadow-lg hover:opacity-90 transition-all">+ Credits</button>}
        </div>
      </div>

      {/* MAIN FORM CONTAINER */}
      <div className="relative z-10 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        {/* TABS */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-black/20 no-scrollbar">
          {steps.map((step) => (
            <button key={step.id} onClick={() => setActiveStep(step.id)} className={`flex-1 min-w-[100px] py-5 text-center transition-all relative group ${activeStep === step.id ? 'text-white bg-white/5' : 'text-white/40 hover:text-white/70'}`}>
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{step.icon}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">{step.label}</div>
              {activeStep === step.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 flex-1 overflow-y-auto">
          
          {/* 0: PROFILE (Detailed for International Standards) */}
          {activeStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="section-title">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="label">Full Name</label>
                    <input className="input-glass" value={formData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} required placeholder="e.g. John Doe" />
                </div>
                <div>
                    <label className="label">Target Job Title</label>
                    <input className="input-glass" value={formData.personalInfo.professionalTitle} onChange={(e) => handleInputChange('personalInfo', 'professionalTitle', e.target.value)} required placeholder="e.g. Senior Software Engineer" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div><label className="label">Email</label><input placeholder="email@example.com" className="input-glass" value={formData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} required /></div>
                <div><label className="label">Phone</label><input placeholder="+1 234 567 890" className="input-glass" value={formData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} /></div>
                <div><label className="label">Nationality (Europass)</label><input placeholder="e.g. American" className="input-glass" value={formData.personalInfo.nationality} onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)} /></div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2"><label className="label">Address</label><input placeholder="Street Address" className="input-glass" value={formData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} /></div>
                <div><label className="label">City</label><input placeholder="City" className="input-glass" value={formData.personalInfo.city} onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)} /></div>
                <div><label className="label">Country</label><input placeholder="Country" className="input-glass" value={formData.personalInfo.country} onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)} /></div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="label">Date of Birth</label><input type="date" className="input-glass text-white/80" value={formData.personalInfo.dob} onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)} /></div>
                <div><label className="label">Postal Code</label><input placeholder="Zip Code" className="input-glass" value={formData.personalInfo.postalCode} onChange={(e) => handleInputChange('personalInfo', 'postalCode', e.target.value)} /></div>
                <div><label className="label">ORCID / Research ID</label><input placeholder="For Scopus CVs" className="input-glass" value={formData.personalInfo.orcid} onChange={(e) => handleInputChange('personalInfo', 'orcid', e.target.value)} /></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="label">LinkedIn</label><input placeholder="linkedin.com/in/username" className="input-glass" value={formData.personalInfo.linkedin} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} /></div>
                <div><label className="label">Portfolio / Website</label><input placeholder="https://yourportfolio.com" className="input-glass" value={formData.personalInfo.website} onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)} /></div>
              </div>
              
              <div>
                  <label className="label">Professional Summary</label>
                  <textarea placeholder="A compelling summary of your experience, key skills, and career goals..." className="input-glass w-full h-32" value={formData.personalInfo.summary} onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)} />
              </div>
            </div>
          )}

          {/* 1: WORK EXPERIENCE */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="section-title">Work Experience</h3>
              {formData.experience.map((exp, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl relative border border-white/10 group hover:border-white/20 transition-all">
                  <button type="button" onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-white/40 hover:text-red-400 p-2">✕</button>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div><label className="label">Company</label><input placeholder="Company Name" className="input-glass font-bold" value={exp.company} onChange={(e) => handleInputChange('experience', 'company', e.target.value, i)} /></div>
                    <div><label className="label">Job Title</label><input placeholder="Job Title" className="input-glass font-bold" value={exp.position} onChange={(e) => handleInputChange('experience', 'position', e.target.value, i)} /></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div><label className="label">Location</label><input placeholder="City, Country" className="input-glass" value={exp.location} onChange={(e) => handleInputChange('experience', 'location', e.target.value, i)} /></div>
                    <div><label className="label">Start Date</label><input type="month" className="input-glass text-white/70" value={exp.startDate} onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, i)} /></div>
                    <div><label className="label">End Date</label><input type="month" className="input-glass text-white/70" value={exp.endDate} onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, i)} /></div>
                  </div>
                  <div><label className="label">Description (Bullet points recommended)</label><textarea placeholder="• Achieved X by doing Y&#10;• Led a team of Z people&#10;• Technologies used..." className="input-glass w-full h-32 font-mono text-sm leading-relaxed" value={exp.description} onChange={(e) => handleInputChange('experience', 'description', e.target.value, i)} /></div>
                </div>
              ))}
              <button type="button" onClick={addExperience} className="add-btn w-full py-4 text-center border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all text-white/50 hover:text-white font-bold tracking-widest uppercase text-sm">+ Add Position</button>
            </div>
          )}

          {/* 2: EDUCATION (Detailed) */}
          {activeStep === 2 && (
             <div className="space-y-6 animate-fadeIn">
               <h3 className="section-title">Education</h3>
               {formData.education.map((edu, i) => (
                 <div key={i} className="p-6 bg-white/5 rounded-2xl relative border border-white/10">
                   <button type="button" onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-white/20 hover:text-red-400">✕</button>
                   
                   <div className="grid md:grid-cols-2 gap-4 mb-4">
                     <div><label className="label">Institution / University</label><input placeholder="University Name" className="input-glass" value={edu.institution} onChange={(e) => handleInputChange('education', 'institution', e.target.value, i)} /></div>
                     <div><label className="label">Degree Type</label><input placeholder="e.g. Bachelor of Science" className="input-glass" value={edu.degree} onChange={(e) => handleInputChange('education', 'degree', e.target.value, i)} /></div>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-4 mb-4">
                     <div><label className="label">Field of Study / Major</label><input placeholder="e.g. Computer Science" className="input-glass" value={edu.field} onChange={(e) => handleInputChange('education', 'field', e.target.value, i)} /></div>
                     <div><label className="label">Grade / GPA / Result</label><input placeholder="e.g. 3.8/4.0 or First Class" className="input-glass" value={edu.grade} onChange={(e) => handleInputChange('education', 'grade', e.target.value, i)} /></div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-4 mb-4">
                     <div><label className="label">Start Year</label><input type="month" className="input-glass text-white/70" value={edu.startDate} onChange={(e) => handleInputChange('education', 'startDate', e.target.value, i)} /></div>
                     <div><label className="label">Graduation Year</label><input type="month" className="input-glass text-white/70" value={edu.endDate} onChange={(e) => handleInputChange('education', 'endDate', e.target.value, i)} /></div>
                   </div>

                   <div><label className="label">Thesis / Key Modules (Optional)</label><input placeholder="Thesis Title or relevant coursework" className="input-glass" value={edu.thesis} onChange={(e) => handleInputChange('education', 'thesis', e.target.value, i)} /></div>
                 </div>
               ))}
               <button type="button" onClick={addEducation} className="add-btn w-full py-4 text-center border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all text-white/50 hover:text-white font-bold tracking-widest uppercase text-sm">+ Add Education</button>
             </div>
          )}

          {/* 3: SKILLS (Fixed Layout) */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="section-title">Professional Skills</h4>
                
                {/* FIXED RESPONSIVE LAYOUT FOR SKILL INPUT */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <input 
                    value={tempSkill} 
                    onChange={(e) => setTempSkill(e.target.value)} 
                    className="input-glass flex-grow" 
                    placeholder="Type skill (e.g. Python)" 
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} 
                  />
                  <div className="flex gap-3">
                    <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="input-glass w-full md:w-40 bg-slate-900 cursor-pointer">
                        <option value="technical">Hard Skill</option>
                        <option value="soft">Soft Skill</option>
                        <option value="tools">Tool</option>
                    </select>
                    <button type="button" onClick={addSkill} className="px-8 py-3 bg-ai-primary rounded-xl text-white font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-ai-primary/20">ADD</button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 min-h-[100px] content-start bg-black/20 p-4 rounded-xl border border-white/5">
                    {[...(formData.skills.technical||[]), ...(formData.skills.soft||[]), ...(formData.skills.tools||[])].length === 0 && <span className="text-white/30 text-sm italic">No skills added yet...</span>}
                    
                    {[...(formData.skills.technical||[]), ...(formData.skills.soft||[]), ...(formData.skills.tools||[])].map((s, i) => (
                        <span key={i} className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg text-sm text-white border border-white/10 flex items-center gap-2 shadow-sm animate-fadeIn">
                            {s} <button type="button" onClick={() => removeSkill(skillCategory, i)} className="text-white/40 hover:text-red-400 text-lg leading-none ml-1 transition-colors">×</button>
                        </span>
                    ))}
                </div>
              </div>

              {/* LANGUAGES */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                 <h4 className="section-title">Languages (Europass Standard)</h4>
                 {formData.languages.map((l, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-3 mb-3">
                        <input placeholder="Language (e.g. English)" className="input-glass flex-grow" value={l.language} onChange={(e) => handleInputChange('languages', 'language', e.target.value, i)} />
                        <div className="flex gap-3">
                            <select className="input-glass w-full md:w-48 bg-slate-900" value={l.proficiency} onChange={(e) => handleInputChange('languages', 'proficiency', e.target.value, i)}>
                                <option value="Native">Native</option>
                                <option value="C2">C2 (Proficient)</option>
                                <option value="C1">C1 (Advanced)</option>
                                <option value="B2">B2 (Upper Int)</option>
                                <option value="B1">B1 (Intermediate)</option>
                                <option value="A2">A2 (Elementary)</option>
                            </select>
                            <button type="button" onClick={() => removeLang(i)} className="px-4 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">✕</button>
                        </div>
                    </div>
                 ))}
                 <button type="button" onClick={addLang} className="text-ai-primary text-sm hover:text-white transition-colors mt-2 font-bold flex items-center gap-1">+ Add Language</button>
              </div>
            </div>
          )}

          {/* 4: EXTRAS (Projects, Pubs) */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
               {/* Projects */}
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                 <h3 className="section-title">Key Projects</h3>
                 {formData.projects.map((p, i) => (
                   <div key={i} className="mb-6 pb-6 border-b border-white/5 last:border-0 relative">
                     <button type="button" onClick={() => removeProject(i)} className="absolute top-0 right-0 text-white/40 hover:text-red-400">✕</button>
                     <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <input placeholder="Project Name" className="input-glass font-bold" value={p.name} onChange={(e) => handleInputChange('projects', 'name', e.target.value, i)} />
                        <input placeholder="Link URL" className="input-glass" value={p.link} onChange={(e) => handleInputChange('projects', 'link', e.target.value, i)} />
                     </div>
                     <textarea placeholder="Brief description of the project and technologies used..." className="input-glass h-24 w-full" value={p.description} onChange={(e) => handleInputChange('projects', 'description', e.target.value, i)} />
                   </div>
                 ))}
                 <button type="button" onClick={addProject} className="text-ai-primary text-sm hover:text-white font-bold">+ Add Project</button>
               </div>

               {/* Publications */}
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="section-title">Publications / Certifications</h3>
                  {formData.publications.map((p, i) => (
                    <div key={i} className="flex gap-3 mb-3">
                        <input placeholder="Title / Certificate Name" className="input-glass flex-grow" value={p.title} onChange={(e) => handleInputChange('publications', 'title', e.target.value, i)} />
                        <button type="button" onClick={() => removePub(i)} className="px-4 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white border border-red-500/20">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={addPub} className="text-ai-primary text-sm hover:text-white font-bold">+ Add Item</button>
               </div>
            </div>
          )}

          {/* 5: FINISH */}
          {activeStep === 5 && (
            <div className="animate-fadeIn text-center pt-8 max-w-4xl mx-auto">
               <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Select Architecture</h3>
               <p className="text-white/50 mb-8">Choose a world-class format tailored to your industry.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                 {cvStyles.map(s => (
                   <button key={s.id} type="button" onClick={() => setCvType(s.id)} 
                    className={`p-6 border rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-95 duration-200 group relative overflow-hidden ${cvType === s.id ? 'bg-gradient-to-br from-ai-primary to-purple-700 border-transparent text-white shadow-2xl shadow-ai-primary/30' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30'}`}>
                     
                     <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{s.icon}</span>
                     <span className="font-bold text-lg block mb-1">{s.label}</span>
                     <span className="text-xs opacity-70 font-medium uppercase tracking-wide block">{s.desc}</span>
                     
                     {/* Selection Indicator */}
                     {cvType === s.id && <div className="absolute top-3 right-3 text-white"><div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div></div>}
                   </button>
                 ))}
               </div>

               <div className="mb-12">
                 <label className="block text-white/60 text-xs mb-4 font-bold uppercase tracking-[0.2em]">Optimization Context (Industry)</label>
                 <div className="flex flex-wrap gap-2 justify-center">
                    {industries.map(ind => (
                        <button key={ind} type="button" onClick={() => setIndustry(ind)} 
                        className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${industry === ind ? 'bg-white text-black border-white scale-105 shadow-lg' : 'bg-transparent text-white/40 border-white/10 hover:border-white/50 hover:text-white'}`}>
                            {ind}
                        </button>
                    ))}
                 </div>
               </div>

               <button type="submit" disabled={loading} className="w-full md:w-auto px-20 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black rounded-2xl text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mx-auto">
                 {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> PROCESSING...</> : 'GENERATE PROFESSIONAL CV'}
               </button>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .input-glass { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); color: white; padding: 14px; border-radius: 12px; outline: none; transition: all 0.2s; font-size: 15px; }
        .input-glass:focus { border-color: #3b82f6; background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
        .label { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; font-weight: 700; margin-bottom: 6px; display: block; letter-spacing: 0.05em; }
        .section-title { color: white; font-size: 18px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <AnimatePresence>
        {showPricing && <PricingModal onClose={() => setShowPricing(false)} currentUser={user} />}
      </AnimatePresence>
    </div>
  );
};

export default CVForm;
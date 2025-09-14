import { PDFProcessor } from './pdf-utils'

export interface ParsedContact {
  name: string
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
}

export interface ParsedSkill {
  name: string
  category: 'technical' | 'soft' | 'language' | 'certification'
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface ParsedExperience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
  keywords: string[]
}

export interface ParsedProject {
  title: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  highlights: string[]
}

export interface ParsedEducation {
  degree: string
  institution: string
  location?: string
  graduationDate: string
  gpa?: string
  honors?: string[]
}

export interface ParsedCertification {
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface ParsedResume {
  contact: ParsedContact
  summary: string
  highlights: string[]
  skills: ParsedSkill[]
  experience: ParsedExperience[]
  projects: ParsedProject[]
  education: ParsedEducation[]
  certifications: ParsedCertification[]
  keywords: string[]
}

export class ResumeParser {
  private processor: PDFProcessor
  
  constructor() {
    this.processor = new PDFProcessor()
  }

  async parseFromUrl(url: string): Promise<ParsedResume> {
    await this.processor.loadFromUrl(url)
    const textContent = await this.processor.extractAllText()
    return this.parseTextContent(textContent)
  }

  async parseFromFile(file: File): Promise<ParsedResume> {
    await this.processor.loadFromFile(file)
    const textContent = await this.processor.extractAllText()
    return this.parseTextContent(textContent)
  }

  private parseTextContent(text: string): ParsedResume {
    const sections = this.identifySections(text)
    
    return {
      contact: this.parseContact(sections.header || text),
      summary: this.parseSummary(sections.summary || sections.objective || ''),
      highlights: this.parseHighlights(sections.summary || sections.objective || text),
      skills: this.parseSkills(sections.skills || text),
      experience: this.parseExperience(sections.experience || text),
      projects: this.parseProjects(sections.projects || text),
      education: this.parseEducation(sections.education || text),
      certifications: this.parseCertifications(sections.certifications || text),
      keywords: this.extractKeywords(text),
    }
  }

  private identifySections(text: string): Record<string, string> {
    const sections: Record<string, string> = {}
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean)
    
    let currentSection = 'header'
    let currentContent: string[] = []
    
    const sectionHeaders = {
      summary: /^(summary|profile|about|overview|objective)/i,
      experience: /^(experience|work|employment|career|professional)/i,
      skills: /^(skills|technical|competencies|expertise)/i,
      education: /^(education|academic|school|university)/i,
      projects: /^(projects|portfolio|work samples)/i,
      certifications: /^(certifications|certificates|licenses|credentials)/i,
      achievements: /^(achievements|accomplishments|awards|honors)/i,
    }
    
    for (const line of lines) {
      let foundSection = false
      
      for (const [sectionName, pattern] of Object.entries(sectionHeaders)) {
        if (pattern.test(line)) {
          // Save previous section
          if (currentContent.length > 0) {
            sections[currentSection] = currentContent.join('\n')
          }
          
          currentSection = sectionName
          currentContent = []
          foundSection = true
          break
        }
      }
      
      if (!foundSection) {
        currentContent.push(line)
      }
    }
    
    // Save last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n')
    }
    
    return sections
  }

  private parseContact(headerText: string): ParsedContact {
    const emailMatch = headerText.match(/[\w\.-]+@[\w\.-]+\.\w+/i)
    const phoneMatch = headerText.match(/[\+]?[\d\s\-\(\)\.]{10,}/g)
    const linkedinMatch = headerText.match(/linkedin\.com\/in\/[\w\-]+/i)
    const githubMatch = headerText.match(/github\.com\/[\w\-]+/i)
    const websiteMatch = headerText.match(/https?:\/\/[\w\.-]+/i)
    
    // Extract name - usually the first line or largest text
    const lines = headerText.split('\n').map(l => l.trim()).filter(Boolean)
    const name = lines[0] || 'Professional'
    
    // Extract location - look for city, state patterns
    const locationMatch = headerText.match(/([A-Z][a-z\s]+),?\s*([A-Z]{2}|[A-Z][a-z\s]+)/g)
    
    return {
      name,
      email: emailMatch?.[0],
      phone: phoneMatch?.[0]?.replace(/\s+/g, ' ').trim(),
      location: locationMatch?.[0],
      website: websiteMatch?.[0],
      linkedin: linkedinMatch?.[0] ? `https://${linkedinMatch[0]}` : undefined,
      github: githubMatch?.[0] ? `https://${githubMatch[0]}` : undefined,
    }
  }

  private parseSummary(summaryText: string): string {
    if (!summaryText) return ''
    
    // Clean up and return first paragraph or first few sentences
    const sentences = summaryText.split(/[.!?]+/).filter(s => s.trim().length > 20)
    return sentences.slice(0, 3).join('. ').trim() + (sentences.length > 0 ? '.' : '')
  }

  private parseHighlights(text: string): string[] {
    const highlights: string[] = []
    
    // Look for bullet points or numbered lists
    const bulletPattern = /^[\s]*[•\-\*\d+\.]\s*(.+)$/gm
    const matches = text.matchAll(bulletPattern)
    
    for (const match of matches) {
      const highlight = match[1].trim()
      if (highlight.length > 20 && highlight.length < 200) {
        highlights.push(highlight)
      }
    }
    
    // If no bullets found, extract key sentences
    if (highlights.length === 0) {
      const sentences = text.split(/[.!?]+/)
      const keyPhrases = sentences.filter(s => 
        s.length > 30 && s.length < 150 &&
        /\b(led|managed|developed|created|implemented|improved|increased|reduced|achieved)\b/i.test(s)
      )
      highlights.push(...keyPhrases.slice(0, 6).map(s => s.trim()))
    }
    
    return highlights.slice(0, 6)
  }

  private parseSkills(skillsText: string): ParsedSkill[] {
    const skills: ParsedSkill[] = []
    
    // Common technical skills
    const technicalSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift',
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Linux', 'SQL', 'MongoDB',
      'PostgreSQL', 'Redis', 'GraphQL', 'REST', 'API', 'Microservices', 'DevOps',
      'CI/CD', 'Terraform', 'Jenkins', 'GitHub', 'Jira', 'Agile', 'Scrum'
    ]
    
    // Security-specific skills (based on the cyber-engineer.pdf in the docs)
    const securitySkills = [
      'NIST', 'RMF', 'STIG', 'FISMA', 'DISA', 'DoD', 'Security+', 'CISSP', 'CEH',
      'Penetration Testing', 'Vulnerability Assessment', 'Risk Management',
      'Compliance', 'Cybersecurity', 'Information Security', 'Network Security'
    ]
    
    const allSkills = [...technicalSkills, ...securitySkills]
    
    for (const skill of allSkills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      if (regex.test(skillsText)) {
        const category = securitySkills.includes(skill) ? 'certification' as const : 'technical' as const
        skills.push({
          name: skill,
          category,
        })
      }
    }
    
    return skills
  }

  private parseExperience(experienceText: string): ParsedExperience[] {
    const experiences: ParsedExperience[] = []
    
    // Split by potential job entries (look for company/title patterns)
    const jobPattern = /([A-Z][^|\n]*?(?:Engineer|Developer|Manager|Analyst|Specialist|Consultant|Director|Lead|Senior|Junior|Intern)[^|\n]*?)[\s\n]+([A-Z][^|\n]*?(?:Inc|LLC|Corp|Company|University|Department|Agency)[^|\n]*?)[\s\n]+(.*?)(?=\n[A-Z][^|\n]*?(?:Engineer|Developer|Manager)|$)/gis
    
    const matches = experienceText.matchAll(jobPattern)
    
    for (const match of matches) {
      const [, title, company, content] = match
      
      // Extract dates
      const datePattern = /(\d{1,2}\/\d{4}|\d{4}|[A-Z][a-z]+\s+\d{4})/g
      const dates = content.match(datePattern) || []
      
      // Extract bullets
      const bulletPattern = /^[\s]*[•\-\*]\s*(.+)$/gm
      const bullets = Array.from(content.matchAll(bulletPattern)).map(m => m[1].trim())
      
      experiences.push({
        title: title.trim(),
        company: company.trim(),
        startDate: dates[0] || '',
        endDate: dates[1] || 'Present',
        current: !dates[1] || dates[1].toLowerCase().includes('present'),
        bullets,
        keywords: this.extractKeywords(content),
      })
    }
    
    return experiences
  }

  private parseProjects(projectsText: string): ParsedProject[] {
    const projects: ParsedProject[] = []
    
    // Look for project titles and descriptions
    const lines = projectsText.split('\n').filter(l => l.trim())
    let currentProject: Partial<ParsedProject> | null = null
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Potential project title (usually short and may have URLs)
      if (trimmed.length < 100 && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
        if (currentProject) {
          projects.push(currentProject as ParsedProject)
        }
        
        currentProject = {
          title: trimmed,
          description: '',
          technologies: [],
          highlights: [],
        }
      } else if (currentProject) {
        // Add to description or highlights
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          currentProject.highlights = currentProject.highlights || []
          currentProject.highlights.push(trimmed.replace(/^[•\-]\s*/, ''))
        } else {
          currentProject.description = (currentProject.description + ' ' + trimmed).trim()
        }
      }
    }
    
    if (currentProject) {
      projects.push(currentProject as ParsedProject)
    }
    
    return projects
  }

  private parseEducation(educationText: string): ParsedEducation[] {
    const education: ParsedEducation[] = []
    
    // Look for degree patterns
    const degreePattern = /(Bachelor|Master|PhD|Associate|Certificate).*?(?:in|of)\s+([^|\n]+?)[\s\n]+([^|\n]*?(?:University|College|Institute|School)[^|\n]*?)[\s\n]+(.*?)(?=\n(?:Bachelor|Master|PhD|Associate)|$)/gis
    
    const matches = educationText.matchAll(degreePattern)
    
    for (const match of matches) {
      const [, degreeType, field, institution, details] = match
      
      const datePattern = /(\d{4})/g
      const dates = details.match(datePattern) || []
      
      education.push({
        degree: `${degreeType.trim()} in ${field.trim()}`,
        institution: institution.trim(),
        graduationDate: dates[dates.length - 1] || '',
      })
    }
    
    return education
  }

  private parseCertifications(certificationsText: string): ParsedCertification[] {
    const certifications: ParsedCertification[] = []
    
    const commonCerts = [
      'Security+', 'CISSP', 'CEH', 'CISM', 'CISA', 'GSEC', 'CISSP',
      'AWS Certified', 'Azure Certified', 'Google Cloud', 'CompTIA',
      'Certified Ethical Hacker', 'SANS', 'GIAC'
    ]
    
    for (const cert of commonCerts) {
      const regex = new RegExp(`${cert.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi')
      if (regex.test(certificationsText)) {
        certifications.push({
          name: cert,
          issuer: cert.includes('AWS') ? 'Amazon' : cert.includes('Azure') ? 'Microsoft' : 'Various',
          date: '',
        })
      }
    }
    
    return certifications
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().match(/\b\w{3,}\b/g) || []
    const frequency: Record<string, number> = {}
    
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
    ])
    
    for (const word of words) {
      if (!stopWords.has(word) && word.length > 3) {
        frequency[word] = (frequency[word] || 0) + 1
      }
    }
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word)
  }

  destroy(): void {
    this.processor.destroy()
  }
}

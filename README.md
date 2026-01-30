# Project Title: Dynamic Resume Builder V5

## Project Overview
**Dynamic Resume Builder V5** is a responsive, single-page web application designed to help job seekers create professional, polished, and visually appealing resumes in minutes. The application prioritizes user customization, allowing applicants to tailor the structure, typography, and color scheme of their resume to match specific industries or personal branding.

By utilizing strong TypeScript typing and a component-based architecture, this application ensures a robust user experience with real-time preview capabilities and high-quality PDF export functionality.

---

## Key Features

### 1. Multi-Template Support (5 Layouts)
The application offers five distinct structural layouts defined by `LayoutType`, catering to various professional needs:
*   **Classic:** A timeless, chronological format suitable for traditional corporate roles. Features a balanced top-down hierarchy.
*   **Modern:** A contemporary layout featuring bold headers and distinct section separators, ideal for tech and media roles.
*   **Minimalist:** A clean, high-whitespace design that focuses purely on content without visual clutter, perfect for academia and research.
*   **Executive:** A sophisticated, high-density layout designed for senior management, emphasizing leadership experience and strategic skills.
*   **Creative:** A unique grid-based or asymmetrical layout designed for designers, artists, and architects to showcase visual flair.

### 2. Typography Customization (3 Font Families)
Users can select from three optimized font stacks defined by `FontFamily` to ensure readability and style:
*   **Inter:** A modern, variable font optimized for computer screens, providing excellent legibility for digital resumes.
*   **Roboto:** A geometric yet friendly sans-serif offering a professional mechanical skeleton and a somewhat open form.
*   **Arial:** A ubiquitous, safe sans-serif choice ensuring maximum compatibility across all older systems and ATS (Applicant Tracking Systems).

### 3. Advanced Theming Engine (4 Themes)
A dynamic theming system allows users to instantly switch the visual mood of the resume using the `ThemeType` definitions:
*   **Default:** A high-contrast, monochrome scheme (Black & White) that is safe, formal, and printer-friendly.
*   **Blue:** A trust-inspiring palette using navy and royal blue accents, ideal for corporate, finance, and administrative roles.
*   **Teal:** A refreshing and modern palette combining teal and slate tones, suitable for startups, healthcare, and education.
*   **Purple:** A creative and luxurious palette utilizing violet and indigo accents, perfect for marketing, creative agencies, and beauty industries.

### 4. Real-Time Preview & Export
*   **Live Editing:** As users input their data (Personal Info, Experience, Education, Skills), the resume preview updates instantly.
*   **PDF Export:** A high-fidelity export function allows users to download the finalized resume as a PDF, preserving the selected layout, fonts, and theme colors exactly as seen on the screen.

---

## Technical Architecture

*   **Core Language:** TypeScript (Strict Mode)
*   **State Management:** Context API / Redux (for managing resume data, current theme, and layout state)
*   **Styling Strategy:** CSS Modules or Styled Components to handle dynamic theme injection (CSS Variables for colors).
*   **Print Generation:** Native browser print APIs or `react-pdf` / `html2pdf` for client-side PDF generation.

## Type Definitions

The project utilizes the following core interfaces to ensure type safety across the application:

```typescript
// Theme Configuration
export type ThemeType = 'default' | 'blue' | 'teal' | 'purple';

// Layout Structure
export type LayoutType =
  | 'classic'
  | 'modern'
  | 'minimalist'
  | 'executive'
  | 'creative';

// Typography Settings
export type FontFamily = 'Inter, sans-serif' | 'Roboto, sans-serif' | 'Arial';

// Global Settings Interface
interface ResumeSettings {
  layout: LayoutType;
  theme: ThemeType;
  fontFamily: FontFamily;
}
```

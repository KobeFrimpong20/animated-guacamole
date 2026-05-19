# **Feature Design: Automated Session Reporting**

## **1\. The Tutor Workflow (The Input)**

The goal is a **schedule-aware** interface that minimizes friction and achieves a completion rate under 20 clicks for group sessions.

* **Initialization:** Tool pre-loads the daily schedule via CSV upload. Tutors see their specific students for the current time slot.  
* **Attendance:** Students default to "Present" (Green). Tutors toggle to "No-Show" only if necessary, triggering an immediate policy email to parents.  
* **Subject Selection:**  
  * **Global Bulk Toggle:** Automatically checked by default.  
  * **Tiered Dropdown:** General Topic $\\rightarrow$ Searchable Special Topic list.  
  * **Data Integrity:** Standardized curriculum list prevents duplicate entries (e.g., "Phonics" vs. "Reading Phonics").  
* **The Individual Assessment (Loop for each student):**  
  * **Quantitative:** 3 engagement questions on a 5-point scale.  
  * **Qualitative:** One merged open-ended field for "Successes and Growth".

  ---

  ## **2\. The Logic Layer (The "Magic Middle")**

This layer handles the transformation of raw data into professional parent communication.

* **AI Translation:** An LLM API processes raw tutor notes using fine-tuned prompts to generate a polished, professional narrative.  
* **Human-in-the-Loop:** Tutors must view a **Live Preview** of the AI-generated text.  
  * **Approve:** High-contrast button to confirm the note.  
  * **Edit:** Secondary action to manually correct hallucinations or tone errors.  
* **The 30-Minute Buffer:**
  * In-app messages will be sent immediately, but will be editable for 30 minutes.
  * Email & SMS are held in a pending state for 30 minutes before firing.  
  * **Edit Protection:** If a tutor re-opens a note, the status changes to in-progress, pausing the countdown timer.  
  * **Fail-safe:** System logic strictly forbids sending any email with an in-progress flag.

  ---

  ## **3\. Parent & Director Experience (The Output)**

* **Parent Communication:**  
  * One-way email containing the 3 metrics and the AI-polished narrative.  
  * **CTA (Call to Action):** A "Contact Director" button leading to a web form, preventing direct replies to tutors.  
* **Director Dashboard:**  
  * **Real-time Oversight:** View session statuses (Completed, Uncompleted, No-Show).  
  * **Source of Truth:** Based on the uploaded CSV schedule.  
  * **Analytics:** Track CTA engagement to determine if parents value metrics or qualitative notes more.

  ---

  ## **4\. Technical Constraints & Rules**

* **Scalability:** Manual JSON input is replaced by a **CSV Uploader** for the Director. (requires center to use spreadsheet of some sort) 
* **Independence:** In group sessions, each student's email timer and edit history are independent.  
* **Deadline:** Any unrecorded sessions by midnight trigger an automated alert to the Director

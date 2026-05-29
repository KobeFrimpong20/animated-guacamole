import * as React from "react";

export interface SessionReportData {
  email: string;
  studentName: string;
  tutorName: string;
  confidence: number;
  focus: number;
  mastery: number;
  sessionSummary: string;
  whatWentWell: string;
  areasForGrowth: string;
  nextSessionPlan: string;
}

interface SessionReportViewProps extends SessionReportData {
  isEditable?: boolean;
  onChange?: (name: keyof SessionReportData, value: string | number) => void;
}

export const SessionReportView = ({
  email,
  studentName,
  tutorName,
  confidence,
  focus,
  mastery,
  sessionSummary,
  whatWentWell,
  areasForGrowth,
  nextSessionPlan,
  isEditable = false,
  onChange,
}: SessionReportViewProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (onChange) {
      const { name, value } = e.target;
      onChange(name as keyof SessionReportData, name === 'confidence' || name === 'focus' || name === 'mastery' ? parseInt(value) : value);
    }
  };

  return (
    <div style={container}>
      <h1 style={h1}>Session Report Preview</h1>
      <div style={text}>
        {<><strong>Recipient:</strong> {email}<br /></>}
        {<><strong>Student:</strong> {studentName}<br /></>}
        {<><strong>Tutor:</strong> {tutorName}</>}
      </div>
      
      <hr style={hr} />

      <div>
        <h2 style={h2}>Session Metrics</h2>
        <div style={text}>
          {isEditable ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={label}>Confidence</label>
                <select name="confidence" value={confidence} onChange={handleInputChange} style={editableInput}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Focus</label>
                <select name="focus" value={focus} onChange={handleInputChange} style={editableInput}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Mastery</label>
                <select name="mastery" value={mastery} onChange={handleInputChange} style={editableInput}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <>
              <strong>Confidence:</strong> {confidence}/5
              <br />
              <strong>Focus:</strong> {focus}/5
              <br />
              <strong>Mastery:</strong> {mastery}/5
            </>
          )}
        </div>
      </div>

      <hr style={hr} />

      <div>
        <p style={question}>How did the session go overall?</p>
        {isEditable ? (
          <textarea
            name="sessionSummary"
            value={sessionSummary}
            onChange={handleInputChange}
            style={editableAnswer}
            rows={3}
          />
        ) : (
          <p style={answer}>{sessionSummary}</p>
        )}

        <p style={question}>What went well today?</p>
        {isEditable ? (
          <textarea
            name="whatWentWell"
            value={whatWentWell}
            onChange={handleInputChange}
            style={editableAnswer}
            rows={3}
          />
        ) : (
          <p style={answer}>{whatWentWell}</p>
        )}

        <p style={question}>Where can the student improve?</p>
        {isEditable ? (
          <textarea
            name="areasForGrowth"
            value={areasForGrowth}
            onChange={handleInputChange}
            style={editableAnswer}
            rows={3}
          />
        ) : (
          <p style={answer}>{areasForGrowth}</p>
        )}

        <p style={question}>What is the plan for the next session?</p>
        {isEditable ? (
          <textarea
            name="nextSessionPlan"
            value={nextSessionPlan}
            onChange={handleInputChange}
            style={editableAnswer}
            rows={3}
          />
        ) : (
          <p style={answer}>{nextSessionPlan}</p>
        )}
      </div>

      <hr style={hr} />

      <p style={footer}>
        Sent via Loop-Learn. Helping students and tutors stay in the loop.
      </p>
    </div>
  );
};

// Internal styles to match email look
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 40px 48px",
  maxWidth: "580px",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const h2 = {
  color: "#444",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "0",
};

const label = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#8898aa',
  marginBottom: '2px',
  textTransform: 'uppercase' as const,
};

const question = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "20px 0 0",
};

const answer = {
  color: "#525f7f",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "4px 0 20px",
  lineHeight: "24px",
};

const editableInput: React.CSSProperties = {
  color: "#525f7f",
  fontSize: "14px",
  width: "100%",
  padding: "6px 8px",
  border: "1px solid #e6ebf1",
  borderRadius: "4px",
  backgroundColor: "#ffffff",
};

const editableAnswer: React.CSSProperties = {
  color: "#525f7f",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "4px 0 20px",
  lineHeight: "24px",
  width: "100%",
  padding: "8px",
  border: "1px dashed #ccc",
  borderRadius: "4px",
  backgroundColor: "#fafafa",
  display: "block",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "32px 0 0",
};

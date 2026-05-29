import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SessionReportEmailProps {
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

export const SessionReportEmail = ({
  studentName,
  tutorName,
  confidence,
  focus,
  mastery,
  sessionSummary,
  whatWentWell,
  areasForGrowth,
  nextSessionPlan,
}: SessionReportEmailProps) => (
  <Html>
    <Head />
    <Preview>Session Report for {studentName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Session Report</Heading>
        <Text style={text}>
          <strong>Student:</strong> {studentName}
          <br />
          <strong>Tutor:</strong> {tutorName}
        </Text>
        
        <Hr style={hr} />

        <Section>
          <Heading as="h2" style={h2}>Session Metrics</Heading>
          <Text style={text}>
            <strong>Confidence:</strong> {confidence}/5
            <br />
            <strong>Focus:</strong> {focus}/5
            <br />
            <strong>Mastery:</strong> {mastery}/5
          </Text>
        </Section>

        <Hr style={hr} />

        <Section>
          <Text style={question}>How did the session go overall?</Text>
          <Text style={answer}>{sessionSummary}</Text>

          <Text style={question}>What went well today?</Text>
          <Text style={answer}>{whatWentWell}</Text>

          <Text style={question}>Where can the student improve?</Text>
          <Text style={answer}>{areasForGrowth}</Text>

          <Text style={question}>What is the plan for the next session?</Text>
          <Text style={answer}>{nextSessionPlan}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Sent via Loop-Learn. Helping students and tutors stay in the loop.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SessionReportEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "580px",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
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
  margin: "20px 40px 10px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "0 40px",
};

const question = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "20px 40px 0",
};

const answer = {
  color: "#525f7f",
  fontSize: "16px",
  fontStyle: "italic",
  margin: "4px 40px 20px",
  lineHeight: "24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "32px 0 0",
};

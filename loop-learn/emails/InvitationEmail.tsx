import {
  Body,
  Button,
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

interface InvitationEmailProps {
  orgName: string;
  inviterName: string;
  role: string;
  inviteUrl: string;
}

export const InvitationEmail = ({
  orgName,
  inviterName,
  role,
  inviteUrl,
}: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>You've been invited to join {orgName} on Loop-Learn</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're invited!</Heading>

        <Text style={text}>
          <strong>{inviterName}</strong> has invited you to join{" "}
          <strong>{orgName}</strong> as a <strong>{role}</strong>.
        </Text>

        <Text style={text}>
          Loop-Learn helps tutoring centers stay organized — track sessions,
          share reports, and keep families in the loop.
        </Text>

        <Hr style={hr} />

        <Section style={buttonContainer}>
          <Button style={button} href={inviteUrl}>
            Accept Invitation
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This invitation expires in 7 days. If you didn't expect this email,
          you can safely ignore it.
        </Text>
        <Text style={footer}>
          Sent via Loop-Learn. Helping students and tutors stay in the loop.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvitationEmail;

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

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "0 40px 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#6B5B45",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 32px",
  display: "inline-block",
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
  margin: "8px 0 0",
};

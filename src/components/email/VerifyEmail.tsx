import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
} from '@react-email/components';
import React from 'react';

interface VerifyEmailProps {
  url: string;
}

export const VerifyEmail = ({ url }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Biyaheng Tipid</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>Biyaheng Tipid</Text>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hello,</Text>
            <Text style={paragraph}>
              Thank you for signing up for <strong>Biyaheng Tipid</strong>! To
              complete your registration and secure your account, please verify
              your email address by clicking the button below.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={url}>
                Verify Email Address
              </Button>
            </Section>
            <Text style={paragraph}>
              If the button doesn&apos;t work, you can copy and paste the
              following link into your browser:
            </Text>
            <Text style={paragraph}>
              <Link style={link} href={url}>
                {url}
              </Link>
            </Text>
            <Text style={paragraph}>
              If you didn&apos;t create an account with Biyaheng Tipid, you can
              safely ignore this email.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Biyaheng Tipid. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f5f7fa',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const header = {
  backgroundColor: '#0060d6',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const headerText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
};

const content = {
  padding: '32px 24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#0060d6',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '8px',
};

const link = {
  color: '#0060d6',
  wordBreak: 'break-all' as const,
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

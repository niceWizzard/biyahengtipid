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

interface ResetPasswordEmailProps {
  url: string;
}

export const ResetPasswordEmail = ({ url }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for Biyaheng Tipid</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>Biyaheng Tipid</Text>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hello,</Text>
            <Text style={paragraph}>
              We received a request to reset your password for your{' '}
              <strong>Biyaheng Tipid</strong> account. Click the button below to
              create a new password.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={url}>
                Reset Password
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
              <strong>This link will expire in 1 hour.</strong> If you didn&apos;t
              request a password reset, you can safely ignore this email.
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
  color: '#374151',
  lineHeight: '1.6',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#0060d6',
  color: '#ffffff',
  padding: '12px 32px',
  fontSize: '16px',
  fontWeight: '600',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
};

const link = {
  color: '#0060d6',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  borderTop: '1px solid #e5e7eb',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

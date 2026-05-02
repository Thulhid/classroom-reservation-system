import "server-only";

import { randomUUID } from "node:crypto";
import net from "node:net";
import tls from "node:tls";

const SMTP_TIMEOUT_MS = 15000;

type SmtpSettings = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  secure: boolean;
};

type SmtpResponse = {
  code: number;
  lines: string[];
};

type PasswordResetPinEmail = {
  to: string;
  name?: string;
  pin: string;
  expiresInMinutes: number;
};

function waitForSocket(
  socket: net.Socket | tls.TLSSocket,
  eventName: "connect" | "secureConnect",
) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      socket.destroy();
      reject(new Error("SMTP connection timed out."));
    }, SMTP_TIMEOUT_MS);

    const cleanup = () => {
      clearTimeout(timeout);
      socket.off(eventName, handleReady);
      socket.off("error", handleError);
    };

    const handleReady = () => {
      cleanup();
      resolve();
    };

    const handleError = (error: Error) => {
      cleanup();
      reject(error);
    };

    socket.once(eventName, handleReady);
    socket.once("error", handleError);
  });
}

class SmtpConnection {
  private buffer = "";

  constructor(private socket: net.Socket | tls.TLSSocket) {
    this.socket.setEncoding("utf8");
  }

  private async readLine() {
    const existingLine = this.readLineFromBuffer();

    if (existingLine !== null) {
      return existingLine;
    }

    return new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("SMTP server response timed out."));
      }, SMTP_TIMEOUT_MS);

      const cleanup = () => {
        clearTimeout(timeout);
        this.socket.off("data", handleData);
        this.socket.off("error", handleError);
        this.socket.off("close", handleClose);
      };

      const resolveLine = () => {
        const line = this.readLineFromBuffer();

        if (line !== null) {
          cleanup();
          resolve(line);
        }
      };

      const handleData = (chunk: string | Buffer) => {
        this.buffer += chunk.toString();
        resolveLine();
      };

      const handleError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const handleClose = () => {
        cleanup();
        reject(new Error("SMTP connection closed."));
      };

      this.socket.on("data", handleData);
      this.socket.once("error", handleError);
      this.socket.once("close", handleClose);
    });
  }

  private readLineFromBuffer() {
    const lineEnd = this.buffer.indexOf("\n");

    if (lineEnd === -1) {
      return null;
    }

    const line = this.buffer.slice(0, lineEnd).replace(/\r$/, "");
    this.buffer = this.buffer.slice(lineEnd + 1);

    return line;
  }

  async readResponse(expectedCodes: number[]): Promise<SmtpResponse> {
    const lines: string[] = [];
    let code = 0;

    while (true) {
      const line = await this.readLine();
      const parsedCode = Number(line.slice(0, 3));

      if (!Number.isInteger(parsedCode)) {
        throw new Error(`Invalid SMTP response: ${line}`);
      }

      code = parsedCode;
      lines.push(line);

      if (line.at(3) !== "-") {
        break;
      }
    }

    if (!expectedCodes.includes(code)) {
      throw new Error(`Unexpected SMTP response: ${lines.join(" ")}`);
    }

    return {
      code,
      lines,
    };
  }

  sendLine(line: string) {
    this.socket.write(`${line}\r\n`);
  }

  async command(line: string, expectedCodes: number[]) {
    this.sendLine(line);
    return this.readResponse(expectedCodes);
  }

  async startTls(host: string) {
    const secureSocket = tls.connect({
      socket: this.socket,
      servername: host,
    });
    this.socket = secureSocket;
    this.socket.setEncoding("utf8");
    await waitForSocket(secureSocket, "secureConnect");
  }

  close() {
    this.socket.end();
  }
}

function getSmtpSettings(): SmtpSettings {
  const isBrevoConfigured = Boolean(
    process.env.BREVO_HOST ||
      process.env.BREVO_LOGIN ||
      process.env.BREVO_SMTPKEY,
  );
  const host = process.env.BREVO_HOST ?? process.env.EMAIL_HOST;
  const portValue = isBrevoConfigured
    ? (process.env.BREVO_PORT ?? "587")
    : (process.env.EMAIL_PORT ?? "587");
  const port = Number.parseInt(portValue, 10);
  const user = process.env.BREVO_LOGIN ?? process.env.EMAIL_USERNAME;
  const password = process.env.BREVO_SMTPKEY ?? process.env.EMAIL_PASSWORD;
  const from = process.env.BREVO_FROM ?? process.env.EMAIL_FROM ?? user;

  if (!host || !Number.isInteger(port) || !user || !password || !from) {
    throw new Error("SMTP environment variables are not configured.");
  }

  return {
    host,
    port,
    user,
    password,
    from,
    secure: port === 465,
  };
}

async function createSmtpConnection(settings: SmtpSettings) {
  const socket = settings.secure
    ? tls.connect({
        host: settings.host,
        port: settings.port,
        servername: settings.host,
      })
    : net.connect({
        host: settings.host,
        port: settings.port,
      });

  await waitForSocket(socket, settings.secure ? "secureConnect" : "connect");

  return new SmtpConnection(socket);
}

function getEmailAddress(address: string) {
  return (address.match(/<([^>]+)>/)?.[1] ?? address).trim();
}

function getFromHeader(from: string) {
  if (from.includes("<")) {
    return from;
  }

  return `"Smart Classroom Booking System" <${from}>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeMessageBody(message: string) {
  return message.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function buildPasswordResetMessage({
  from,
  to,
  name,
  pin,
  expiresInMinutes,
}: PasswordResetPinEmail & { from: string }) {
  const boundary = `smart-classroom-${randomUUID()}`;
  const subject = "Your Smart Classroom password reset code";
  const safeName = name ? escapeHtml(name) : "there";
  const safeTextName = name?.replace(/\r?\n/g, " ") ?? "there";
  const text = [
    "Smart Classroom Booking System",
    "",
    `Hi ${safeTextName},`,
    "",
    "Use this PIN to reset your account password:",
    "",
    pin,
    "",
    `This code expires in ${expiresInMinutes} minutes.`,
    "If you did not request a password reset, you can ignore this email.",
  ].join("\n");
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password reset code</title>
  </head>
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Use this PIN to reset your Smart Classroom password.</div>
    <main style="width:100%;padding:32px 16px;">
      <section style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#0284c7;">Smart Classroom Booking System</p>
        <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#0f172a;">Password reset code</h1>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">Hi ${safeName}, use the PIN below to reset your account password.</p>
        <div style="margin:0 0 20px;padding:18px;border-radius:10px;background:#f0f9ff;border:1px solid #bae6fd;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#0369a1;">Your PIN</p>
          <p style="margin:0;font-size:32px;line-height:1;font-weight:700;letter-spacing:8px;color:#0f172a;">${pin}</p>
        </div>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">This code expires in ${expiresInMinutes} minutes. For your security, never share this code with anyone.</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">If you did not request a password reset, you can safely ignore this email.</p>
      </section>
    </main>
  </body>
</html>`;

  return [
    `From: ${getFromHeader(from)}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${randomUUID()}@smart-classroom.local>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    text,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
    `--${boundary}--`,
  ].join("\r\n");
}

export async function sendPasswordResetPinEmail(
  email: PasswordResetPinEmail,
) {
  const settings = getSmtpSettings();
  const connection = await createSmtpConnection(settings);

  try {
    await connection.readResponse([220]);
    await connection.command("EHLO smart-classroom.local", [250]);

    if (!settings.secure) {
      await connection.command("STARTTLS", [220]);
      await connection.startTls(settings.host);
      await connection.command("EHLO smart-classroom.local", [250]);
    }

    await connection.command("AUTH LOGIN", [334]);
    await connection.command(
      Buffer.from(settings.user).toString("base64"),
      [334],
    );
    await connection.command(
      Buffer.from(settings.password).toString("base64"),
      [235],
    );
    await connection.command(`MAIL FROM:<${getEmailAddress(settings.from)}>`, [
      250,
    ]);
    await connection.command(`RCPT TO:<${email.to}>`, [250, 251]);
    await connection.command("DATA", [354]);
    connection.sendLine(
      `${normalizeMessageBody(
        buildPasswordResetMessage({
          ...email,
          from: settings.from,
        }),
      )}\r\n.`,
    );
    await connection.readResponse([250]);
    await connection.command("QUIT", [221]);
  } finally {
    connection.close();
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import { google } from 'googleapis';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.setUpTransporter();
  }

  private async setUpTransporter() {
    try {
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        process.env.EMAIL_CLIENT_ID,
        process.env.EMAIL_CLIENT_SECRET,
        process.env.OAUTH_URL,
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.EMAIL_REFRESH_TOKEN,
      });

      const accessToken = await new Promise<string>((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token as string);
          }
        });
      });

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          accessToken,
          clientId: process.env.EMAIL_CLIENT_ID,
          clientSecret: process.env.EMAIL_CLIENT_SECRET,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao estabelecer conexao com o servidor de email',
        error,
      );
    }
  }

  async sendEmailResetPassword(email: string, resetToken: string) {
    try {
      const resetLink = process.env.RESET_PASSWORD_LINK + `/${resetToken}`;
      const subject = 'Redefinir Senha';
      const replacements = {
        resetLink,
      };

      const templatePath = 'src/mail/templates/reset-password-template.html';

      return this.sendEmail(email, subject, templatePath, replacements);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async readHTMLFile(filePath: string): Promise<string> {
    const html = await fs.readFile(filePath, { encoding: 'utf-8' });
    return html;
  }

  async sendEmailVerifyUserEmail(email: string, emailToken: string) {
    try {
      const confirmeEmailLink =
        process.env.CONFIRM_EMAIL_LINK + `/${emailToken}`;
      const subject = 'Confirmação de cadastro';

      const replacements = {
        confirmeEmailLink,
      };

      const templatePath = 'src/mail/templates/confirm-email-template.html';

      return this.sendEmail(email, subject, templatePath, replacements);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async sendEmail(
    email: string,
    subject: string,
    templatePath: string,
    replacements: Record<string, string>,
  ) {
    if (!process.env.EMAIL_USER) {
      throw new Error('EMAIL_USER is not defined in environment variables');
    }

    try {
      const html = await this.readHTMLFile(templatePath);
      const template = handlebars.compile(html);
      const htmlToSend = template(replacements);

      await this.transporter.sendMail({
        from: {
          name: 'nao-responda',
          address: process.env.EMAIL_USER,
        },
        to: email,
        subject,
        html: htmlToSend,
        attachments: [
          {
            filename: 'logo.png',
            path: 'src/mail/templates/assets/logo.png',
            cid: 'vslogo',
          },
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        erro: error,
        message: 'Erro ao enviar email ao usuário',
      });
    }
  }
}

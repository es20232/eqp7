import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
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
    } catch (err) {
      console.log(err);
    }
  }

  async sendEmailResetPassword(email: string, resetToken: string) {
    try {
      const resetLink = process.env.RESET_PASSWORD_LINK + `/${resetToken}`;
      const subject = 'Redefinir Senha';
      const emailBody = `Você solicitou a redefinição de sua senha. Clique no link a seguir para prosseguir:\n${resetLink}\nCaso você não tenha solicitado a redefinição, desconsidere este email.`;

      return this.sendEmail(email, subject, emailBody);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendEmailVerifyUserEmail(email: string, emailToken: string) {
    try {
      const confirmeEmailLink =
        process.env.CONFIRM_EMAIL_LINK + `/${emailToken}`;
      const subject = 'Confirmação de cadastro';
      const emailBody = `Clique no link a seguir para que possámos verificar o seu email e concluir seu cadastro:\n${confirmeEmailLink}\nCaso você não tenha feito cadastro no nosso sistema, desconsidere este email.`;

      return this.sendEmail(email, subject, emailBody);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async sendEmail(email: string, subject: string, emailBody: string) {
    if (!process.env.EMAIL_USER) {
      throw new Error('EMAIL_USER is not defined in environment variables');
    }

    try {
      await this.transporter.sendMail({
        from: {
          name: 'nao-responda',
          address: process.env.EMAIL_USER,
        },
        to: email,
        subject,
        text: emailBody,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

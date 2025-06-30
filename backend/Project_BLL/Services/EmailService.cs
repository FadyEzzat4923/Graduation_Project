using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string resetCode)
    {
        try
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

            var client = new SmtpClient(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, "MOMSHOOD"), 
                Subject = subject.ToUpper(), 
                IsBodyHtml = true
            };

            mailMessage.Body = $@"
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                        text-align: center;
                    }}
                    .container {{
                        max-width: 600px;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    }}
                    h2 {{
                        color: #333;
                    }}
                    p {{
                        font-size: 16px;
                        color: #555;
                        line-height: 1.5;
                    }}
                    .code {{
                        font-size: 24px;
                        font-weight: bold;
                        color: #2d89ff;
                        background-color: #f4f4f4;
                        padding: 10px;
                        display: inline-block;
                        margin-top: 10px;
                        border-radius: 5px;
                    }}
                    .footer {{
                        margin-top: 20px;
                        font-size: 14px;
                        color: #999;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Reset Your Password</h2>
                    <p>Dear Valued User,</p>
                    <p>We have received a request to reset your password. Please use the verification code below to proceed:</p>
                    <div class='code'>{resetCode}</div> <!-- ✅ استخدام الكود هنا -->
                    <p>This code will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
                    <p>For security reasons, never share your reset code with anyone.</p>
                    <p>Thank you for choosing <strong>MOMSHOOD</strong>.</p>
                    <div class='footer'>© {DateTime.UtcNow.Year} MOMSHOOD. All rights reserved.</div>
                </div>
            </body>
            </html>";

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error sending email: {ex.Message}");
            throw new Exception("Error sending email. Please check server logs.");
        }
    }

}


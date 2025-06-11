from typing import Optional, List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
import logging
from config import settings

logger = logging.getLogger(__name__)

class EmailService:
    """Enhanced email service with better error handling and templates"""
    
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME or settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_use_tls = settings.SMTP_USE_TLS or settings.SMTP_TLS
        self.email_from = settings.EMAIL_FROM or self.smtp_username
        
    def _validate_config(self) -> bool:
        """Validate email configuration"""
        required_fields = [self.smtp_host, self.smtp_port, self.smtp_username, self.smtp_password]
        if not all(required_fields):
            logger.error("SMTP configuration incomplete. Please check your environment variables.")
            return False
        return True
    
    def send_email(
        self, 
        to_email: str, 
        subject: str, 
        body: str,
        from_email: Optional[str] = None,
        attachments: Optional[List[str]] = None,
        is_html: bool = False
    ) -> bool:
        """Send email with enhanced error handling"""
        
        if not self._validate_config():
            return False
            
        try:
            from_email = from_email or self.email_from
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Add attachments
            if attachments:
                for file_path in attachments:
                    if Path(file_path).exists():
                        with open(file_path, 'rb') as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {Path(file_path).name}'
                        )
                        msg.attach(part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if self.smtp_use_tls:
                    server.starttls()
                
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication failed: {e}")
            return False
        except smtplib.SMTPRecipientsRefused as e:
            logger.error(f"Recipients refused: {e}")
            return False
        except smtplib.SMTPServerDisconnected as e:
            logger.error(f"SMTP server disconnected: {e}")
            return False
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False
    
    def send_notification_email(self, to_email: str, title: str, message: str, notification_type: str = "info") -> bool:
        """Send notification email with template"""
        
        # Create HTML template
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{title}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .logo {{ font-size: 24px; font-weight: bold; color: #3e82e7; }}
                .notification {{ padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .notification.info {{ background-color: #e3f2fd; border-left: 4px solid #2196f3; }}
                .notification.success {{ background-color: #e8f5e8; border-left: 4px solid #4caf50; }}
                .notification.warning {{ background-color: #fff3e0; border-left: 4px solid #ff9800; }}
                .notification.error {{ background-color: #ffebee; border-left: 4px solid #f44336; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Kinetic AI</div>
                    <h2>{title}</h2>
                </div>
                
                <div class="notification {notification_type}">
                    <p>{message}</p>
                </div>
                
                <div class="footer">
                    <p>This is an automated message from Kinetic AI Rehabilitation Platform.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(
            to_email=to_email,
            subject=title,
            body=html_body,
            is_html=True
        )
    
    def send_appointment_reminder(self, to_email: str, appointment_details: dict) -> bool:
        """Send appointment reminder email"""
        
        subject = "Appointment Reminder - Kinetic AI"
        message = f"""
        You have an upcoming appointment:
        
        Date: {appointment_details.get('date', 'TBD')}
        Time: {appointment_details.get('time', 'TBD')}
        Provider: {appointment_details.get('provider', 'TBD')}
        Type: {appointment_details.get('type', 'Consultation')}
        
        Please make sure to join on time. If you need to reschedule, please contact us as soon as possible.
        """
        
        return self.send_notification_email(to_email, subject, message, "info")
    
    def send_exercise_completion_notification(self, to_email: str, exercise_name: str, completion_data: dict) -> bool:
        """Send exercise completion notification"""
        
        subject = "Exercise Completed - Great Job!"
        message = f"""
        Congratulations! You have successfully completed: {exercise_name}
        
        Performance Summary:
        - Duration: {completion_data.get('duration', 'N/A')}
        - Repetitions: {completion_data.get('repetitions', 'N/A')}
        - Quality Score: {completion_data.get('quality_score', 'N/A')}
        
        Keep up the great work on your recovery journey!
        """
        
        return self.send_notification_email(to_email, subject, message, "success")

# Global email service instance
email_service = EmailService()
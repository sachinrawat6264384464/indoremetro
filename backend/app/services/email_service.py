import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from app.core.config import settings
from typing import Dict, Any

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "emails")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR)) if os.path.exists(TEMPLATES_DIR) else None

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, template_name: str, context: Dict[str, Any]) -> bool:
        if not settings.EMAIL_ENABLED:
            print(f"[DEV EMAIL LOG] To: {to_email} | Subject: {subject} | Template: {template_name}")
            return True

        try:
            template = env.get_template(template_name) if env else None
            html_content = template.render(**context) if template else f"<p>{subject}</p>"

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html")
            msg.attach(part)

            with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
                if settings.EMAIL_USERNAME and settings.EMAIL_PASSWORD:
                    server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
                server.sendmail(settings.EMAIL_FROM, [to_email], msg.as_string())
            return True
        except Exception as e:
            print(f"Failed to send email to {to_email}: {e}")
            return False

    @staticmethod
    def send_ticket_confirmation(to_email: str, ticket_data: Dict[str, Any]):
        EmailService.send_email(
            to_email=to_email,
            subject=f"Booking Confirmation - Ticket #{ticket_data.get('ticket_number')}",
            template_name="ticket_confirmation.html",
            context=ticket_data
        )

    @staticmethod
    def send_welcome_email(to_email: str, user_name: str):
        EmailService.send_email(
            to_email=to_email,
            subject="Welcome to Indore Metro Rail Corporation",
            template_name="welcome.html",
            context={"name": user_name, "app_name": settings.APP_NAME}
        )

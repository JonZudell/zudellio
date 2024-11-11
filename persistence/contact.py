from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, EmailStr
from pynamodb.attributes import UnicodeAttribute
from pynamodb.models import Model

class ContactFormModel(Model):
    uuid = UnicodeAttribute(hash_key=True)
    created_at =  UnicodeAttribute()
    name = UnicodeAttribute()
    email = UnicodeAttribute()
    message = UnicodeAttribute()

class ContactFormSchema(BaseModel):
    _model = ContactFormModel
    uuid = UUID
    created_at = datetime 
    email = EmailStr()
    name = str
    message = str
    model_config = ConfigDict(from_attributes=True)

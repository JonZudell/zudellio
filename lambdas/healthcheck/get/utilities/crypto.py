import base64
import json
import os
import secrets
from base64 import urlsafe_b64decode, urlsafe_b64encode
from typing import Union

import pyotp
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import (dh, dsa, ec, ed448,
                                                       ed25519, rsa, x448,
                                                       x25519)
from cryptography.hazmat.primitives.asymmetric.dh import DHPublicKey
from cryptography.hazmat.primitives.asymmetric.dsa import DSAPublicKey
from cryptography.hazmat.primitives.asymmetric.ec import EllipticCurvePublicKey
from cryptography.hazmat.primitives.asymmetric.ed448 import Ed448PublicKey
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from cryptography.hazmat.primitives.asymmetric.padding import PKCS1v15
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicKey
from cryptography.hazmat.primitives.asymmetric.x448 import X448PublicKey
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PublicKey
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from utilities.logging_config import setup_logging

logger = setup_logging(__name__)

# Define the supported private key types
PrivateKeyType = Union[
    dh.DHPrivateKey,
    dsa.DSAPrivateKey,
    rsa.RSAPrivateKey,
    ec.EllipticCurvePrivateKey,
    ed25519.Ed25519PrivateKey,
    ed448.Ed448PrivateKey,
    x25519.X25519PrivateKey,
    x448.X448PrivateKey,
]

# Define the supported public key types
PublicKeyType = Union[
    DHPublicKey,
    DSAPublicKey,
    RSAPublicKey,
    EllipticCurvePublicKey,
    Ed25519PublicKey,
    Ed448PublicKey,
    X25519PublicKey,
    X448PublicKey,
]

# Define a constant for the encryption key
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY", "your-secure-key")
PEPPER = os.environ.get("PEPPER", "your-secure-pepper")

def base64url_decode(input: str) -> str:
    rem = len(input) % 4
    if rem > 0:
        input += "=" * (4 - rem)
    return base64.urlsafe_b64decode(input).decode("utf-8")


def base64url_encode(input: str) -> str:
    return base64.urlsafe_b64encode(input.encode("utf-8")).decode("utf-8").rstrip("=")

def generate_secure_base64_secret(length: int = 128) -> str:
    random_bytes = secrets.token_bytes(length)
    base64_secret = base64.b64encode(random_bytes).decode("utf-8").rstrip("=")
    return base64_secret


def read_pems_from_file(private_key_path: str) -> PrivateKeyType:
    with open(private_key_path, "rb") as f:
        private_key_data = f.read()
        private_key = serialization.load_pem_private_key(
            private_key_data, password=None, backend=default_backend()
        )
    return private_key


def get_keys() -> PrivateKeyType:
    if os.environ.get("PRIVATE_KEY"):
        private_key = serialization.load_pem_private_key(
            os.environ.get("PRIVATE_KEY", "").encode("utf-8"),
            password=None,
            backend=default_backend(),
        )
    elif os.environ.get("PRIVATE_KEY_PATH"):
        private_key_path: str = os.environ.get("PRIVATE_KEY_PATH", "")
        private_key = read_pems_from_file(private_key_path)
    else:
        raise ValueError("No keys provided")
    return private_key


private_key = get_keys()


def encrypt(data: str) -> str:
    backend = default_backend()
    salt = secrets.token_bytes(16)
    iv = secrets.token_bytes(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100,
        backend=backend,
    )
    key = kdf.derive(ENCRYPTION_KEY.encode())
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=backend)
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(data.encode()) + encryptor.finalize()
    return urlsafe_b64encode(salt + iv + encrypted_data).decode()


def decrypt(encrypted_data: str) -> str:
    backend = default_backend()
    encrypted_bytes = urlsafe_b64decode(encrypted_data.encode())
    salt = encrypted_bytes[:16]
    iv = encrypted_bytes[16:32]
    encrypted_bytes = encrypted_bytes[32:]
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100,
        backend=backend,
    )
    key = kdf.derive(ENCRYPTION_KEY.encode())
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=backend)
    decryptor = cipher.decryptor()
    decrypted_data = decryptor.update(encrypted_bytes) + decryptor.finalize()
    return decrypted_data.decode()


def generate_signed_message(message: str) -> str:
    if isinstance(private_key, rsa.RSAPrivateKey):
        message_bytes = message.encode("utf-8")
        signature = private_key.sign(message_bytes, PKCS1v15(), hashes.SHA256())
    return f"{message}.{base64url_encode(signature.hex())}"


def verify_signed_message(message: str) -> bool:
    split = message.split(".")
    signature = base64url_encode(split[-1])
    message = ".".join(split[:-1])
    try:
        if isinstance(private_key.public_key, RSAPublicKey):
            private_key.public_key.verify(
                signature, message, PKCS1v15(), hashes.SHA256()
            )
        return True
    except InvalidSignature as e:
        return False
    except Exception as e:
        return False


def generate_provisioning_uri(secret: str, email: str) -> str:
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name="fugue-state.io")


def generate_totp(secret: str | None = None) -> str:
    if secret is None:
        secret = generate_secure_base64_secret()
    totp = pyotp.TOTP(secret)
    return totp.now()


def verify_totp(secret: str, totp_code: str) -> bool:
    try:
        return pyotp.TOTP(secret).verify(totp_code)
    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        return False

def sign_and_encrypt_token(payload: dict) -> str:
    header_str = json.dumps({"alg": "RS256", "kid": "0"})
    payload_str = json.dumps(payload)
    message = f'{base64url_encode(header_str)}.{base64url_encode(payload_str)}'
    return encrypt(generate_signed_message(message=message))


def decrypt_and_verify_token(token: str) -> dict | None:
    decrypted_token: str
    try:
        decrypted_token = decrypt(token)
    except Exception as e:
        logger.warning(
                json.dumps(
                    {
                        "event": "JWT_DECRYPTION_FAILED",
                        "error": str(e),
                        "token": token,
                    }
                )
            )

    if not verify_signed_message(decrypted_token):
        logger.warning("JWT_SIGNATURE_INVALID")
        return None

    split = decrypted_token.split(".")
    return json.loads(base64url_decode(split[1]))  # type: ignore

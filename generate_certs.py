from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import datetime
import ipaddress # <-- TAMBAHKAN BARIS INI

def generate_self_signed_cert(cert_path="cert.pem", key_path="key.pem"):
    # Generate our key
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=4096,
    )

    # Create a self-signed certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "ID"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "West Java"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "Cirebon"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "ColorAssist App"),
        x509.NameAttribute(NameOID.COMMON_NAME, "localhost"), # Penting untuk localhost
    ])
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.datetime.now(datetime.timezone.utc))
        .not_valid_after(
            datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365) # Valid for 1 year
        )
        .add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")) # <-- PERBAIKAN DI SINI
            ]),
            critical=False,
        )
        .sign(key, hashes.SHA256())
    )

    # Write our key to disk for use by Flask
    with open(key_path, "wb") as f:
        f.write(key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        ))

    # Write our certificate to disk for use by Flask
    with open(cert_path, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))

    print(f"Sertifikat '{cert_path}' dan kunci '{key_path}' berhasil dibuat.")
    print("Pastikan untuk menjalankan Flask dengan HTTPS menggunakan kedua file ini.")

if __name__ == "__main__":
    generate_self_signed_cert()
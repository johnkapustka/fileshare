from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import io

BLOCK_SIZE = 16  # AES block size is 16 bytes

def encrypt_file(file, key):
    cipher = AES.new(key, AES.MODE_CBC)
    ciphertext = cipher.encrypt(pad(file.read(), BLOCK_SIZE))
    return io.BytesIO(cipher.iv + ciphertext)

def decrypt_file(file, key):
    iv = file.read(16)
    cipher = AES.new(key, AES.MODE_CBC, iv=iv)
    return unpad(cipher.decrypt(file.read()), BLOCK_SIZE)

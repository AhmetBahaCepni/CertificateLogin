Download OpenSC for pkcs11 from: https://github.com/OpenSC/OpenSC/releases

Download Softhsm2 https://github.com/disig/SoftHSM2-for-Windows

softhsm2-util -v #Version check

softhsm2-util --show-slots # Check avaliable slots

softhsm2-util --init-token --slot 0 --label MyToken # 0. Slota MyToken adlı tokeni tanımla, enter SO and user pins.

openssl req -x509 -newkey rsa:2048 -keyout private.key -out certificate.crt -days 365 -subj "/CN=TestUser/O=Test Şirketi/C=TR" # openssl ile sertifgika oluştur

softhsm2-util --import certificate.crt --token <TokenAdı> --label "SERTİFİKA" --id <pins> --pin <pins>

/electron/.env fill HSM_LIB_PATH # example: HSM_LIB_PATH="C:\\SoftHSM2\\lib\\softhsm2-X64.dll"

Move Controller and Entity directories to your program

Call generate-code after you checked user login from username and passwrod this is a way of second control 
and wait the front code with sending is-verified request

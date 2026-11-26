import os, re, subprocess

url = os.environ.get("URL_EXEC", "").strip().rstrip("/")
if not re.fullmatch(r"https://script\.google\.com/macros/s/[^/\s]+/exec", url):
    raise SystemExit(f"URL tidak valid: {url}")

path = "index.html"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

if len(lines) < 195:
    raise SystemExit("Baris 195 tidak ditemukan di index.html")

indent = lines[194][:len(lines[194]) - len(lines[194].lstrip())]
lines[194] = f'{indent}const API_URL = "{url}";\n'

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Baris 195 diperbarui menjadi:", lines[194].strip())
subprocess.run(["git", "add", "index.html", "Kode.gs"], check=False)
subprocess.run(["git", "commit", "-m", "Update doPost dan pasang API_URL /exec di baris 195"], check=False)
subprocess.run(["git", "push", "origin", "main"], check=True)

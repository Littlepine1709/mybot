#!/data/data/com.termux/files/usr/bin/bash

# Aktifkan wakelock agar Termux tidak tidur
termux-wake-lock

# Masuk ke folder bot (pastikan path sesuai)
cd ~/mybot

# Jalankan atau hidupkan ulang bot dengan pm2
pm2 resurrect || pm2 start index.js

# Simpan proses agar bisa auto-resurrect
pm2 save

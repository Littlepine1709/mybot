#!/bin/bash

# Direktori yang akan dibackup
SOURCE_DIR="/data/data/com.termux/files/home/mybot"

# Remote destination di Google Drive (gunakan nama remote yang sudah dikonfigurasi sebelumnya)
DEST_DIR="gdrive:/Botsampbackup"

# Membuat backup
echo "Memulai backup dari $SOURCE_DIR ke $DEST_DIR"
rclone copy $SOURCE_DIR $DEST_DIR --progress

echo "Backup selesai!"

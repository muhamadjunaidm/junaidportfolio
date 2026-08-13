"""
Export Bundle Script for Hostinger Airo / AI Website Builder & Web Hosting Transfer
Domain: seichofi.xyz
Portfolio Owner: Muhamad Junaid
"""

import os
import zipfile
import json

def create_transfer_bundle():
    bundle_filename = 'airo_portfolio_transfer.zip'
    files_to_pack = [
        'index.html',
        'admin.html',
        'server.py',
        'works.json',
        'CNAME',
        'sitemap.xml',
        'robots.txt',
        'hero_portrait.png'
    ]

    print("Packing files for Airo Builder transfer...")
    
    with zipfile.ZipFile(bundle_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for filename in files_to_pack:
            if os.path.exists(filename):
                zipf.write(filename, arcname=filename)
                print(f"  + Packed: {filename}")
        
        # Include uploads folder if exists
        if os.path.exists('uploads') and os.path.isdir('uploads'):
            for root, dirs, files in os.walk('uploads'):
                for file in files:
                    file_path = os.path.join(root, file)
                    zipf.write(file_path, arcname=file_path)
                    print(f"  + Packed: {file_path}")

    print(f"\nSUCCESS: Transfer Bundle created at '{bundle_filename}'!")

if __name__ == '__main__':
    create_transfer_bundle()

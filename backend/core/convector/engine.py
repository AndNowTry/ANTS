import subprocess
import os
from PIL import Image


class FileConverter:
    def __init__(self):
        self.libreoffice_path = os.environ.get("LIBREOFFICE_PATH", "soffice")
        self.ffmpeg_path = os.environ.get("FFMPEG_PATH", "ffmpeg")

    def convert_image(self, input_path, output_ext, output_dir):
        img = Image.open(input_path)
        base = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base}.{output_ext}")

        if output_ext.lower() in ["jpg", "jpeg"]:
            img = img.convert("RGB")

        img.save(output_path)
        return output_path


    def convert_image_to_pdf(self, input_path, output_dir):
        img = Image.open(input_path)
        img = img.convert("RGB")

        base = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base}.pdf")
        img.save(output_path, "PDF", resolution=100.0)
        return output_path


    def convert_ffmpeg(self, input_path, output_ext, output_dir):
        base = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base}.{output_ext}")

        command = [
            self.ffmpeg_path,
            "-i", input_path,
            output_path,
            "-y"
        ]
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if not os.path.exists(output_path):
            raise Exception("FFmpeg failed")

        return output_path


    def convert_document_to_pdf(self, input_file_path, output_dir):
        command = [
            self.libreoffice_path,
            '--headless',
            '--convert-to', 'pdf',
            '--outdir', output_dir,
            input_file_path
        ]
        subprocess.run(command, check=True)

        base_name = os.path.splitext(os.path.basename(input_file_path))[0]
        pdf_path = os.path.join(output_dir, base_name + '.pdf')

        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF не создан: {pdf_path}")

        return pdf_path
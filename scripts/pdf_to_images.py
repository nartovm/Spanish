"""
Extract PDF pages to images for analysis.
Uses PyMuPDF (fitz) for rendering.
"""

import fitz  # PyMuPDF
import os
from pathlib import Path

def pdf_to_images(pdf_path: str, output_dir: str, dpi: int = 150):
    """Convert PDF pages to PNG images."""
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    print(f"Processing: {pdf_path.name} ({len(doc)} pages)")
    
    zoom = dpi / 72  # 72 is the default PDF DPI
    matrix = fitz.Matrix(zoom, zoom)
    
    num_pages = len(doc)
    for page_num in range(num_pages):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=matrix)
        
        output_path = output_dir / f"page_{page_num + 1:03d}.png"
        pix.save(str(output_path))
        print(f"  Saved: {output_path.name}")
    
    doc.close()
    print(f"Done! {num_pages} pages saved to {output_dir}")


if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    assets_dir = base_dir / "assets"
    
    # Extract exercises PDF
    exercises_pdf = assets_dir / "GC.B2.1.U1.Fotocopias.pdf"
    if exercises_pdf.exists():
        pdf_to_images(exercises_pdf, assets_dir / "exercises_images")
    
    # Extract solutions PDF
    solutions_pdf = assets_dir / "GC.B2.1.U1.Fotocopias.Solución.pdf"
    if solutions_pdf.exists():
        pdf_to_images(solutions_pdf, assets_dir / "solutions_images")

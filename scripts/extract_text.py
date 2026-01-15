"""
Extract text content from PDFs page by page.
"""

import fitz  # PyMuPDF
from pathlib import Path

def extract_pdf_text(pdf_path: str, output_dir: str):
    """Extract text from each PDF page to separate text files."""
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    num_pages = len(doc)
    print(f"Extracting text from: {pdf_path.name} ({num_pages} pages)")
    
    for page_num in range(num_pages):
        page = doc[page_num]
        text = page.get_text()
        
        output_path = output_dir / f"page_{page_num + 1:03d}.txt"
        output_path.write_text(text, encoding='utf-8')
        print(f"  Page {page_num + 1}: {len(text)} characters")
    
    doc.close()
    print(f"Done! {num_pages} pages extracted to {output_dir}\n")


if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    assets_dir = base_dir / "assets"
    
    # Extract exercises PDF text
    exercises_pdf = assets_dir / "GC.B2.1.U1.Fotocopias.pdf"
    if exercises_pdf.exists():
        extract_pdf_text(exercises_pdf, assets_dir / "exercises_text")
    
    # Extract solutions PDF text
    solutions_pdf = assets_dir / "GC.B2.1.U1.Fotocopias.Solución.pdf"
    if solutions_pdf.exists():
        extract_pdf_text(solutions_pdf, assets_dir / "solutions_text")

import os
import re
import pymupdf # PyMuPDF
import openai
import requests
from io import BytesIO
import textwrap
from PIL import Image, ImageDraw, ImageFont
import argparse
import json
import gc
from dotenv import load_dotenv

load_dotenv()
# Set up OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment")
openai.api_key = OPENAI_API_KEY

class ResearchPaperProcessor:
    def __init__(self, pdf_path, title, authors, abstract):
        self.pdf_path = pdf_path
        self.text = ""
        self.title = title
        self.authors = authors
        self.abstract = abstract
        self.sections = {}
        self.key_findings = []
        self.methodology = ""
        self.conclusions = ""
        self.figures = []
        self.concept_image = None
        self.conclusion_image = None

    def extract_text(self):
        """Extract text from PDF using PyMuPDF with memory optimization"""
        text = ""
        doc = pymupdf.open(self.pdf_path)

        # Process one page at a time to reduce memory usage
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
            page = None  # Help garbage collection

            # Clear memory every few pages
            if page_num % 5 == 0:
                gc.collect()

        doc.close()
        self.text = text
        return text

    def extract_metadata(self):
        # Try to find abstract
        # abstract_match = re.search(r'Abstract\s*\n(.*?)(?=\n\s*(?:Introduction|1\.|I\.))',
        #                          self.text, re.DOTALL | re.IGNORECASE)
        # if abstract_match:
        #     self.abstract = abstract_match.group(1).strip()
        #
        # # Authors often appear after title and before abstract
        # if title_match and abstract_match:
        #     authors_text = self.text[len(title_match.group(0)):self.text.find("Abstract")]
        #     # Clean up and keep only likely author lines
        #     author_lines = [line.strip() for line in authors_text.split('\n') if line.strip()
        #                    and not re.search(r'university|institute|department|email|@', line, re.IGNORECASE)]
        #     if author_lines:
        #         self.authors = ", ".join(author_lines)
        return

    def analyze_with_openai(self):
        """Use OpenAI to analyze the paper content"""
        # Prepare text chunks if paper is too long
        max_tokens = 3500  # Adjust based on model limits
        text_chunks = self._split_text(self.text, max_tokens)

        all_results = []
        for i, chunk in enumerate(text_chunks):
            print(f"Analyzing chunk {i+1}/{len(text_chunks)}...")
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",  # Using cheaper model to reduce costs
                messages=[
                    {"role": "system", "content": """
                    You are a research analyst specialized in extracting key information from academic papers.
                    Analyze the provided text and extract the following:
                    1. Key findings (3-5 bullet points)
                    2. Methodology summary
                    3. Main conclusions

                    Format your response as JSON with the following structure:
                    {
                        "key_findings": ["finding 1", "finding 2", ...],
                        "methodology": "brief methodology description",
                        "conclusions": "main conclusions",
                        "paper_topic": "brief description of paper topic for image generation"
                    }
                    """},
                    {"role": "user", "content": chunk}
                ]
            )
            try:
                result = json.loads(response.choices[0].message.content)
                all_results.append(result)
            except json.JSONDecodeError:
                print("Error parsing JSON from OpenAI response. Using text response instead.")
                # Fall back to text processing
                result_text = response.choices[0].message.content
                # Basic extraction from text response
                result = {
                    "key_findings": [],
                    "methodology": "",
                    "conclusions": "",
                    "paper_topic": ""
                }
                all_results.append(result)

        # Merge results from different chunks
        merged_results = {
            "key_findings": [],
            "methodology": "",
            "conclusions": "",
            "paper_topic": ""
        }

        for result in all_results:
            merged_results["key_findings"].extend(result.get("key_findings", []))
            merged_results["methodology"] += result.get("methodology", "") + " "
            merged_results["conclusions"] += result.get("conclusions", "") + " "
            if not merged_results["paper_topic"] and result.get("paper_topic"):
                merged_results["paper_topic"] = result.get("paper_topic")

        # Remove duplicates and trim
        merged_results["key_findings"] = list(set(merged_results["key_findings"]))[:5]
        merged_results["methodology"] = merged_results["methodology"].strip()
        merged_results["conclusions"] = merged_results["conclusions"].strip()

        # Update class attributes
        self.key_findings = merged_results["key_findings"]
        self.methodology = merged_results["methodology"]
        self.conclusions = merged_results["conclusions"]
        self.paper_topic = merged_results.get("paper_topic", self.title)

        # Generate images based on paper content
        self.generate_images()

        # Memory cleanup
        gc.collect()

    def generate_images(self):
        """Generate relevant images using OpenAI's DALL-E"""
        try:
            # Generate main concept image
            concept_prompt = f"Create a scientific illustration representing the concept of: {self.paper_topic}. Simple, professional, infographic style with no text."
            print("Generating main concept image...")
            response = openai.images.generate(
                model="dall-e-3",
                prompt=concept_prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_url = response.data[0].url

            # Download the image
            image_response = requests.get(image_url)
            self.concept_image = Image.open(BytesIO(image_response.content))

            # Generate a second image representing conclusions/implications if we have them
            if self.conclusions:
                conclusion_topic = self.conclusions[:100]  # Trim to prevent too specific prompts
                conclusion_prompt = f"Create a simple visual representation of research implications: {conclusion_topic}. Professional, infographic style, suitable for academic presentation."
                print("Generating conclusion visualization...")
                response = openai.images.generate(
                    model="dall-e-3",
                    prompt=conclusion_prompt,
                    size="1024x1024",
                    quality="standard",
                    n=1,
                )
                image_url = response.data[0].url

                # Download the image
                image_response = requests.get(image_url)
                self.conclusion_image = Image.open(BytesIO(image_response.content))

        except Exception as e:
            print(f"Error generating images: {e}")
            # Continue without images if generation fails
            pass

        # Memory cleanup
        gc.collect()

    def _split_text(self, text, max_tokens, overlap=100):
        """Split text into chunks with some overlap"""
        # Simple approximation: 1 token ≈ 4 characters for English text
        chars_per_chunk = max_tokens * 4

        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chars_per_chunk, len(text))

            if end < len(text):
                # Try to find a natural break point
                break_point = text.rfind('\n\n', start, end)
                if break_point == -1 or break_point < start + chars_per_chunk / 2:
                    break_point = text.rfind('. ', start, end)

                if break_point == -1 or break_point < start + chars_per_chunk / 2:
                    chunks.append(text[start:end])
                    start = end - overlap
                else:
                    chunks.append(text[start:break_point+1])
                    start = break_point + 1 - min(overlap, break_point - start)
            else:
                chunks.append(text[start:end])
                break

            start = max(start, 0)  # Ensure we don't go negative

        return chunks

    def shorten_text_with_openai(self, text, max_length=100):
        """Use OpenAI to shorten text if it's too long"""
        if len(text) <= max_length:
            return text

        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Shorten the following text while preserving key information. Keep it under 100 words."},
                    {"role": "user", "content": text}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error shortening text: {e}")
            # Fallback: manual shortening
            return text[:max_length] + "..."

    def create_infographic(self, output_path="infographic.png"):
        """Create a horizontal infographic with images on the left and text on the right"""
        # Create horizontal infographic image
        width, height = 2000, 1200  # Horizontal layout
        bg_color = (255, 255, 255)

        # Create image
        img = Image.new('RGB', (width, height), bg_color)
        draw = ImageDraw.Draw(img)

        # Try to load fonts, fall back to default if needed
        try:
            title_font = ImageFont.truetype("Arial Bold.ttf", 40)
            header_font = ImageFont.truetype("Arial Bold.ttf", 32)
            subheader_font = ImageFont.truetype("Arial Bold.ttf", 24)
            body_font = ImageFont.truetype("Arial.ttf", 20)
        except IOError:
            # Fall back to default font
            print("Default fonts not found. Using system default.")
            title_font = ImageFont.load_default()
            header_font = ImageFont.load_default()
            subheader_font = ImageFont.load_default()
            body_font = ImageFont.load_default()

        # Set colors
        title_color = (33, 33, 120)
        header_color = (33, 33, 120)
        text_color = (50, 50, 50)
        accent_color = (70, 130, 180)

        # Draw background elements
        draw.rectangle([(0, 0), (width, 120)], fill=accent_color)

        # Shorten long texts
        if self.abstract and len(self.abstract) > 250:
            self.abstract = self.shorten_text_with_openai(self.abstract, 250)
        if self.methodology and len(self.methodology) > 150:
            self.methodology = self.shorten_text_with_openai(self.methodology, 150)
        if self.conclusions and len(self.conclusions) > 150:
            self.conclusions = self.shorten_text_with_openai(self.conclusions, 150)

        # Draw title
        title_wrapped = textwrap.fill(self.title, width=70)
        draw.text((width//2, 60), title_wrapped, font=title_font, fill=(255, 255, 255), anchor="mm")

        # Draw author information
        if self.authors:
            authors_wrapped = textwrap.fill(f"By: {self.authors}", width=80)
            draw.text((width//2, 140), authors_wrapped, font=body_font, fill=text_color, anchor="mm")

        # Define layout dimensions
        # First column - Images (Left)
        col1_x = 60
        col1_width = 550  # Width for images

        # Second column - Abstract and Methodology (Middle)
        col2_x = col1_x + col1_width + 40
        col2_width = 600

        # Third column - Key Findings and Conclusions (Right)
        col3_x = col2_x + col2_width + 40
        col3_width = 600

        # Process images for left column
        img_y = 200

        # Place main concept image if available
        if self.concept_image:
            # Resize the image to be smaller but prominent
            img_width = 450  # Width for main image
            img_height = int(img_width * self.concept_image.height / self.concept_image.width)
            resized_image = self.concept_image.resize((img_width, img_height))

            # Center the image in the column
            img_x = col1_x + (col1_width - img_width) // 2
            img.paste(resized_image, (img_x, img_y))

            # Add conclusion image below if available
            if self.conclusion_image:
                conclusion_y = img_y + img_height + 60

                img_width = 350  # Smaller for conclusion image
                img_height = int(img_width * self.conclusion_image.height / self.conclusion_image.width)
                resized_image = self.conclusion_image.resize((img_width, img_height))

                img_x = col1_x + (col1_width - img_width) // 2
                img.paste(resized_image, (img_x, conclusion_y))

        else:
            # If no images, add a placeholder text
            draw.text((col1_x + col1_width//2, img_y + 200),
                      "No visualizations available", font=header_font, fill=text_color, anchor="mm")

        # Second column - Abstract and Methodology
        y_position = 200

        # Draw abstract section
        if self.abstract:
            draw.text((col2_x, y_position), "ABSTRACT", font=header_font, fill=header_color)
            y_position += 40
            abstract_wrapped = textwrap.fill(self.abstract, width=60)
            draw.text((col2_x, y_position), abstract_wrapped, font=body_font, fill=text_color)
            y_position += 200 + 10*len(self.abstract)/60
        # Draw methodology section
        if self.methodology:
            draw.text((col2_x, y_position), "METHODOLOGY", font=header_font, fill=header_color)
            y_position += 40
            methodology_wrapped = textwrap.fill(self.methodology, width=60)
            draw.text((col2_x, y_position), methodology_wrapped, font=body_font, fill=text_color)

        # Third column - Key Findings and Conclusions
        y_position = 200

        # Draw key findings
        if self.key_findings:
            draw.text((col3_x, y_position), "KEY FINDINGS", font=header_font, fill=header_color)
            y_position += 60

            for i, finding in enumerate(self.key_findings[:5]):  # Limit to 5 findings
                # Draw bullet point
                draw.ellipse([(col3_x, y_position), (col3_x + 15, y_position + 15)], fill=accent_color)

                # Draw finding text - possibly shorten if too long
                if len(finding) > 80:
                    finding = self.shorten_text_with_openai(finding, 80)

                finding_wrapped = textwrap.fill(finding, width=60)
                draw.text((col3_x + 25, y_position), finding_wrapped, font=body_font, fill=text_color)
                y_position += 70

            y_position += 20

        # Draw conclusions section
        if self.conclusions:
            draw.text((col3_x, y_position), "CONCLUSIONS", font=header_font, fill=header_color)
            y_position += 40
            conclusions_wrapped = textwrap.fill(self.conclusions, width=60)
            draw.text((col3_x, y_position), conclusions_wrapped, font=body_font, fill=text_color)

        # Add footer
        footer_y = height - 60
        draw.rectangle([(0, footer_y), (width, height)], fill=accent_color)
        draw.text((width//2, footer_y + 30),
                 "Automatically generated infographic", font=body_font, fill=(255, 255, 255), anchor="mm")

        # Save the infographic
        img.save(output_path, optimize=True, quality=90)
        print(f"Infographic saved to {output_path}")

        # Memory cleanup
        del draw
        if hasattr(self, 'concept_image') and self.concept_image:
            self.concept_image.close()
        if hasattr(self, 'conclusion_image') and self.conclusion_image:
            self.conclusion_image.close()
        img.close()

        return output_path

def main():
    parser = argparse.ArgumentParser(
        description='Generate an infographic from a research paper PDF'
    )
    parser.add_argument('pdf_path',
        help='Path to the PDF file')
    parser.add_argument('--title',
        required=True,
        help='Title of the paper')
    parser.add_argument('--authors',
        required=True,
        help='Comma-separated list of authors')
    parser.add_argument('--abstract',
        required=True,
        help='Abstract text')
    parser.add_argument('--output',
        default='infographic.png',
        help='Output file path (default: infographic.png)')
    parser.add_argument('--no-images',
        action='store_true',
        help='Disable image generation to save memory and API costs')
    args = parser.parse_args()

    if not os.path.exists(args.pdf_path):
        print(f"Error: PDF file not found at {args.pdf_path}")
        return

    # split the --authors string into a Python list

    try:
        print(f"Processing {args.pdf_path}…")
        processor = ResearchPaperProcessor(
            args.pdf_path,
            args.title,
            args.authors,
            args.abstract
        )

        print("Extracting text...")
        processor.extract_text()

        print("Extracting metadata...")
        processor.extract_metadata()

        print("Analyzing content with OpenAI...")
        processor.analyze_with_openai()

        print("Creating infographic...")
        infographic_path = processor.create_infographic(args.output)

        print(f"Done! Infographic saved to {infographic_path}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

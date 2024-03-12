from flask import Flask, request, jsonify,render_template
import openai
from PyPDF2 import PdfReader
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__,static_folder='build', static_url_path='')
CORS(app) 

# Configure your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def index():
     return "Flask API is running."

@app.route('/process_pdf', methods=['POST'])
def process_pdf():
    if 'pdf_file' not in request.files:
        return jsonify(error="No PDF file uploaded")

    pdf_file = request.files['pdf_file']

    # Check if the file is a PDF
    if not pdf_file.filename.endswith('.pdf'):
        return jsonify(error="Please upload a PDF file")

    # Read PDF content
    pdf_text = extract_text_from_pdf(pdf_file)

    # Get user query
    user_query = request.form.get('user_query')  # Access form data using request.form

    # Combine PDF text and user query
    combined_text = f"{user_query}\n\n{pdf_text}"

    # Send text to OpenAI API for processing
    openai_response = process_openai_api(combined_text)

    # Return the results as JSON
    return jsonify(openai_response=openai_response)

def extract_text_from_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""

    for page_num in range(len(pdf_reader.pages)):
        text += pdf_reader.pages[page_num].extract_text()

    return text

def process_openai_api(text):
    # Send the 'text' to OpenAI API and get the response
    # You need to replace 'your_model_id' with the actual model ID you want to use
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=text,
        max_tokens=200
    )

    return response.choices[0].text

if __name__ == '__main__':
    app.run(debug=True)

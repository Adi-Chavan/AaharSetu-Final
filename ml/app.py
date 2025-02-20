# from flask import Flask, render_template, request, send_file
# import pdfkit
# from jinja2 import Environment, FileSystemLoader

# app = Flask(__name__)

# # Set up pdfkit configuration (Update path as per your system)
# WKHTMLTOPDF_PATH = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'  # Change for Linux/Mac
# config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)

# @app.route('/')
# def home():
#     return render_template('index.html')

# @app.route('/generate', methods=['POST'])
# def generate_certificate():
#     recipient_name = request.form['name']

#     # Render the template with user data
#     template_loader = FileSystemLoader('templates')
#     env = Environment(loader=template_loader)
#     template = env.get_template('certificate_template.html')
#     rendered_html = template.render(recipient_name=recipient_name)

#     # Save the HTML to a file
#     html_file = 'generated_certificate.html'
#     with open(html_file, 'w', encoding='utf-8') as f:
#         f.write(rendered_html)

#     # Convert to PDF
#     pdf_file = 'certificate.pdf'
#     pdfkit.from_file(html_file, pdf_file, configuration=config)

#     return send_file(pdf_file, as_attachment=True)

# if __name__ == '__main__':
#     app.run(debug=True,port=5002)



# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import pdfkit
# from jinja2 import Environment, FileSystemLoader
# import os

# app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), "templates"))
# CORS(app)  # Allow cross-origin requests from React

# # Set up pdfkit configuration (Update path as per your system)
# WKHTMLTOPDF_PATH = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'  # Change for Linux/Mac
# config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)


# @app.route('/')
# def home():
#     return f"Aditya"

# @app.route('/debugs')
# def debug_templates():
#     return f"Aditya Don"


# @app.route('/generate', methods=['POST'])
# def generate_certificate():
#     data = request.get_json()  # Get JSON data from React
#     recipient_name = data.get('name')

#     # Render the template with user data
#     template_loader = FileSystemLoader('templates')
#     env = Environment(loader=template_loader)
#     template = env.get_template('certificate_template.html')
#     rendered_html = template.render(recipient_name=recipient_name)

#     # Save the HTML file temporarily
#     html_file = 'generated_certificate.html'
#     with open(html_file, 'w', encoding='utf-8') as f:
#         f.write(rendered_html)

#     # Convert to PDF
#     pdf_file = 'certificate.pdf'
#     pdfkit.from_file(html_file, pdf_file, configuration=config)

#     # Send the file back to React
#     return send_file(pdf_file, as_attachment=True)

# if __name__ == '__main__':
#     app.run(debug=True, port=5002)




# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import pdfkit
# from jinja2 import Environment, FileSystemLoader
# import os

# app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), "templates"))
# CORS(app)  # Allow cross-origin requests from React

# # Correct the path based on your OS
# # Windows example:
# WKHTMLTOPDF_PATH = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
# # Linux/Mac example:
# #   # Update this path
# config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)

# # Define the absolute path to the templates directory
# template_dir = os.path.join(os.path.dirname(__file__), 'templates')

# @app.route('/')
# def home():
#     return "Aditya"

# @app.route('/generate', methods=['POST'])
# def generate_certificate():
#     # Check if the request contains JSON data
#     if not request.is_json:
#         return jsonify({"error": "Request must be JSON"}), 400

#     data = request.get_json()
#     recipient_name = data.get('name')

#     # Validate required 'name' field
#     if not recipient_name:
#         return jsonify({"error": "Missing 'name' in request"}), 400

#     try:
#         # Set up Jinja2 environment with absolute template path
#         env = Environment(loader=FileSystemLoader(template_dir))
#         template = env.get_template('certificate_template.html')
#         rendered_html = template.render(recipient_name=recipient_name)

#         # Define file paths
#         html_file = os.path.join(os.path.dirname(__file__), 'generated_certificate.html')
#         pdf_file = os.path.join(os.path.dirname(__file__), 'certificate.pdf')

#         # Save the HTML file
#         with open(html_file, 'w', encoding='utf-8') as f:
#             f.write(rendered_html)

#         # Convert to PDF
#         pdfkit.from_file(html_file, pdf_file, configuration=config)

#         # Send the PDF file
#         return send_file(pdf_file, as_attachment=True)

#     except Exception as e:
#         # Log the error and return a response
#         app.logger.error(f"Error generating certificate: {str(e)}")
#         return jsonify({"error": "Failed to generate certificate", "details": str(e)}), 500

#     finally:
#         # Clean up temporary files
#         if os.path.exists(html_file):
#             os.remove(html_file)
#         if os.path.exists(pdf_file):
#             os.remove(pdf_file)

# if __name__ == '__main__':
#     app.run(debug=True, port=5002)




from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pdfkit
from jinja2 import Environment, FileSystemLoader
import os
import io  # Import BytesIO for in-memory file handling

app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), "templates"))
CORS(app)

# Configure the path to wkhtmltopdf
WKHTMLTOPDF_PATH = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'  # Adjust for your OS
config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)

template_dir = os.path.join(os.path.dirname(__file__), 'templates')


@app.route('/generate', methods=['POST'])
def generate_certificate():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    recipient_name = data.get('name')

    if not recipient_name:
        return jsonify({"error": "Missing 'name' in request"}), 400

    try:
        # Render HTML template
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template('certificate_template.html')
        rendered_html = template.render(recipient_name=recipient_name)

        # Generate PDF directly from HTML content (no temporary files)
        pdf_bytes = pdfkit.from_string(rendered_html, False, configuration=config)

        # Create in-memory bytes buffer for the PDF
        pdf_stream = io.BytesIO(pdf_bytes)

        # Send the PDF as a downloadable attachment
        return send_file(
            pdf_stream,
            as_attachment=True,
            download_name='certificate.pdf',
            mimetype='application/pdf'
        )

    except Exception as e:
        app.logger.error(f"Error generating certificate: {str(e)}")
        return jsonify({"error": "Failed to generate certificate", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)
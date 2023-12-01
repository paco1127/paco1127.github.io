from flask import Flask, request

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    
    # Save the uploaded file to a location
    file.save('uploaded_file.txt')
    
    # Execute your Python code on the uploaded file
    # ...

    # Return the result
    return 'File uploaded and processed successfully.'

if __name__ == '__main__':
    app.run()
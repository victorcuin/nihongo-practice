from flask import Flask, jsonify
from flask_cors import CORS
from models import db, Vocabulary, PracticeSet, WordInSet, WordProgress

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app) #this allows React frontend to make request

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nihongo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#initialize DB
db.init_app(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Nihongo Practice API!"})

@app.route('/api/test')
def test():
    return jsonify({"status": "success", "data": "Backend is working!"})

@app.route('/api/words', methods=['GET'])
def get_words():
    words = Vocabulary.query.all()
    return jsonify([word.to_dict() for word in words])

@app.route('/api/add-test-word', methods=['GET','POST'])
def add_test_word():
    test_word = Vocabulary(
        kanji = "勉強",
        hiragana_reading = "べんきょう",
        english_meaning = "study",
        word_type = "vocab"
    )
    db.session.add(test_word)
    db.session.commit()
    
    return jsonify({"message":"Test word added!", "word": test_word.to_dict()})

#create tables
with app.app_context():
    db.create_all()
    print("Database tables created!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)


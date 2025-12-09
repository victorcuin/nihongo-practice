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

@app.route('/api/practice-sets/<int:set_id>/words', methods=['GET'])
def get_set_words(set_id):
    word_in_sets = WordInSet.query.filter_by(set_id=set_id).all()
    words = [Vocabulary.query.get(wis.word_id).to_dict() for wis in word_in_sets]
    return jsonify(words)

@app.route('/api/words/add', methods=['POST'])
def add_word():
    from flask import request

    data = request.get_json()

    new_word = Vocabulary(
        kanji=data['kanji'],
        hiragana_reading=data['hiragana_reading'],
        english_meaning=data['english_meaning'],
        word_type=data.get('word_type', 'vocab'),
        category=data.get('category', 'other')
    )

    db.session.add(new_word)
    db.session.commit()

    return jsonify({"message": f"word '{data['kanji']}' added successfully!", "word": new_word.to_dict()})

@app.route('/api/practice-sets/add', methods=['POST'])
def add_practice_set():
    from flask import request

    data = request.get_json()
    new_set = PracticeSet(
        name=data['name']
    )

    db.session.add(new_set)
    db.session.commit()

    return jsonify({"message": f"Practice set '{data['name']}' creates successfully!", "set": new_set.to_dict()})

@app.route('/api/practice-sets', methods=['GET'])
def get_practice_sets():
    sets = PracticeSet.query.all()
    return jsonify([s.to_dict() for s in sets])

@app.route('/api/practice-sets/create-with-words', methods=['POST'])
def create_set_with_words():
    from flask import request
    
    data = request.get_json()
    
    # Create the practice set
    new_set = PracticeSet(name=data['name'])
    db.session.add(new_set)
    db.session.commit()
    
    # Add each word
    words_added = 0
    for word_data in data.get('words', []):
        # Create the word
        new_word = Vocabulary(
            kanji=word_data['kanji'],
            hiragana_reading=word_data['hiragana_reading'],
            english_meaning=word_data['english_meaning'],
            word_type=word_data.get('word_type', 'vocab')
        )
        db.session.add(new_word)
        db.session.commit()
        
        # Link word to set
        word_in_set = WordInSet(
            word_id=new_word.id,
            set_id=new_set.id
        )
        db.session.add(word_in_set)
        words_added += 1
    
    db.session.commit()
    
    return jsonify({
        "message": f"Practice set '{data['name']}' created with {words_added} words!",
        "set": new_set.to_dict()
    })

# Get single practice set details
@app.route('/api/practice-sets/<int:set_id>', methods=['GET'])
def get_practice_set(set_id):
    practice_set = PracticeSet.query.get(set_id)
    if not practice_set:
        return jsonify({"error": "Set not found"}), 404
    return jsonify(practice_set.to_dict())

# Update practice set
@app.route('/api/practice-sets/<int:set_id>/update', methods=['PUT'])
def update_practice_set(set_id):
    from flask import request
    
    data = request.get_json()
    
    # Update set name
    practice_set = PracticeSet.query.get(set_id)
    if not practice_set:
        return jsonify({"error": "Set not found"}), 404
    
    practice_set.name = data['name']
    
    # Get existing words in set
    existing_word_ids = [wis.word_id for wis in WordInSet.query.filter_by(set_id=set_id).all()]
    
    # Update existing words and add new ones
    updated_word_ids = []
    for word_data in data.get('words', []):
        if word_data.get('id'):
            # Existing word - update it
            word = Vocabulary.query.get(word_data['id'])
            if word:
                word.kanji = word_data['kanji']
                word.hiragana_reading = word_data['hiragana_reading']
                word.english_meaning = word_data['english_meaning']
                word.word_type = word_data.get('word_type', 'vocab')
                updated_word_ids.append(word.id)
        else:
            # New word - create it
            new_word = Vocabulary(
                kanji=word_data['kanji'],
                hiragana_reading=word_data['hiragana_reading'],
                english_meaning=word_data['english_meaning'],
                word_type=word_data.get('word_type', 'vocab')
            )
            db.session.add(new_word)
            db.session.commit()
            
            # Link to set
            word_in_set = WordInSet(word_id=new_word.id, set_id=set_id)
            db.session.add(word_in_set)
            updated_word_ids.append(new_word.id)
    
    # Remove words that were deleted
    for word_id in existing_word_ids:
        if word_id not in updated_word_ids:
            WordInSet.query.filter_by(set_id=set_id, word_id=word_id).delete()
    
    db.session.commit()
    
    return jsonify({"message": f"Practice set '{data['name']}' updated successfully!"})
if __name__ == '__main__':
    app.run(debug=True, port=5000)


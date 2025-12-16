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

@app.route('/api/practice/answer', methods=['POST'])
def record_answer():
    from flask import request

    data = request.get_json()
    word_id = data['word_id']
    set_id = data['set_id']
    is_correct = data['is_correct']

    #Find or create progress record for this word in this set
    progress = WordProgress.query.filter_by(word_id=word_id, set_id=set_id).first()

    if not progress:
        #Create new progess record
        progress = WordProgress(
            word_id=word_id,
            set_id=set_id,
            correct_count=0,
            incorrect_count=0
        )
        db.session.add(progress)
    #update counts
    if is_correct:
        progress.correct_count += 1
    else:
        progress.incorrect_count +=1
        #cancel out one correct
        if progress.correct_count > 0:
            progress.correct_count -= 1
    #update last practiced time
    from datetime import datetime
    progress.last_practiced = datetime.utcnow()

    #Check if mastered (10+ net correct)
    if progress.correct_count >= 10:
        progress.is_mastered = True
    else:
        progress.is_mastered = False
    
    #Check if struggling (more wrong than right)
    if progress.incorrect_count > progress.correct_count:
        progress.is_struggling = True
    else:
        progress.is_struggling = False

    db.session.commit()

    return jsonify({
        "message": "Progress recorded",
        "progress": progress.to_dict()
    })

@app.route('/api/practice-sets/<int:set_id>/progress', methods=['GET'])
def get_set_progress(set_id):
    progress_records = WordProgress.query.filter_by(set_id=set_id).all()
    return jsonify([p.to_dict() for p in progress_records])

@app.route('/api/practice-sets/<int:set_id>/struggling-words', methods=['GET'])
def get_struggling_words(set_id):
    # Get words marked as struggling in this set
    struggling_progress = WordProgress.query.filter_by(set_id=set_id, is_struggling=True).all()
    
    words = []
    for progress in struggling_progress:
        word = Vocabulary.query.get(progress.word_id)
        word_dict = word.to_dict()
        word_dict['correct_count'] = progress.correct_count
        word_dict['incorrect_count'] = progress.incorrect_count
        word_dict['is_struggling'] = progress.is_struggling
        words.append(word_dict)
    
    return jsonify(words)


if __name__ == '__main__':
    app.run(debug=True, port=5000)


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy() #creates a db object that we will use to define our tables

class Vocabulary(db.Model):
    __tablename__ = 'vocabulary'

    id = db.Column(db.Integer, primary_key=True)
    kanji = db.Column(db.String(100), nullable=False)
    hiragana_reading = db.Column(db.String(100), nullable=False)
    english_meaning = db.Column(db.String(200), nullable=False)
    word_type = db.Column(db.String(50)) # 'vocab', 'kanji', 'onomatopoeia'
    category = db.Column(db.String(50)) # 'work', 'family', 'school', etc.

    def to_dict(self):
        return {
            'id': self.id,
            'kanji': self.kanji,
            'hiragana_reading': self.hiragana_reading,
            'english_meaning': self.english_meaning,
            'word_type': self.word_type,
            'category': self.category
        }

class PracticeSet(db.Model):
    __tablename__ = 'practice_set'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime,default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }
    
class WordInSet(db.Model):
    __tablename__ = 'word_in_set'

    id = db.Column(db.Integer, primary_key=True)
    word_id = db.Column(db.Integer,db.ForeignKey('vocabulary.id'), nullable=False)
    set_id = db.Column(db.Integer,db.ForeignKey('practice_set.id'),nullable=False)
    added_at = db.Column(db.DateTime,default=datetime.utcnow)

    #relationships
    word = db.relationship('Vocabulary', backref='in_sets')
    practice_set = db.relationship('PracticeSet', backref='words')

    def to_dict(self):
        return{
            'id': self.id,
            'word_id': self.word_id,
            'set_id': self.set_id,
            'added_at': self.added_at.isoformat()
        }
    
class WordProgress(db.Model):
    __tablename__ = 'word_progress'

    id = db.Column(db.Integer, primary_key=True)
    word_id = db.Column(db.Integer, db.ForeignKey('vocabulary.id'), nullable=False)
    set_id = db.Column(db.Integer, db.ForeignKey('practice_set.id'), nullable=False)
    correct_count = db.Column(db.Integer, default=0)
    incorrect_count = db.Column(db.Integer, default=0)
    last_practiced = db.Column(db.DateTime, nullable=True)
    is_struggling = db.Column(db.Boolean, default=False) #in this sets struggling pile
    is_mastered = db.Column(db.Boolean, default=False) #in global mastered pile?

    word = db.relationship('Vocabulary', backref='progress')
    practice_set = db.relationship('PracticeSet', backref='word_progress')

    def to_dict(self):
        return {
            'id': self.id,
            'word_id': self.word_id,
            'set_id': self.set_id,
            'correct_count': self.correct_count,
            'incorrect_count': self.incorrect_count,
            'last_practiced': self.last_practiced.isoformat() if self.last_practiced else None,
            'is_struggling': self.is_struggling,
            'is_mastered': self.is_mastered
        }
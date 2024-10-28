#PENDIENTE REVISAR ESTE ARCHIVO. FLASK RUN INDICA QUE LA RUTA NO ES CORRECTA
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

db = SQLAlchemy(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Importa las rutas después de inicializar la app y la base de datos
from routes import auth_blueprint
app.register_blueprint(auth_blueprint)

if __name__ == "__main__":
    app.run(debug=True)

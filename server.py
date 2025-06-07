from flask import Flask, render_template, request, jsonify
import os
import sys

app = Flask(__name__)

# Base de datos en memoria
users_db = {}

# Importar el grafo de manera segura
try:
    from graph_simple import GraphSimple
    grafo = GraphSimple()
    print("Grafo inicializado correctamente")
except Exception as e:
    print(f"Error importando grafo: {e}")
    grafo = None

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Error cargando página: {str(e)}", 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({'error': 'Todos los campos son obligatorios'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        if email in users_db:
            return jsonify({'error': 'El email ya está registrado'}), 400
        
        users_db[email] = {
            'name': name,
            'email': email,
            'password': password
        }
        
        return jsonify({'message': 'Usuario registrado exitosamente'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error en registro: {str(e)}'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email y contraseña son obligatorios'}), 400
        
        if email in users_db and users_db[email]['password'] == password:
            return jsonify({
                'message': 'Login exitoso',
                'user': {
                    'name': users_db[email]['name'],
                    'email': email
                }
            }), 200
        
        return jsonify({'error': 'Email o contraseña incorrectos'}), 401
        
    except Exception as e:
        return jsonify({'error': f'Error en login: {str(e)}'}), 500

@app.route('/calculate_route', methods=['POST'])
def calculate_route():
    try:
        if not grafo:
            return jsonify({'error': 'Grafo no disponible'}), 500
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
            
        origin = data.get('origin')
        destination = data.get('destination')
        
        if origin is None or destination is None:
            return jsonify({'error': 'Origen y destino son obligatorios'}), 400
        
        if not (0 <= origin < 6) or not (0 <= destination < 6):
            return jsonify({'error': 'Los nodos deben estar entre 0 y 5'}), 400
        
        if origin == destination:
            return jsonify({'error': 'El origen y destino deben ser diferentes'}), 400
        
        path, total_time = grafo.get_shortest_path(origin, destination)
        
        if not path:
            return jsonify({'error': 'No se encontró ruta entre los nodos'}), 404
        
        return jsonify({
            'path': path,
            'total_time': total_time,
            'origin': origin,
            'destination': destination
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error calculando ruta: {str(e)}'}), 500

@app.route('/health')
def health():
    try:
        return jsonify({
            'status': 'OK',
            'users_count': len(users_db),
            'grafo_available': grafo is not None
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error en health check: {str(e)}'}), 500

@app.route('/test')
def test():
    return "MoviSimple funciona correctamente!"

# Manejo de errores global
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Ruta no encontrada'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

# Para Vercel
if __name__ == '__main__':
    print("Iniciando MoviSimple...")
    print(f"Python version: {sys.version}")
    print(f"Usuarios en memoria: {len(users_db)}")
    app.run(debug=False, host='0.0.0.0', port=5000)

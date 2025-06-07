from flask import Flask, send_from_directory, jsonify
from graph_simple import GraphSimple
import os

app = Flask(_name_)

# Instancia global del grafo
grafo = GraphSimple()

# Simulación de users.txt en memoria (para Vercel)
users_db = {}

@app.route('/')
def index():
    """Sirve la página principal"""
    return send_from_directory('.', 'index.html')

@app.route('/api/register', methods=['POST'])
def register():
    """Endpoint para registro de usuarios (simula users.txt)"""
    try:
        from flask import request
        data = request.get_json()
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({'error': 'Todos los campos son obligatorios'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        if email in users_db:
            return jsonify({'error': 'El email ya está registrado'}), 400
        
        # Simular guardado en users.txt
        users_db[email] = {
            'name': name,
            'email': email,
            'password': password
        }
        
        return jsonify({'message': 'Usuario registrado exitosamente'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error en registro: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Endpoint para autenticación de usuarios"""
    try:
        from flask import request
        data = request.get_json()
        
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

@app.route('/api/calculate_route', methods=['POST'])
def calculate_route():
    """Endpoint para calcular ruta usando Dijkstra"""
    try:
        from flask import request
        data = request.get_json()
        
        origin = data.get('origin')
        destination = data.get('destination')
        
        if origin is None or destination is None:
            return jsonify({'error': 'Origen y destino son obligatorios'}), 400
        
        if not (0 <= origin < 6) or not (0 <= destination < 6):
            return jsonify({'error': 'Los nodos deben estar entre 0 y 5'}), 400
        
        if origin == destination:
            return jsonify({'error': 'El origen y destino deben ser diferentes'}), 400
        
        # Usar la clase GraphSimple para calcular la ruta
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

@app.route('/api/graph_info')
def graph_info():
    """Endpoint para obtener información del grafo"""
    try:
        info = {
            'num_nodes': grafo.num_nodes,
            'edges': [],
            'total_users': len(users_db)
        }
        
        # Obtener todas las aristas
        for node in range(grafo.num_nodes):
            for neighbor, weight in grafo.edges[node]:
                if node < neighbor:  # Evitar duplicados
                    info['edges'].append([node, neighbor, weight])
        
        return jsonify(info), 200
        
    except Exception as e:
        return jsonify({'error': f'Error obteniendo info: {str(e)}'}), 500

# Para desarrollo local
if _name_ == '_main_':
    print("=== MoviSimple Server ===")
    print("Servidor iniciado en http://localhost:5000")
    print("Grafo inicializado con 6 nodos y 9 aristas")
    app.run(debug=True, host='0.0.0.0', port=5000)

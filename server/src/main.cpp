#define CPPHTTPLIB_OPENSSL_SUPPORT // 1. Habilitar soporte HTTPS
#include "httplib.h"               // Servidor y Cliente HTTP
#include "json.hpp"                // Manipulación de JSON
#include <iostream>
#include <chrono>                  // Para medir tiempos y timestamps

// Alias para no escribir nlohmann::json cada vez
using json = nlohmann::json;

int main() {
    // 2. Instanciar el servidor de la API
    httplib::Server svr;

    std::cout << "Iniciando servidor API PIGS..." << std::endl;

    // 3. Definir el Endpoint (Ruta) que escuchará al Frontend
    // Usamos una Lambda (función anónima) de C++11 para manejar la petición
    svr.Post("/api/datos", [](const httplib::Request& req, httplib::Response& res) {
        
        // --- CABECERAS CORS (Crucial para WebStorm) ---
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");

        try {
            // 4. Procesar los datos recibidos del Frontend
            // req.body contiene el JSON que envía tu pareja desde JS
            auto datos_recibidos = json::parse(req.body);
            std::cout << "Peticion recibida: " << datos_recibidos.dump() << std::endl;

            // 5. Lógica de negocio en C++11
            // Vamos a añadir un campo "procesado_por_cpp" y la hora actual
            auto now = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
            datos_recibidos["timestamp_api"] = std::ctime(&now);
            datos_recibidos["estado"] = "validado";

            // 6. ENVIAR A FIREBASE (Cliente HTTPS)
            // IMPORTANTE: Sustituye con tu URL de Firebase Realtime Database
            httplib::Client cli("https://tu-proyecto-default-rtdb.firebaseio.com");
            
            // En Windows a veces hay problemas con los certificados raíz, 
            // esto permite la conexión segura aunque el certificado no se valide localmente
            cli.enable_server_certificate_verification(false);

            // Hacemos el POST a Firebase. El ".json" al final es obligatorio en su API.
            auto res_fb = cli.Post("/datos.json", datos_recibidos.dump(), "application/json");

            // 7. Responder al Frontend basado en el éxito de Firebase
            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
                std::cout << "Exito: Datos guardados en Firebase." << std::endl;
            } else {
                throw std::runtime_error("Firebase no respondio correctamente.");
            }

        } catch (const std::exception& e) {
            // Manejo de errores para que la API no se detenga
            res.status = 500;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
            std::cerr << "Error en el servidor: " << e.what() << std::endl;
        }
    });

    // 8. Manejo del Preflight (OPTIONS)
    // Los navegadores modernos preguntan antes de enviar datos reales
    svr.Options(R"(/.*)", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
    });

    // 9. Poner el servidor en escucha
    // "0.0.0.0" permite conexiones desde cualquier IP de tu red local
    std::cout << "API escuchando en http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);

    return 0;
}
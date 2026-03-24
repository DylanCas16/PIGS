#ifdef _WIN32
#ifndef _WIN32_WINNT
  #define _WIN32_WINNT 0x0A00
#endif
#define CPPHTTPLIB_NO_UWP_SUPPORT
#endif

#define CPPHTTPLIB_OPENSSL_SUPPORT
#include "httplib.h"
#include "json.hpp"
#include <iostream>

// Alias para no escribir nlohmann::json cada vez
using json = nlohmann::json;

int main() {
    // Instanciar el servidor de la API
    httplib::Server port;

    std::cout << "Iniciando servidor API PIGS..." << std::endl;

    // Definir el Endpoint (Ruta) que escuchará al Frontend
    // Usamos una Lambda (función anónima) de C++11 para manejar la petición
    port.Post("/api/datos", [](const httplib::Request& req, httplib::Response& res) {
        
        // --- CABECERAS CORS (Crucial para WebStorm) ---
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");

        try {
            // Procesar los datos recibidos del Frontend
            // req.body contiene el JSON que envía tu pareja desde JS
            auto datos_recibidos = json::parse(req.body);
            std::cout << "Peticion recibida: " << datos_recibidos.dump() << std::endl;

            // Lógica de negocio en C++11
            auto now = std::chrono::system_clock::to_time_t(std::chrono::system_clock::now());
            datos_recibidos["timestamp_api"] = std::ctime(&now);
            datos_recibidos["estado"] = "validado";

            // ENVIAR A FIREBASE (Cliente HTTPS)
            httplib::Client cli("https://alis-pigs-default-rtdb.firebaseio.com");

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
    port.Options(R"(/.*)", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
    });

    // 9. Poner el servidor en escucha
    // "0.0.0.0" permite conexiones desde cualquier IP de tu red local
    std::cout << "API escuchando en http://localhost:8080" << std::endl;
    port.listen("0.0.0.0", 8080);

    return 0;
}
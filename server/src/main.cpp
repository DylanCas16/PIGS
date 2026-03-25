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

using json = nlohmann::json;

const std::string FIREBASE_HOST = "https://alis-pigs-default-rtdb.firebaseio.com";

void set_cors(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    httplib::Server svr;

    // GET: Obtain all the supply lists from the database
    svr.Get("/api/supplies", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        httplib::Client cli(FIREBASE_HOST);
        cli.enable_server_certificate_verification(false);

        auto res_fb = cli.Get("/supplies.json");
        if (res_fb && res_fb->status == 200) {
            res.status = 200;
            res.set_content(res_fb->body, "application/json");
        } else {
            res.status = 500;
            res.set_content(R"({"error": "Error trying to read Firebase"})", "application/json");
        }
    });

    // GET: Obtain all the information about a single supply list
    svr.Get("/api/supplies/([^/]+)", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            std::string const supply_id = req.matches[1];
            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            auto res_fb = cli.Get("/supplies/" + supply_id + ".json");
            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            }
        } catch (...){
            res.status = 400;
            res.set_content(R"({"error": "JSON invalid"})", "application/json");
        }
    });

    // POST: Create a new supply list
    svr.Post("/api/supplies/?", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);

        try {
            auto const data = json::parse(req.body);
            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);
            auto res_fb = cli.Post("/supplies.json", data.dump(), "application/json");

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            }
        } catch (...) {
            res.status = 400;
            res.set_content(R"({"error": "JSON invalid"})", "application/json");
        }
    });

    // DELETE: Delete a supply list by its ID
    svr.Delete(R"(/api/supplies/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try
        {
            std::string const supply_id = req.matches[1];
            std::cout << "Trying to delete the supply list: " << supply_id << std::endl;

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/supplies/" + supply_id + ".json";
            auto res_fb = cli.Delete(url);

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(R"({"message": "Supply list deleted correctly"})", "application/json");
            } else
            {
                res.status = 500;
                res.set_content(R"({"error": "Error trying to delete the supply list"})", "application/json");
            }
        } catch (const std::exception& e) {
            std::cerr << "Exception: " << e.what() << std::endl;
            res.status = 500;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });

    // POST: Add an item to a specific supply list
    svr.Post("/api/supplies/([^/]+)/items/?", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        try {
            auto data = json::parse(req.body);
            std::string const supply_id = req.matches[1];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/supplies/" + supply_id + "/items.json";
            auto res_fb = cli.Post(url, data.dump(), "application/json");

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            }
        } catch (...) {
            res.status = 400;
            res.set_content(R"({"error": "Missing data or JSON invalid"})", "application/json");
        }
    });

    //PUT: updating an item from a list.
    svr.Put(R"(/api/supplies/([^/]+)/items/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            auto data = json::parse(req.body);
            std::string const supply_id = req.matches[1];
            std::string const item_id = req.matches[2];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/supplies/" + supply_id + "/items/" + item_id + ".json";
            auto res_fb = cli.Put(url, data.dump(), "application/json");

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            }
        } catch (...) {
            res.status = 400;
            res.set_content(R"({"error": "Missing data or JSON invalid"})", "application/json");
        }
    });

    // DELETE: delete an item from a list.
    svr.Delete(R"(/api/supplies/([^/]+)/items/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            std::string const supply_id = req.matches[1];
            std::string const item_id = req.matches[2];
            std::cout << "Trying to delete an item: " << item_id << std::endl;

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/supplies/" + supply_id + "/items/" + item_id + ".json";
            auto res_fb = cli.Delete(url);

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(R"({"message": "Item deleted correctly"})", "application/json");
            } else
            {
                res.status = 500;
                res.set_content(R"({"error": "Error trying to delete the item"})", "application/json");
            }
        } catch (const std::exception& e) {
            std::cerr << "Exception: " << e.what() << std::endl;
            res.status = 500;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });

    svr.Options(R"(/.*)", [](const httplib::Request&, httplib::Response& res) {
        set_cors(res);
        res.status = 200;
    });

    std::cout << "API PIGS listening en http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
    return 0;
}
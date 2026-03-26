#include "supplies.h"
#include "../helpers.h"
#include <iostream>

using json = nlohmann::json;

void register_supply_routes(httplib::Server& svr) {
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
}
#include "../helpers.h"
#include "items.h"
#include <iostream>

using json = nlohmann::json;

void register_item_routes(httplib::Server& svr) {
    svr.Post(R"(/api/users/([^/]+)/supplies/([^/]+)/items/?)", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        try {
            auto data = json::parse(req.body);
            std::string const user_id = req.matches[1];
            std::string const supply_id = req.matches[2];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/supplies/" + supply_id + "/items.json";
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

    svr.Put(R"(/api/users/([^/]+)/supplies/([^/]+)/items/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            auto data = json::parse(req.body);
            std::string const user_id = req.matches[1];
            std::string const supply_id = req.matches[2];
            std::string const item_id = req.matches[3];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/supplies/" + supply_id + "/items/" + item_id + ".json";
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

    svr.Delete(R"(/api/users/([^/]+)/supplies/([^/]+)/items/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            std::string const user_id = req.matches[1];
            std::string const supply_id = req.matches[2];
            std::string const item_id = req.matches[3];

            std::cout << "Trying to delete an item: " << item_id << " from supply: " << supply_id << " for user: " << user_id << std::endl;

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/supplies/" + supply_id + "/items/" + item_id + ".json";
            auto res_fb = cli.Delete(url);

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(R"({"message": "Item deleted correctly"})", "application/json");
            } else {
                res.status = 500;
                res.set_content(R"({"error": "Error trying to delete the item"})", "application/json");
            }
        } catch (const std::exception& e) {
            std::cerr << "Exception: " << e.what() << std::endl;
            res.status = 500;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });
}
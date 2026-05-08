#include "../helpers.h"
#include "httplib.h"
#include <iostream>

using json = nlohmann::json;

void register_expense_routes(httplib::Server& svr) {

    svr.Get(R"(/api/users/([^/]+)/expenses/?)", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        std::string const user_id = req.matches[1];

        httplib::Client cli(FIREBASE_HOST);
        cli.enable_server_certificate_verification(false);

        std::string const url = "/users/" + user_id + "/expenses.json";
        auto res_fb = cli.Get(url);

        if (res_fb && res_fb->status == 200) {
            res.status = 200;
            std::string body = res_fb->body == "null" ? "{}" : res_fb->body;
            res.set_content(body, "application/json");
        } else {
            res.status = 400;
            res.set_content(R"({"error": "Server error reading from Firebase"})", "application/json");
        }
    });


    svr.Post(R"(/api/users/([^/]+)/expenses/?)", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        try {
            auto data = json::parse(req.body);
            std::string const user_id = req.matches[1];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/expenses.json";
            auto res_fb = cli.Post(url, data.dump(), "application/json");

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            } else {
                std::cerr << "Firebase POST Error: " << (res_fb ? std::to_string(res_fb->status) : "No Response") << std::endl;
                res.status = 500;
                res.set_content(R"({"error": "Firebase refused to save the data."})", "application/json");
            }
        } catch (...) {
            res.status = 400;
            res.set_content(R"({"error": "Invalid JSON"})", "application/json");
        }
    });

    svr.Delete(R"(/api/users/([^/]+)/expenses/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            std::string const user_id = req.matches[1];
            std::string const expense_id = req.matches[2];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/expenses/" + expense_id + ".json";
            auto res_fb = cli.Delete(url);

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(R"({"message": "Expense deleted"})", "application/json");
            } else {
                res.status = 500;
                res.set_content(R"({"error": "Firebase refused to delete the data."})", "application/json");
            }
        } catch (...) {
            res.status = 500;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });
}
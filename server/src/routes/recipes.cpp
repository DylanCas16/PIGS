#include "../helpers.h"
#include "httplib.h"

using json = nlohmann::json;

void register_recipe_routes(httplib::Server& svr) {
    svr.Get(R"(/api/users/([^/]+)/recipes/?)", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        httplib::Client cli(FIREBASE_HOST);
        cli.enable_server_certificate_verification(false);

        std::string const user_id = req.matches[1];
        std::string const url = "/users/" + user_id + "/recipes.json";

        auto const res_fb = cli.Get(url);
        if (res_fb && res_fb->status == 200) {
            res.status = 200;
            std::string body = res_fb->body == "null" ? "{}" : res_fb->body;
            res.set_content(body, "application/json");
        } else {
            res.status = 400;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });

    svr.Get(R"(/api/users/([^/]+)/recipes/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        httplib::Client cli(FIREBASE_HOST);
        cli.enable_server_certificate_verification(false);

        std::string const user_id = req.matches[1];
        std::string const recipe_id = req.matches[2];

        std::string const url = "/users/" + user_id + "/recipes/" + recipe_id + ".json";

        auto const res_fb = cli.Get(url);
        if (res_fb && res_fb->status == 200) {
            res.status = 200;
            res.set_content(res_fb->body, "application/json");
        } else {
            res.status = 400;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });

    svr.Post(R"(/api/users/([^/]+)/recipes/?)", [](const httplib::Request& req, httplib::Response& res) {
        set_cors(res);
        try {
            auto const data = json::parse(req.body);
            std::string const user_id = req.matches[1];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/recipes.json";
            auto res_fb = cli.Post(url, data.dump(), "application/json");

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            }
        } catch (...) {
            res.status = 400;
            res.set_content(R"({"error": "JSON invalid"})", "application/json");
        }
    });

    svr.Put(R"(/api/users/([^/]+)/recipes/([^/]+))", [](const httplib::Request& req, httplib::Response& res){
        set_cors(res);
        try {
            auto data = json::parse(req.body);
            std::string const user_id = req.matches[1];
            std::string const recipe_id = req.matches[2];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/recipes/" + recipe_id + ".json";
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

    svr.Delete(R"(/api/users/([^/]+)/recipes/([^/]+))", [](const httplib::Request& req, httplib::Response& res) {
       set_cors(res);
        try {
            std::string const user_id = req.matches[1];
            std::string const recipe_id = req.matches[2];

            httplib::Client cli(FIREBASE_HOST);
            cli.enable_server_certificate_verification(false);

            std::string const url = "/users/" + user_id + "/recipes/" + recipe_id + ".json";
            auto const res_fb = cli.Delete(url);

            if (res_fb && res_fb->status == 200) {
                res.status = 200;
                res.set_content(res_fb->body, "application/json");
            } else {
                res.status = 400;
                res.set_content(R"({"error": "Invalid recipe ID"})", "application/json");
            }
        } catch (...) {
            res.status = 500;
            res.set_content(R"({"error": "Server error"})", "application/json");
        }
    });
}